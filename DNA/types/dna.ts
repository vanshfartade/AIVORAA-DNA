export type ProgressStatus = 'locked' | 'in-progress' | 'completed';

export interface Skill {
  id: string;
  title: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
}

export interface OriginNodeData {
  label: string;
  skills: Skill[];
  desc: string;
}

export interface GoalNodeData {
  label: string;
  project: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
}

export interface RungData {
  label: string;
  projects: Project[];
}

export interface NodeBase {
  idx: number;
  wx: number;
  wy: number;
  worldY: number;
  angle: number;
}

export interface OriginNode extends NodeBase {
  type: 'origin';
  data: OriginNodeData;
}

export interface GoalNode extends NodeBase {
  type: 'goal';
  data: GoalNodeData;
}

export interface RungNode extends NodeBase {
  type: 'rung';
  sx: number;
  ex: number;
  sy: number;
  data: RungData;
}

export type HelixNode = OriginNode | GoalNode | RungNode;

export type ParticleShape = 'hex' | 'orb' | 'cross' | 'ring' | 'triangle';

export interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  rot: number;
  rotSpeed: number;
  speedY: number;
  type: ParticleShape;
  color: string;
}

/** Depth-sorted draw call for the rendering pipeline */
export interface DrawCommand {
  z: number;
  draw: () => void;
}

/** Mutable state for the animation loop (stored in useRef to avoid re-renders) */
export interface CanvasAnimationState {
  W: number;
  H: number;
  dpr: number;
  scrollY: number;
  targetScrollY: number;
  rotationY: number;
  mouseX: number | null;
  mouseY: number | null;
  worldMouseX: number | null;
  worldMouseY: number | null;
  animT: number;
  camX: number;
  camY: number;
  camScale: number;
  targetCamX: number;
  targetCamY: number;
  targetCamScale: number;
  particles: Particle[];
  nodes: HelixNode[];
  hoveredNode: HelixNode | null;
  activeNode: HelixNode | null;
  isZoomed: boolean;
}
