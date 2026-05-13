// ============================================
// DNA Domain Types
// ============================================
// These types define the API response shapes for
// the DNA Dashboard. They map Prisma models to
// frontend-consumable JSON structures.

// ── Status Mapping ───────────────────────────
// Maps between Prisma enum values and frontend string values.

export const STATUS_MAP = {
  LOCKED: 'locked',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export type PrismaStatus = keyof typeof STATUS_MAP;
export type FrontendStatus = typeof STATUS_MAP[PrismaStatus];

/**
 * Converts a Prisma ProgressStatus enum value to the
 * frontend-expected string format.
 */
export function mapStatus(prismaStatus: PrismaStatus): FrontendStatus {
  return STATUS_MAP[prismaStatus];
}

// ── API Response Shapes ──────────────────────

export interface SkillResponse {
  id: string;
  title: string;
  desc: string;
  status: FrontendStatus;
  progress: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  desc: string;
  status: FrontendStatus;
  progress: number;
}

export interface OriginNodeResponse {
  id: string;
  label: string;
  desc: string;
  skills: SkillResponse[];
}

export interface GoalNodeResponse {
  id: string;
  label: string;
  project: string;
  desc: string;
  status: FrontendStatus;
  progress: number;
  projects: ProjectResponse[];
}

export interface RungNodeResponse {
  id: string;
  label: string;
  projects: ProjectResponse[];
}

export interface DNADashboardResponse {
  id: string;
  userId: string;
  originNodes: OriginNodeResponse[];
  goalNodes: GoalNodeResponse[];
  rungNodes: RungNodeResponse[];
  createdAt: string;
  updatedAt: string;
}

// ── Request Body Shapes ──────────────────────

export interface ProgressUpdateBody {
  entityType: 'skill' | 'project';
  entityId: string;
  status: FrontendStatus;
  progress: number;
}

// ── Validation Helpers ───────────────────────

const VALID_STATUSES: ReadonlySet<string> = new Set(['locked', 'in-progress', 'completed']);
const VALID_ENTITY_TYPES: ReadonlySet<string> = new Set(['skill', 'project']);

export function isValidStatus(value: unknown): value is FrontendStatus {
  return typeof value === 'string' && VALID_STATUSES.has(value);
}

export function isValidEntityType(value: unknown): value is 'skill' | 'project' {
  return typeof value === 'string' && VALID_ENTITY_TYPES.has(value);
}

/**
 * Converts a frontend status string back to the Prisma enum value.
 */
export function toDBStatus(frontendStatus: FrontendStatus): PrismaStatus {
  const reverseMap: Record<FrontendStatus, PrismaStatus> = {
    'locked': 'LOCKED',
    'in-progress': 'IN_PROGRESS',
    'completed': 'COMPLETED',
  };
  return reverseMap[frontendStatus];
}
