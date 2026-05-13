// ============================================
// DNA Routes
// ============================================
// Maps HTTP methods + paths to controller handlers.
// Applies auth and validation middleware per route.

import { Router } from 'express';
import * as dnaController from '../controllers/dna.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateProgressUpdate } from '../middlewares/validateRequest';

const router = Router();

// All DNA routes require authentication
router.use(authMiddleware);

// GET /api/dna — Full dashboard data
router.get('/', dnaController.getDNADashboard);

// GET /api/dna/origins — Origin nodes only
router.get('/origins', dnaController.getOriginNodes);

// GET /api/dna/goals — Goal nodes only
router.get('/goals', dnaController.getGoalNodes);

// GET /api/dna/rungs — Rung nodes only
router.get('/rungs', dnaController.getRungNodes);

// POST /api/dna/progress — Update skill/project progress
router.post('/progress', validateProgressUpdate, dnaController.updateProgress);

export default router;
