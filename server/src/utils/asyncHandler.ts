// ============================================
// Async Handler Wrapper
// ============================================
// Wraps async route handlers so thrown errors
// are automatically forwarded to Express error
// middleware, eliminating try/catch boilerplate.

import { Request, Response, NextFunction } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
