// ============================================
// Global Error Handler Middleware
// ============================================
// Catches all errors — both operational (ApiError)
// and unexpected — and returns structured JSON.

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

interface ErrorResponseBody {
  success: false;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof ApiError) {
    const body: ErrorResponseBody = {
      success: false,
      message: err.message,
    };
    if (process.env.NODE_ENV === 'development') {
      body.stack = err.stack;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  // Prisma known errors (e.g. record not found)
  if (err.name === 'PrismaClientKnownRequestError') {
    const body: ErrorResponseBody = {
      success: false,
      message: 'Database operation failed',
    };
    if (process.env.NODE_ENV === 'development') {
      body.stack = err.stack;
    }
    res.status(400).json(body);
    return;
  }

  // Unknown / unexpected errors
  console.error('[UNHANDLED ERROR]', err);
  const body: ErrorResponseBody = {
    success: false,
    message: 'Internal Server Error',
  };
  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }
  res.status(500).json(body);
};
