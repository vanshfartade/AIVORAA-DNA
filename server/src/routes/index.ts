// ============================================
// Root Route Aggregator
// ============================================
// Registers all feature route modules under
// their respective base paths. Add new modules here.

import { Router } from 'express';
import dnaRoutes from './dna.routes';

const router = Router();

// ── DNA Dashboard Module ─────────────────────
router.use('/dna', dnaRoutes);

// TODO: Add future route modules here
// router.use('/users', userRoutes);
// router.use('/ai', aiRoutes);

export default router;
