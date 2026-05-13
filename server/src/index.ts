// ============================================
// AIVORAA DNA Server — Entry Point
// ============================================
// Bootstraps Express, connects Prisma, mounts
// routes, and starts listening.

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { prisma } from './prisma/client';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ── Global Middleware ────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ─────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'AIVORAA DNA Server is running',
  });
});

// ── API Routes ───────────────────────────────
app.use('/api', routes);

// ── 404 Handler ──────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Global Error Handler (must be last) ──────
app.use(errorHandler);

// ── Start Server ─────────────────────────────
async function bootstrap(): Promise<void> {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`\n🧬 AIVORAA DNA Server running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   DNA:    http://localhost:${PORT}/api/dna`);
      console.log(`   Env:    ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
