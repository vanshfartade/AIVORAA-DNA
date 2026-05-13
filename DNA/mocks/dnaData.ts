import { OriginNodeData, GoalNodeData, RungData } from '../types/dna';

// Initial Empty State - Helix is blank, awaiting Ciro
export const originNodes: OriginNodeData[] = [
  { 
    label: '', 
    skills: [
      { id: 'empty-1', title: 'Unassigned Skill', desc: 'Awaiting Ciro to map your learning path.', status: 'locked', progress: 0 }
    ], 
    desc: 'Waiting for AI...' 
  }
];

export const goalNodes: GoalNodeData[] = [
  { label: '', project: 'Unassigned Course', desc: 'Awaiting Ciro to discover your recommended courses.', status: 'locked', progress: 0 }
];

export const rungs: RungData[] = [
  {
    label: '',
    projects: [
      { id: 'empty-rung-1', title: 'Unassigned Task', desc: 'Awaiting Ciro to populate this path.', status: 'locked', progress: 0 }
    ]
  }
];
