# MV Software - Monorepo

This is a unified monorepo containing both the frontend and backend applications for MV Software.

## Project Structure

```
mvsoftware-monorepo/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── supabase_*.sql     # Shared database schema and seed files
└── package.json       # Root package.json for monorepo management
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

Install dependencies for both frontend and backend:

```bash
npm install
```

This will install dependencies for both workspaces (frontend and backend).

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building

Build the frontend application:

```bash
npm run build
```

Or:

```bash
npm run build:frontend
```

### Production

Start both applications in production mode:

```bash
npm start
```

Or separately:

```bash
# Frontend only
npm run start:frontend

# Backend only
npm run start:backend
```

### Linting

Lint both frontend and backend:

```bash
npm run lint
```

Or separately:

```bash
# Frontend only
npm run lint:frontend

# Backend only
npm run lint:backend
```

## Frontend

The frontend is a Next.js application with:
- React 18
- Tailwind CSS
- Radix UI components
- Supabase authentication
- Framer Motion animations

For more details, see [frontend/README.md](frontend/README.md) (if exists).

## Backend

The backend is an Express.js API with:
- MongoDB integration
- Supabase integration
- Razorpay payment integration
- AI agent orchestration
- RESTful API endpoints

For more details, see [backend/README.md](backend/README.md).

## Environment Variables

Each application has its own environment variables:

- Frontend: Create `frontend/.env.local` (see `frontend/.env.example` if exists)
- Backend: Create `backend/.env` (see `backend/.env.example`)

## Database

SQL schema and seed files are located in the root directory:
- `supabase_blog_casestudy.sql` - Blog and case study schema
- `supabase_seed_data.sql` - Seed data

Additional SQL files are in `backend/sql/`:
- `schema.sql` - Main schema
- `testimonials.sql` - Testimonials schema
- `portfolio_projects.sql` - Portfolio projects
- `profiles.sql` - User profiles
- Other schema files

## Deployment

Both frontend and backend can be deployed separately:
- Frontend: Vercel (Next.js)
- Backend: Render, Vercel, or any Node.js hosting

See respective deployment configurations:
- Frontend: `frontend/next.config.js`
- Backend: `backend/vercel.json`, `backend/render.yaml`

## License

UNLICENSED - Private project

## Author

MV Software
