import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes.js';
import { attachRequestId, apiErrorHandler } from './errorHandler.js';
import { SupabaseService } from './supabase.js';
import { isConfiguredRazorpay, isLiveMode } from './razorpay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production' || __filename.endsWith('server.js');

  // Trust proxy in production for accurate IP detection on Render / reverse proxies
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // 1. Attach Request ID to every incoming request for structured tracing
  app.use(attachRequestId);

  // 2. Raw body buffer retained for Razorpay webhook verification and secure file uploads
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(express.raw({ type: ['application/octet-stream', 'application/pdf', 'image/*'], limit: '10mb' }));

  // 3. Security headers (Protection against sniffing, framing, XSS, and clickjacking)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // 3.5. CORS Integration (Hardened for Production Security)
  const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true; // allow same-origin, curl, server-to-server
    try {
      const parsed = new URL(origin);
      const host = parsed.hostname.toLowerCase();
      if (host === 'skillhub.vgmsofttech.com' || 
          host === 'adminskillhub.vgmsofttech.com' || 
          host.endsWith('.vgmsofttech.com') ||
          host === 'vgmsofttech.com') {
        return true;
      }
      if (!isProduction && (host === 'localhost' || host === '127.0.0.1')) {
        return true;
      }
    } catch {}
    return false;
  };

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isAllowedOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Admin-Secret, X-Request-ID');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // 4. Mount API router
  app.use('/api', apiRouter);

  // 5. Health check endpoint (for Render / load balancers)
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      mode: isProduction ? 'production' : 'development',
      supabase: SupabaseService.isAvailable() ? 'connected' : 'local_fallback',
      razorpay: isConfiguredRazorpay ? (isLiveMode ? 'live' : 'test') : 'simulator',
      timestamp: new Date().toISOString()
    });
  });

  // 6. Static files or Vite dev middleware
  const projectRoot = fs.existsSync(path.resolve(__dirname, 'Frontend')) || fs.existsSync(path.resolve(__dirname, 'frontend'))
    ? __dirname
    : path.resolve(__dirname, '..');
  const frontendRoot = fs.existsSync(path.resolve(projectRoot, 'Frontend'))
    ? path.resolve(projectRoot, 'Frontend')
    : path.resolve(projectRoot, 'frontend');
  const adminRoot = fs.existsSync(path.resolve(projectRoot, 'Adminweb'))
    ? path.resolve(projectRoot, 'Adminweb')
    : path.resolve(projectRoot, 'adminweb');
  const distPath = path.resolve(projectRoot, 'dist');
  const adminDistPath = path.resolve(projectRoot, 'dist-admin');

  // Handle Adminweb routing
  if (!isProduction) {
    app.get(['/adminweb', '/adminweb/*'], (_req, res) => {
      // --- LOCALHOST DEV REDIRECT (Commented out for live production) ---
      // res.redirect('http://localhost:3001');

      // --- LIVE PRODUCTION REDIRECT (Active) ---
      res.redirect('https://adminskillhub.vgmsofttech.com');
    });
  } else if (fs.existsSync(adminDistPath)) {
    console.log('[SERVER] Serving Adminweb production static bundle from /adminweb and adminskillhub.* host...');
    // Serve hashed Adminweb assets with immutable cache and no HTML fallthrough
    app.use(['/adminweb/assets', '/assets'], (req, res, next) => {
      const host = (req.headers.host || req.hostname || '').toLowerCase();
      const isAdminHost = host.startsWith('adminskillhub') || host.startsWith('admin.');
      
      // If request is on adminskillhub or explicitly /adminweb/assets
      if (req.baseUrl === '/adminweb/assets' || isAdminHost) {
        express.static(path.join(adminDistPath, 'assets'), {
          maxAge: '1y',
          immutable: true,
          fallthrough: true
        })(req, res, next);
      } else {
        next();
      }
    });

    app.use('/adminweb', express.static(adminDistPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    app.get(['/adminweb', '/adminweb/*'], (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(adminDistPath, 'index.html'));
    });
  }

  if (!isProduction) {
    console.log('[SERVER] Initializing Vite middleware for frontend in dev mode...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      configFile: path.resolve(frontendRoot, 'vite.config.ts'),
      root: frontendRoot,
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    // Serve index.html with Vite transforms for SPA routing in development
    app.get('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl === '/health') {
        return next();
      }
      try {
        const indexPath = path.join(frontendRoot, 'index.html');
        if (fs.existsSync(indexPath)) {
          const rawHtml = fs.readFileSync(indexPath, 'utf-8');
          const transformedHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
          res.status(200).set({ 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }).end(transformedHtml);
        } else {
          next();
        }
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    console.log('[SERVER] Running in production static mode...');
    // Serve hashed Frontend assets with immutable cache and no HTML fallthrough
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
      fallthrough: false
    }));

    app.use(express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl === '/health') {
        return next();
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Check if domain is Admin custom domain (adminskillhub.vgmsofttech.com or admin.*)
      const host = (req.headers.host || req.hostname || '').toLowerCase();
      if ((host.startsWith('adminskillhub') || host.startsWith('admin.')) && fs.existsSync(path.join(adminDistPath, 'index.html'))) {
        return res.sendFile(path.join(adminDistPath, 'index.html'));
      }

      // Default: Serve Frontend SPA index.html
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 7. Central API error handler (no stack trace or path leakage to clients)
  app.use(apiErrorHandler);

  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(` VGM SKILL HUB FULL-STACK SERVER READY`);
    console.log(` Mode: ${isProduction ? 'Production' : 'Development'} (Port: ${PORT})`);
    console.log(` --- LOCALHOST (Development - commented out) ---`);
    console.log(` // Frontend:     http://localhost:3000`);
    console.log(` // Adminweb:     http://localhost:3001 (or /adminweb)`);
    console.log(` // API Base:     http://localhost:3000/api`);
    console.log(` --- LIVE PRODUCTION (Active) ---`);
    console.log(` Frontend:        https://skillhub.vgmsofttech.com`);
    console.log(` Adminweb Portal: https://adminskillhub.vgmsofttech.com`);
    console.log(` API Base:        https://skillhub.vgmsofttech.com/api`);
    console.log(` Database:        ${SupabaseService.isAvailable() ? 'Live Supabase (PostgreSQL)' : 'Local Persistent JSON'}`);
    console.log(` Razorpay:        ${isConfiguredRazorpay ? (isLiveMode ? 'Live Mode' : 'Test Mode') : 'Test Simulator'}`);
    console.log(` Rate Limiting:   Active (Auth exponential backoff + public limits)`);
    console.log(` Input Validation: Strict Zod Schemas Active`);
    console.log(`================================================`);

    // Production Security Warning
    if (isProduction) {
      if (process.env.ADMIN_PASSWORD === 'vgm_admin_2026') {
        console.warn(`[SECURITY WARNING] Production running with default ADMIN_PASSWORD. Set a strong ADMIN_PASSWORD in Render environment!`);
      }
      if (!isConfiguredRazorpay) {
        console.warn(`[PAYMENT WARNING] Production running with test placeholder Razorpay keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET!`);
      }
      if (!SupabaseService.isAvailable()) {
        console.warn(`[DATABASE NOTICE] Production running on local storage. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for live PostgreSQL!`);
      }
    }
  });
}

// Auto-run when executed directly
startServer().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
