// ============================================
// Database Seed Script
// ============================================
// Populates the database with the same curriculum
// data used in the dna10.html reference dashboard.
// Run with: npm run prisma:seed

import { PrismaClient, ProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

const DEV_USER_ID = 'dev-user-001';

interface SeedSkill {
  title: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
  sortOrder: number;
}

interface SeedOriginNode {
  label: string;
  desc: string;
  sortOrder: number;
  skills: SeedSkill[];
}

interface SeedProject {
  title: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
  sortOrder: number;
}

interface SeedGoalNode {
  label: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
  sortOrder: number;
  projects: SeedProject[];
}

interface SeedRungNode {
  label: string;
  sortOrder: number;
  projects: SeedProject[];
}

// ── Seed Data ────────────────────────────────
// Matches the curriculum from dna10.html

const originNodes: SeedOriginNode[] = [
  {
    label: 'Web Dev',
    desc: 'Frontend fundamentals',
    sortOrder: 0,
    skills: [
      { title: 'HTML/CSS', desc: 'Build responsive layouts and styling.', status: 'COMPLETED', progress: 100, sortOrder: 0 },
      { title: 'JavaScript', desc: 'Implement interactive client-side logic.', status: 'IN_PROGRESS', progress: 65, sortOrder: 1 },
      { title: 'React Component Architecture', desc: 'Create reusable UI components and manage state.', status: 'LOCKED', progress: 0, sortOrder: 2 },
    ],
  },
  {
    label: 'Design',
    desc: 'Visual empathy',
    sortOrder: 1,
    skills: [
      { title: 'UI/UX Wireframing', desc: 'Map out user journeys and interface structure.', status: 'IN_PROGRESS', progress: 40, sortOrder: 0 },
      { title: 'Figma Prototyping', desc: 'Design high-fidelity interactive mockups.', status: 'LOCKED', progress: 0, sortOrder: 1 },
      { title: 'Color Theory', desc: 'Apply aesthetic and accessible color palettes.', status: 'LOCKED', progress: 0, sortOrder: 2 },
    ],
  },
  {
    label: 'Python',
    desc: 'Backend logic',
    sortOrder: 2,
    skills: [
      { title: 'Scripting Basics', desc: 'Learn core syntax and automate repetitive tasks.', status: 'COMPLETED', progress: 100, sortOrder: 0 },
      { title: 'Data Analysis with Pandas', desc: 'Clean, manipulate, and analyze structured data.', status: 'IN_PROGRESS', progress: 50, sortOrder: 1 },
      { title: 'Task Automation', desc: 'Write scripts to handle file operations and APIs.', status: 'LOCKED', progress: 0, sortOrder: 2 },
    ],
  },
  {
    label: 'ML Basics',
    desc: 'Foundations',
    sortOrder: 3,
    skills: [
      { title: 'Linear Algebra', desc: 'Understand matrices and vector operations for ML.', status: 'IN_PROGRESS', progress: 30, sortOrder: 0 },
      { title: 'Statistical Models', desc: 'Grasp the math behind probability and distributions.', status: 'LOCKED', progress: 0, sortOrder: 1 },
      { title: 'NumPy Arrays', desc: 'Perform high-performance numerical computations.', status: 'LOCKED', progress: 0, sortOrder: 2 },
    ],
  },
];

const goalNodes: SeedGoalNode[] = [
  {
    label: 'Full Stack',
    desc: 'Master both frontend and backend technologies to build complete, scalable web applications from scratch.',
    status: 'IN_PROGRESS',
    progress: 35,
    sortOrder: 0,
    projects: [
      { title: 'Full Stack Web Development Course', desc: 'Comprehensive course covering frontend and backend.', status: 'IN_PROGRESS', progress: 35, sortOrder: 0 },
    ],
  },
  {
    label: 'AI Engineer',
    desc: 'Learn to build, train, and deploy machine learning models, and integrate Large Language Models into intelligent applications.',
    status: 'LOCKED',
    progress: 0,
    sortOrder: 1,
    projects: [
      { title: 'AI Engineering and LLM Integration Course', desc: 'End-to-end AI engineering pipeline.', status: 'LOCKED', progress: 0, sortOrder: 0 },
    ],
  },
  {
    label: 'Data Scientist',
    desc: 'Analyze complex datasets, build predictive models, and extract actionable insights using advanced statistical techniques.',
    status: 'LOCKED',
    progress: 0,
    sortOrder: 2,
    projects: [
      { title: 'Data Science and Machine Learning Course', desc: 'From data cleaning to model deployment.', status: 'LOCKED', progress: 0, sortOrder: 0 },
    ],
  },
  {
    label: 'UX Lead',
    desc: 'Lead product design from conception to prototyping, focusing on user-centered design principles and empathy.',
    status: 'LOCKED',
    progress: 0,
    sortOrder: 3,
    projects: [
      { title: 'UX/UI Design and Leadership Course', desc: 'Design thinking and team leadership.', status: 'LOCKED', progress: 0, sortOrder: 0 },
    ],
  },
];

const rungNodes: SeedRungNode[] = [
  {
    label: 'Full Stack Skills',
    sortOrder: 0,
    projects: [
      { title: 'HTML Basics', desc: 'Learn the structure of web pages using semantic tags.', status: 'COMPLETED', progress: 100, sortOrder: 0 },
      { title: 'CSS Styling', desc: 'Master layouts, flexbox, grid, and responsive design.', status: 'IN_PROGRESS', progress: 70, sortOrder: 1 },
      { title: 'JavaScript Logic', desc: 'Understand variables, loops, DOM manipulation, and ES6+ features.', status: 'LOCKED', progress: 0, sortOrder: 2 },
      { title: 'React Framework', desc: 'Build reusable components, manage state, and handle routing.', status: 'LOCKED', progress: 0, sortOrder: 3 },
      { title: 'Backend APIs', desc: 'Create RESTful APIs using Node.js and Express.', status: 'LOCKED', progress: 0, sortOrder: 4 },
    ],
  },
  {
    label: 'AI Engineer Skills',
    sortOrder: 1,
    projects: [
      { title: 'Python Programming', desc: 'Learn core Python syntax, data structures, and OOP.', status: 'IN_PROGRESS', progress: 50, sortOrder: 0 },
      { title: 'Data Processing', desc: 'Use Pandas and NumPy to clean and manipulate datasets.', status: 'LOCKED', progress: 0, sortOrder: 1 },
      { title: 'Machine Learning Basics', desc: 'Understand linear regression, classification, and model evaluation.', status: 'LOCKED', progress: 0, sortOrder: 2 },
      { title: 'Deep Learning', desc: 'Build neural networks using PyTorch or TensorFlow.', status: 'LOCKED', progress: 0, sortOrder: 3 },
      { title: 'LLM Integration', desc: 'Work with OpenAI APIs, prompt engineering, and RAG architectures.', status: 'LOCKED', progress: 0, sortOrder: 4 },
    ],
  },
  {
    label: 'Data Scientist Skills',
    sortOrder: 2,
    projects: [
      { title: 'Statistical Analysis', desc: 'Learn probability distributions, hypothesis testing, and A/B testing.', status: 'LOCKED', progress: 0, sortOrder: 0 },
      { title: 'Data Visualization', desc: 'Create insightful charts using Matplotlib, Seaborn, or Tableau.', status: 'LOCKED', progress: 0, sortOrder: 1 },
      { title: 'SQL Queries', desc: 'Extract and transform data from relational databases.', status: 'LOCKED', progress: 0, sortOrder: 2 },
      { title: 'Predictive Modeling', desc: 'Train algorithms to forecast trends and classify data.', status: 'LOCKED', progress: 0, sortOrder: 3 },
      { title: 'Model Deployment', desc: 'Serve models via Flask or FastAPI for production use.', status: 'LOCKED', progress: 0, sortOrder: 4 },
    ],
  },
  {
    label: 'UX Lead Skills',
    sortOrder: 3,
    projects: [
      { title: 'User Research', desc: 'Conduct interviews, surveys, and create user personas.', status: 'LOCKED', progress: 0, sortOrder: 0 },
      { title: 'Wireframing', desc: 'Sketch low-fidelity layouts to map out user journeys.', status: 'LOCKED', progress: 0, sortOrder: 1 },
      { title: 'Prototyping', desc: 'Build interactive, high-fidelity prototypes in Figma.', status: 'LOCKED', progress: 0, sortOrder: 2 },
      { title: 'Design Systems', desc: 'Establish typography, color palettes, and reusable UI components.', status: 'LOCKED', progress: 0, sortOrder: 3 },
      { title: 'Usability Testing', desc: 'Observe users interacting with the prototype and iterate.', status: 'LOCKED', progress: 0, sortOrder: 4 },
    ],
  },
];

// ── Seed Execution ───────────────────────────

async function main(): Promise<void> {
  console.log('🌱 Seeding AIVORAA DNA database...\n');

  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.rungNode.deleteMany();
  await prisma.goalNode.deleteMany();
  await prisma.originNode.deleteMany();
  await prisma.dNAAnalysis.deleteMany();

  // Create DNAAnalysis for dev user
  const dna = await prisma.dNAAnalysis.create({
    data: { userId: DEV_USER_ID },
  });
  console.log(`   ✅ DNAAnalysis created: ${dna.id}`);

  // Seed Origin Nodes + Skills
  for (const node of originNodes) {
    const created = await prisma.originNode.create({
      data: {
        label: node.label,
        desc: node.desc,
        sortOrder: node.sortOrder,
        dnaAnalysisId: dna.id,
        skills: {
          create: node.skills,
        },
      },
      include: { skills: true },
    });
    console.log(`   ✅ OriginNode "${created.label}" → ${created.skills.length} skills`);
  }

  // Seed Goal Nodes + Projects
  for (const node of goalNodes) {
    const created = await prisma.goalNode.create({
      data: {
        label: node.label,
        desc: node.desc,
        status: node.status,
        progress: node.progress,
        sortOrder: node.sortOrder,
        dnaAnalysisId: dna.id,
        projects: {
          create: node.projects,
        },
      },
      include: { projects: true },
    });
    console.log(`   ✅ GoalNode "${created.label}" → ${created.projects.length} projects`);
  }

  // Seed Rung Nodes + Projects
  for (const node of rungNodes) {
    const created = await prisma.rungNode.create({
      data: {
        label: node.label,
        sortOrder: node.sortOrder,
        dnaAnalysisId: dna.id,
        projects: {
          create: node.projects,
        },
      },
      include: { projects: true },
    });
    console.log(`   ✅ RungNode "${created.label}" → ${created.projects.length} projects`);
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e: Error) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
