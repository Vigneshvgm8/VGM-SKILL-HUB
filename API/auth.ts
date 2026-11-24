import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vgm_admin_2026';
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'vgm_default_secure_session_secret_2026';
const TOKEN_EXPIRY_MS = Number(process.env.ADMIN_TOKEN_EXPIRY_MS) || 24 * 60 * 60 * 1000; // 24 hours

export interface TokenPayload {
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
}

// Generate signed HMAC token with expiration
export function generateAdminToken(): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + TOKEN_EXPIRY_MS;
  const payload: TokenPayload = { role: 'admin', issuedAt, expiresAt };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

// Verify signed HMAC token
export function verifyAdminToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return false;
    }
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// Admin Authentication Middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const adminSecret = req.headers['x-admin-password'];

  // Check direct password header
  if (adminSecret && adminSecret === ADMIN_PASSWORD) {
    return next();
  }

  // Check Bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();

    // Verify cryptographic signed token
    if (verifyAdminToken(token)) {
      return next();
    }

    // Backward compatibility for base64 encoded password during transition
    if (token === Buffer.from(ADMIN_PASSWORD).toString('base64')) {
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized access. Valid administrator credentials required.'
  });
}

// Verify password
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;

  // Constant-time comparison to prevent timing attacks
  const bufA = Buffer.from(password);
  const bufB = Buffer.from(ADMIN_PASSWORD);

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
