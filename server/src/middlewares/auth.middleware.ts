// ============================================
// Authentication Middleware (Placeholder)
// ============================================
// TODO: Replace with real JWT/session authentication.
// Currently injects a hardcoded dev user ID so
// downstream controllers can always rely on req.userId.

import { Request, Response, NextFunction } from 'express';

/**
 * Placeholder auth middleware.
 *
 * Production implementation should:
 * 1. Read Bearer token from Authorization header
 * 2. Verify JWT signature
 * 3. Extract userId from decoded payload
 * 4. Optionally check user exists in DB
 * 5. Attach userId to req
 */
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // TODO: Implement real authentication
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) throw new ApiError(401, 'Authentication required');
  // const decoded = verifyJWT(token);

  // ── Development Placeholder ──
  // Accept userId from header or fall back to dev default
  const headerUserId = req.headers['x-user-id'];
  const userId = typeof headerUserId === 'string' && headerUserId.length > 0
    ? headerUserId
    : 'dev-user-001';

  // Attach userId to request object
  (req as Request & { userId: string }).userId = userId;

  next();
};
