import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Request ID attachment middleware
export const attachRequestId = (req: Request, res: Response, next: NextFunction) => {
  const reqId = `req_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
  (req as any).id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
};

// Global error handling middleware (never leaks stack traces, paths, or raw DB errors to clients)
export const apiErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const reqId = (req as any).id || `err_${Date.now()}`;
  const isProd = process.env.NODE_ENV === 'production';

  // Server-side logging: full details with stack trace & context
  console.error(`--------------------------------------------------`);
  console.error(`[SERVER ERROR] [${new Date().toISOString()}] [${reqId}]`);
  console.error(`METHOD: ${req.method} | URL: ${req.originalUrl || req.url}`);
  console.error(`IP: ${req.ip || req.socket.remoteAddress}`);
  console.error(`NAME: ${err.name || 'Error'} | MESSAGE: ${err.message}`);
  if (err.stack) {
    console.error(`STACK:`, err.stack);
  }
  if (err.details) {
    console.error(`DETAILS:`, err.details);
  }
  console.error(`--------------------------------------------------`);

  // Client response formatting
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      requestId: reqId
    });
  }

  // Handle SyntaxError from invalid JSON body parsing
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body.',
      requestId: reqId
    });
  }

  // Handle 404 Not Found from static middleware or missing resources
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      success: false,
      error: 'The requested resource was not found.',
      requestId: reqId
    });
  }

  // Generic sanitized response for all unhandled / internal / database errors
  const safeMessage = isProd
    ? 'An unexpected error occurred while processing your request. Please try again later.'
    : (err.message || 'Internal Server Error');

  return res.status(err.statusCode || err.status || 500).json({
    success: false,
    error: safeMessage,
    requestId: reqId
  });
};
