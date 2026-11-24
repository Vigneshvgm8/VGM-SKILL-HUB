import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSupabaseClient } from './supabase.js';

// Configurable upload settings
const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 5 * 1024 * 1024; // 5 MB default
const UPLOADS_DIR = path.resolve(process.cwd(), 'storage', 'uploads');

// Ensure isolated storage directory exists outside public web root
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Whitelisted MIME types and their corresponding magic bytes
interface FileTypeSignature {
  mime: string;
  extension: string;
  validateBytes: (buffer: Buffer) => boolean;
}

const ALLOWED_SIGNATURES: FileTypeSignature[] = [
  {
    mime: 'application/pdf',
    extension: 'pdf',
    // %PDF- (0x25 0x50 0x44 0x46)
    validateBytes: (buf: Buffer) =>
      buf.length >= 4 &&
      buf[0] === 0x25 &&
      buf[1] === 0x50 &&
      buf[2] === 0x44 &&
      buf[3] === 0x46,
  },
  {
    mime: 'image/png',
    extension: 'png',
    // \x89PNG (0x89 0x50 0x4E 0x47)
    validateBytes: (buf: Buffer) =>
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4E &&
      buf[3] === 0x47,
  },
  {
    mime: 'image/jpeg',
    extension: 'jpg',
    // \xFF\xD8\xFF
    validateBytes: (buf: Buffer) =>
      buf.length >= 3 &&
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff,
  },
  {
    mime: 'image/webp',
    extension: 'webp',
    // RIFF....WEBP
    validateBytes: (buf: Buffer) =>
      buf.length >= 12 &&
      buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP',
  },
];

// Helper to inspect content buffer and match with verified magic bytes
export function detectMagicBytes(buffer: Buffer): FileTypeSignature | null {
  for (const sig of ALLOWED_SIGNATURES) {
    if (sig.validateBytes(buffer)) {
      return sig;
    }
  }
  return null;
}

// Secure file upload handler
export async function handleSecureUpload(req: Request, res: Response) {
  try {
    const rawBuffer = (req as any).rawBody || (req.body && Buffer.isBuffer(req.body) ? req.body : null);

    if (!rawBuffer || rawBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No file data received in upload request.'
      });
    }

    if (rawBuffer.length > MAX_UPLOAD_SIZE) {
      return res.status(400).json({
        success: false,
        error: `File exceeds maximum allowed size of ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`
      });
    }

    // Magic bytes content inspection (validates true content, NOT just user extension)
    const matchedSignature = detectMagicBytes(rawBuffer);
    if (!matchedSignature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or unsupported file content. Only verified PDF, PNG, JPG, and WEBP documents are permitted.'
      });
    }

    // Generate secure randomized UUID filename to prevent directory traversal
    const safeFilename = `${crypto.randomUUID()}.${matchedSignature.extension}`;
    const destinationPath = path.join(UPLOADS_DIR, safeFilename);

    // Write file to isolated disk storage outside web root
    fs.writeFileSync(destinationPath, rawBuffer);

    // If Supabase Storage is configured, sync to Supabase bucket
    const supabase = getSupabaseClient();
    let supabaseUrl: string | null = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(safeFilename, rawBuffer, {
            contentType: matchedSignature.mime,
            upsert: false
          });

        if (!error && data) {
          supabaseUrl = data.path;
        }
      } catch (e) {
        console.warn('[STORAGE] Supabase storage bucket sync skipped:', e);
      }
    }

    return res.json({
      success: true,
      filename: safeFilename,
      mimeType: matchedSignature.mime,
      sizeBytes: rawBuffer.length,
      downloadUrl: `/api/files/${safeFilename}`,
      supabasePath: supabaseUrl
    });
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while storing the uploaded file.'
    });
  }
}

// Secure file retrieval handler (prevents execution as code, forces download / sandbox)
export function handleSecureFileServe(req: Request, res: Response) {
  try {
    const rawFilename = req.params.filename;
    // Strict basename sanitization prevents directory traversal (e.g. ../../etc/passwd)
    const sanitizedFilename = path.basename(rawFilename);

    // Only allow alphanumeric UUID + allowed extensions
    if (!/^[a-f0-9-]+\.(pdf|png|jpg|webp)$/i.test(sanitizedFilename)) {
      return res.status(400).json({ error: 'Invalid file identifier format.' });
    }

    const filePath = path.join(UPLOADS_DIR, sanitizedFilename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found.' });
    }

    const ext = path.extname(sanitizedFilename).toLowerCase();
    const sig = ALLOWED_SIGNATURES.find(s => `.${s.extension}` === ext);
    const contentType = sig?.mime || 'application/octet-stream';

    // Security Headers: NEVER execute as code
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error('[FILE SERVE ERROR]', err);
    res.status(500).json({ error: 'Failed to retrieve file.' });
  }
}
