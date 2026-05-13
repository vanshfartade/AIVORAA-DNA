# AIVORAA — DNA Dashboard

A 3D interactive DNA helix dashboard for visualizing educational curriculum progression.

## Overview

AIVORAA's DNA Dashboard represents your learning journey as a double helix — one strand for **Foundational Skills**, the other for **Career Goals**, connected by rungs that represent your **Course Skills** and projects.

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** — lightning-fast dev server & build tool
- **Tailwind CSS** — utility-first styling
- **Canvas API** — custom 3D DNA helix rendering

### Backend
- **Node.js** + **Express**
- **Prisma ORM** — type-safe database access
- **PostgreSQL** — relational data store

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install

# Configure your database
cp .env.example .env   # then edit with your DB credentials

# Run migrations & seed
npx prisma migrate dev
npx prisma db seed

# Start the server
npm run dev
```

## Project Structure

```
AIVORAA/
├── DNA/                    # Frontend — React components & 3D canvas
│   ├── components/         # DNADashboard, LevelsPanel, TopUI
│   ├── hooks/              # useDNACanvas (3D rendering logic)
│   ├── mocks/              # Mock data for development
│   ├── styles/             # Global CSS
│   └── types/              # TypeScript type definitions
├── server/                 # Backend — Express API
│   ├── prisma/             # Schema & seed data
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── middlewares/     # Auth, error handling, validation
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       ├── types/           # TypeScript types
│       └── utils/           # ApiError, ApiResponse, asyncHandler
├── index.html              # Vite entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## License

MIT
