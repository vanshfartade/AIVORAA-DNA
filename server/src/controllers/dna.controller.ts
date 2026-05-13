// ============================================
// DNA Controller Layer
// ============================================
// Handles HTTP request/response for DNA endpoints.
// Extracts data from req, calls the service,
// and sends the structured response.

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { ProgressUpdateBody } from '../types/dna.types';
import * as dnaService from '../services/dna.service';

/**
 * Extracts userId from the request, throws 401 if missing.
 * Auth middleware guarantees this is set, but we validate defensively.
 */
function getUserId(req: Request): string {
  const userId = (req as Request & { userId?: string }).userId;
  if (!userId) {
    throw new ApiError(401, 'Authentication required');
  }
  return userId;
}

/**
 * GET /api/dna
 * Returns the complete DNA dashboard for the authenticated user.
 */
export const getDNADashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  const dashboard = await dnaService.getDNADashboard(userId);
  res.status(200).json(new ApiResponse(dashboard, 'DNA dashboard retrieved successfully'));
});

/**
 * GET /api/dna/origins
 * Returns origin nodes (Strand A — skills clusters).
 */
export const getOriginNodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  const origins = await dnaService.getOriginNodes(userId);
  res.status(200).json(new ApiResponse(origins, 'Origin nodes retrieved successfully'));
});

/**
 * GET /api/dna/goals
 * Returns goal nodes (Strand B — career goals).
 */
export const getGoalNodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  const goals = await dnaService.getGoalNodes(userId);
  res.status(200).json(new ApiResponse(goals, 'Goal nodes retrieved successfully'));
});

/**
 * GET /api/dna/rungs
 * Returns rung nodes (connecting pathways).
 */
export const getRungNodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  const rungs = await dnaService.getRungNodes(userId);
  res.status(200).json(new ApiResponse(rungs, 'Rung nodes retrieved successfully'));
});

/**
 * POST /api/dna/progress
 * Updates progress for a specific skill or project.
 */
export const updateProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  void userId; // TODO: Verify entity belongs to this user's DNA
  const body = req.body as ProgressUpdateBody;
  const updated = await dnaService.updateProgress(body);
  res.status(200).json(new ApiResponse(updated, 'Progress updated successfully'));
});
