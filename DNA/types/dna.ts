export interface Skill {
  id: string;
  title: string;
  desc: string;
  status: 'locked' | 'in-progress' | 'completed';
  progress: number;
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  status: 'locked' | 'in-progress' | 'completed';
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
  status: 'locked' | 'in-progress' | 'completed';
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

export interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  rot: number;
  rotSpeed: number;
  speedY: number;
  type: 'hex' | 'flask' | 'book';
  color: string;
}
