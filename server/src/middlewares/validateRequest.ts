// ============================================
// Request Validation Middleware
// ============================================
// Validates incoming request bodies for specific
// endpoints. Uses manual checks to avoid adding
// a heavy validation library dependency.

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { isValidStatus, isValidEntityType } from '../types/dna.types';

/**
 * Validates the POST /api/dna/progress request body.
 * Ensures entityType, entityId, status, and progress
 * are present and correctly typed.
 */
export const validateProgressUpdate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { entityType, entityId, status, progress } = req.body as Record<string, unknown>;

  if (!entityType || !isValidEntityType(entityType)) {
    throw new ApiError(400, 'Invalid entityType. Must be "skill" or "project".');
  }

  if (!entityId || typeof entityId !== 'string') {
    throw new ApiError(400, 'entityId is required and must be a string.');
  }

  if (!status || !isValidStatus(status)) {
    throw new ApiError(400, 'Invalid status. Must be "locked", "in-progress", or "completed".');
  }

  if (progress === undefined || typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new ApiError(400, 'progress is required and must be a number between 0 and 100.');
  }

  next();
};
