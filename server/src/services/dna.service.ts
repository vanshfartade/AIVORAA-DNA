// ============================================
// DNA Service Layer
// ============================================
// All database operations for the DNA module.
// Controllers call these functions — they never
// touch Prisma directly. This separation allows
// easy testing and future swapping of data sources.

import { prisma } from '../prisma/client';
import { ApiError } from '../utils/ApiError';
import {
  DNADashboardResponse,
  OriginNodeResponse,
  GoalNodeResponse,
  RungNodeResponse,
  SkillResponse,
  ProjectResponse,
  ProgressUpdateBody,
  PrismaStatus,
  mapStatus,
  toDBStatus,
} from '../types/dna.types';

// ── Include definitions for Prisma queries ───
// Centralised so every query returns the same shape.

const ORIGIN_INCLUDE = {
  skills: { orderBy: { sortOrder: 'asc' as const } },
} as const;

const GOAL_INCLUDE = {
  projects: { orderBy: { sortOrder: 'asc' as const } },
} as const;

const RUNG_INCLUDE = {
  projects: { orderBy: { sortOrder: 'asc' as const } },
} as const;

const DNA_INCLUDE = {
  originNodes: {
    include: ORIGIN_INCLUDE,
    orderBy: { sortOrder: 'asc' as const },
  },
  goalNodes: {
    include: GOAL_INCLUDE,
    orderBy: { sortOrder: 'asc' as const },
  },
  rungNodes: {
    include: RUNG_INCLUDE,
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

// ── Mapper Functions ─────────────────────────
// Transform Prisma records into API response shapes.

function mapSkill(skill: {
  id: string;
  title: string;
  desc: string;
  status: PrismaStatus;
  progress: number;
}): SkillResponse {
  return {
    id: skill.id,
    title: skill.title,
    desc: skill.desc,
    status: mapStatus(skill.status),
    progress: skill.progress,
  };
}

function mapProject(project: {
  id: string;
  title: string;
  desc: string;
  status: PrismaStatus;
  progress: number;
}): ProjectResponse {
  return {
    id: project.id,
    title: project.title,
    desc: project.desc,
    status: mapStatus(project.status),
    progress: project.progress,
  };
}

function mapOriginNode(node: {
  id: string;
  label: string;
  desc: string;
  skills: Array<{
    id: string;
    title: string;
    desc: string;
    status: PrismaStatus;
    progress: number;
  }>;
}): OriginNodeResponse {
  return {
    id: node.id,
    label: node.label,
    desc: node.desc,
    skills: node.skills.map(mapSkill),
  };
}

function mapGoalNode(node: {
  id: string;
  label: string;
  desc: string;
  status: PrismaStatus;
  progress: number;
  projects: Array<{
    id: string;
    title: string;
    desc: string;
    status: PrismaStatus;
    progress: number;
  }>;
}): GoalNodeResponse {
  return {
    id: node.id,
    label: node.label,
    // Legacy compatibility: first project title as the "project" field
    project: node.projects.length > 0 ? node.projects[0].title : node.label,
    desc: node.desc,
    status: mapStatus(node.status),
    progress: node.progress,
    projects: node.projects.map(mapProject),
  };
}

function mapRungNode(node: {
  id: string;
  label: string;
  projects: Array<{
    id: string;
    title: string;
    desc: string;
    status: PrismaStatus;
    progress: number;
  }>;
}): RungNodeResponse {
  return {
    id: node.id,
    label: node.label,
    projects: node.projects.map(mapProject),
  };
}

// ── Service Functions ────────────────────────

/**
 * Fetches the complete DNA dashboard data for a user.
 * Creates a blank DNA record if the user has none yet.
 */
export async function getDNADashboard(userId: string): Promise<DNADashboardResponse> {
  let dna = await prisma.dNAAnalysis.findUnique({
    where: { userId },
    include: DNA_INCLUDE,
  });

  // Auto-create empty DNA for new users (Ciro will populate later)
  if (!dna) {
    dna = await prisma.dNAAnalysis.create({
      data: { userId },
      include: DNA_INCLUDE,
    });
  }

  return {
    id: dna.id,
    userId: dna.userId,
    originNodes: dna.originNodes.map(mapOriginNode),
    goalNodes: dna.goalNodes.map(mapGoalNode),
    rungNodes: dna.rungNodes.map(mapRungNode),
    createdAt: dna.createdAt.toISOString(),
    updatedAt: dna.updatedAt.toISOString(),
  };
}

/**
 * Fetches only the origin nodes (Strand A) for a user.
 */
export async function getOriginNodes(userId: string): Promise<OriginNodeResponse[]> {
  const dna = await prisma.dNAAnalysis.findUnique({
    where: { userId },
    include: {
      originNodes: {
        include: ORIGIN_INCLUDE,
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!dna) {
    throw new ApiError(404, 'DNA analysis not found for this user. Visit GET /api/dna first.');
  }

  return dna.originNodes.map(mapOriginNode);
}

/**
 * Fetches only the goal nodes (Strand B) for a user.
 */
export async function getGoalNodes(userId: string): Promise<GoalNodeResponse[]> {
  const dna = await prisma.dNAAnalysis.findUnique({
    where: { userId },
    include: {
      goalNodes: {
        include: GOAL_INCLUDE,
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!dna) {
    throw new ApiError(404, 'DNA analysis not found for this user. Visit GET /api/dna first.');
  }

  return dna.goalNodes.map(mapGoalNode);
}

/**
 * Fetches only the rung nodes (connecting pathways) for a user.
 */
export async function getRungNodes(userId: string): Promise<RungNodeResponse[]> {
  const dna = await prisma.dNAAnalysis.findUnique({
    where: { userId },
    include: {
      rungNodes: {
        include: RUNG_INCLUDE,
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!dna) {
    throw new ApiError(404, 'DNA analysis not found for this user. Visit GET /api/dna first.');
  }

  return dna.rungNodes.map(mapRungNode);
}

/**
 * Updates the progress status of a Skill or Project.
 *
 * TODO: Add business logic to auto-unlock next sequential
 * skill/project when the previous one is completed.
 *
 * TODO: Recalculate parent GoalNode/OriginNode aggregate
 * progress when child items change.
 */
export async function updateProgress(body: ProgressUpdateBody): Promise<SkillResponse | ProjectResponse> {
  const dbStatus = toDBStatus(body.status);

  if (body.entityType === 'skill') {
    const existing = await prisma.skill.findUnique({ where: { id: body.entityId } });
    if (!existing) {
      throw new ApiError(404, `Skill with id "${body.entityId}" not found.`);
    }

    const updated = await prisma.skill.update({
      where: { id: body.entityId },
      data: {
        status: dbStatus,
        progress: body.progress,
      },
    });

    return mapSkill(updated);
  }

  // entityType === 'project'
  const existing = await prisma.project.findUnique({ where: { id: body.entityId } });
  if (!existing) {
    throw new ApiError(404, `Project with id "${body.entityId}" not found.`);
  }

  const updated = await prisma.project.update({
    where: { id: body.entityId },
    data: {
      status: dbStatus,
      progress: body.progress,
    },
  });

  return mapProject(updated);
}
