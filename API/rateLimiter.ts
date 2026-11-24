import { Request, Response, NextFunction } from 'express';

// Configurable thresholds from environment variables with safe defaults
const AUTH_WINDOW_MS = Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000; // 15 min
const AUTH_MAX_ATTEMPTS = Number(process.env.RATE_LIMIT_AUTH_MAX_ATTEMPTS) || 5; // 5 attempts
const AUTH_BASE_DELAY_SEC = Number(process.env.RATE_LIMIT_AUTH_BASE_DELAY_SEC) || 2; // base 2s

const PUBLIC_WINDOW_MS = Number(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS) || 60 * 1000; // 1 min
const PUBLIC_MAX_REQUESTS = Number(process.env.RATE_LIMIT_PUBLIC_MAX_REQUESTS) || 60; // 60 req/min

const API_WINDOW_MS = Number(process.env.RATE_LIMIT_API_WINDOW_MS) || 60 * 1000; // 1 min
const API_MAX_REQUESTS = Number(process.env.RATE_LIMIT_API_MAX_REQUESTS) || 120; // 120 req/min

// ── In-memory tracking structures ──
interface AuthAttemptRecord {
  failures: number;
  lastAttemptTime: number;
  backoffUntil: number;
}

interface StandardRateRecord {
  count: number;
  resetTime: number;
}

// Stores
const authIpAttempts = new Map<string, AuthAttemptRecord>();
const authAccountAttempts = new Map<string, AuthAttemptRecord>();
const standardRateStore = new Map<string, StandardRateRecord>();

// Helper to extract client IP reliably across proxies / Render
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

// ── Cleanup intervals to avoid memory leak ──
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of authIpAttempts.entries()) {
    if (now - record.lastAttemptTime > AUTH_WINDOW_MS) {
      authIpAttempts.delete(key);
    }
  }
  for (const [key, record] of authAccountAttempts.entries()) {
    if (now - record.lastAttemptTime > AUTH_WINDOW_MS) {
      authAccountAttempts.delete(key);
    }
  }
  for (const [key, record] of standardRateStore.entries()) {
    if (now > record.resetTime) {
      standardRateStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // every 5 minutes

// ── 1. Auth Rate Limiter with Exponential Backoff ──
export const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const ip = getClientIp(req);

  // Extract account identifier if present in request body (e.g. enrolmentId, email, username)
  const body = req.body || {};
  const accountIdentifier = (body.enrolmentId || body.email || body.username || '').toLowerCase().trim();

  // Check IP backoff
  const ipRecord = authIpAttempts.get(ip);
  if (ipRecord && ipRecord.backoffUntil > now) {
    const waitSec = Math.ceil((ipRecord.backoffUntil - now) / 1000);
    res.setHeader('Retry-After', waitSec);
    return res.status(429).json({
      error: 'Too many authentication attempts from this IP. Please wait before retrying.',
      retryAfterSeconds: waitSec
    });
  }

  // Check Account backoff
  if (accountIdentifier) {
    const accRecord = authAccountAttempts.get(accountIdentifier);
    if (accRecord && accRecord.backoffUntil > now) {
      const waitSec = Math.ceil((accRecord.backoffUntil - now) / 1000);
      res.setHeader('Retry-After', waitSec);
      return res.status(429).json({
        error: `Too many failed attempts for account ${accountIdentifier}. Exponential backoff in effect.`,
        retryAfterSeconds: waitSec
      });
    }
  }

  next();
};

// Call when auth fails to register failure and compute next exponential backoff
export function recordAuthFailure(req: Request, accountIdentifier?: string) {
  const now = Date.now();
  const ip = getClientIp(req);

  // Update IP record
  const ipRecord = authIpAttempts.get(ip) || { failures: 0, lastAttemptTime: now, backoffUntil: 0 };
  ipRecord.failures += 1;
  ipRecord.lastAttemptTime = now;

  if (ipRecord.failures >= AUTH_MAX_ATTEMPTS) {
    const exponent = ipRecord.failures - AUTH_MAX_ATTEMPTS;
    // Exponential backoff: baseDelay * 2^exponent seconds (capped at 15 minutes)
    const delaySec = Math.min(AUTH_BASE_DELAY_SEC * Math.pow(2, exponent), 900);
    ipRecord.backoffUntil = now + delaySec * 1000;
  }
  authIpAttempts.set(ip, ipRecord);

  // Update Account record
  if (accountIdentifier) {
    const cleanAcc = accountIdentifier.toLowerCase().trim();
    const accRecord = authAccountAttempts.get(cleanAcc) || { failures: 0, lastAttemptTime: now, backoffUntil: 0 };
    accRecord.failures += 1;
    accRecord.lastAttemptTime = now;

    if (accRecord.failures >= AUTH_MAX_ATTEMPTS) {
      const exponent = accRecord.failures - AUTH_MAX_ATTEMPTS;
      const delaySec = Math.min(AUTH_BASE_DELAY_SEC * Math.pow(2, exponent), 900);
      accRecord.backoffUntil = now + delaySec * 1000;
    }
    authAccountAttempts.set(cleanAcc, accRecord);
  }
}

// Call when auth succeeds to reset failed attempts
export function recordAuthSuccess(req: Request, accountIdentifier?: string) {
  const ip = getClientIp(req);
  authIpAttempts.delete(ip);
  if (accountIdentifier) {
    authAccountAttempts.delete(accountIdentifier.toLowerCase().trim());
  }
}

// ── 2. Public Endpoints Rate Limiter (Moderate) ──
export const publicRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const key = `public:${ip}`;
  const now = Date.now();

  const record = standardRateStore.get(key) || { count: 0, resetTime: now + PUBLIC_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + PUBLIC_WINDOW_MS;
  }

  record.count += 1;
  standardRateStore.set(key, record);

  res.setHeader('X-RateLimit-Limit', PUBLIC_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, PUBLIC_MAX_REQUESTS - record.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

  if (record.count > PUBLIC_MAX_REQUESTS) {
    const waitSec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', waitSec);
    return res.status(429).json({
      error: 'Rate limit exceeded on public endpoint. Please slow down your requests.',
      retryAfterSeconds: waitSec
    });
  }

  next();
};

// ── 3. Authenticated / Action Endpoints Rate Limiter (Looser) ──
export const apiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const key = `api:${ip}`;
  const now = Date.now();

  const record = standardRateStore.get(key) || { count: 0, resetTime: now + API_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + API_WINDOW_MS;
  }

  record.count += 1;
  standardRateStore.set(key, record);

  res.setHeader('X-RateLimit-Limit', API_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, API_MAX_REQUESTS - record.count));

  if (record.count > API_MAX_REQUESTS) {
    const waitSec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', waitSec);
    return res.status(429).json({
      error: 'API rate limit exceeded. Please try again in a moment.',
      retryAfterSeconds: waitSec
    });
  }

  next();
};
