<div align="center">

# 🚀 MV Software Monorepo

**Modern Full-Stack Web Services Platform**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.9-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red?style=for-the-badge)](LICENSE)

*A unified monorepo containing both frontend and backend for MV Software's web services agency platform*

[Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

MV Software is a comprehensive web services platform built with modern technologies. This monorepo houses both the client-facing Next.js frontend and the powerful Express.js backend API, providing a complete solution for web development services, project management, and payment processing.

**Key Highlights:**
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and Radix UI
- 🔐 **Secure Authentication** - Supabase-powered user authentication
- 💳 **Payment Integration** - Razorpay payment gateway integration
- 🤖 **AI Agent System** - Intelligent task automation and orchestration
- 📊 **Admin Dashboard** - Comprehensive management interface
- 🚀 **High Performance** - Optimized for speed and scalability

---

## ✨ Features

### Frontend
- ✅ Server-side rendering with Next.js 15
- ✅ Responsive design with Tailwind CSS
- ✅ Beautiful UI components (Radix UI, Framer Motion)
- ✅ Interactive animations (GSAP, Lottie, Atropos)
- ✅ Blog and case studies showcase
- ✅ Portfolio gallery with Swiper
- ✅ Real-time authentication via Supabase
- ✅ Service request forms
- ✅ Payment integration UI
- ✅ Admin panel for content management

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB integration for agent logs
- ✅ Supabase integration for data storage
- ✅ Razorpay payment processing
- ✅ Email service with Resend
- ✅ Rate limiting and security (Helmet)
- ✅ AI agent orchestration system
- ✅ Automated daily digest emails
- ✅ Webhook handling
- ✅ Comprehensive error handling
- ✅ Request validation with Joi
- ✅ Winston logging

---

## 🛠 Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.2.9 | React framework with SSR |
| React | 19.0.0 | UI library |
| Tailwind CSS | 3.4.17 | Utility-first CSS |
| Radix UI | Latest | Accessible UI components |
| Framer Motion | 12.4.7 | Animation library |
| GSAP | 3.14.2 | Advanced animations |
| Supabase | 2.49.1 | Authentication & Database |

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4.21.2 | Web framework |
| MongoDB | 8.10.1 | NoSQL database (Mongoose) |
| Supabase | 2.49.1 | PostgreSQL database |
| Razorpay | 2.9.5 | Payment gateway |
| Resend | 4.1.2 | Email service |
| Winston | 3.17.0 | Logging |
| Helmet | 8.0.0 | Security middleware |

---

## 📁 Project Structure

```
mvsoftware-monorepo/
├── 📂 frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # React components
│   │   │   ├── ui/               # Reusable UI components
│   │   │   └── admin/            # Admin-specific components
│   │   ├── lib/                  # Utilities and API client
│   │   ├── content/              # Static content
│   │   └── styles/               # Global styles
│   ├── public/                   # Static assets
│   ├── next.config.js            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   └── package.json              # Frontend dependencies
│
├── 📂 backend/                     # Express.js Backend API
│   ├── src/
│   │   ├── routes/               # API route handlers
│   │   ├── controllers/          # Business logic
│   │   ├── middleware/           # Express middleware
│   │   ├── models/               # Database models
│   │   ├── services/             # External services
│   │   ├── agents/               # AI agent system
│   │   │   ├── orchestrator.js  # Agent coordinator
│   │   │   ├── scheduler/       # Cron jobs
│   │   │   ├── tools/           # Agent tools
│   │   │   └── triggers/        # Event handlers
│   │   ├── config/               # Configuration files
│   │   └── utils/                # Utility functions
│   ├── sql/                      # Database schemas
│   ├── api/                      # Serverless functions
│   ├── render.yaml               # Render deployment config
│   ├── vercel.json               # Vercel deployment config
│   └── package.json              # Backend dependencies
│
├── 📄 supabase_blog_casestudy.sql # Blog & case study schema
├── 📄 supabase_seed_data.sql      # Seed data
├── 📄 package.json                # Root monorepo config
└── 📄 README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayurv153/mvsoftware-frontend.git
   cd mvsoftware-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This command installs dependencies for both frontend and backend workspaces.

3. **Set up environment variables**

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   MONGODB_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   ADMIN_EMAILS=admin@example.com
   CORS_ORIGIN=http://localhost:3000
   ```

   See `backend/.env.example` for complete configuration.

4. **Set up the database**
   - Run the SQL schema files in your Supabase project
   - Import `supabase_blog_casestudy.sql` and `supabase_seed_data.sql`

---

## 💻 Development

### Run Both Applications

Start both frontend and backend in development mode:
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Run Separately

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

### Building

Build the frontend for production:
```bash
npm run build
# or
npm run build:frontend
```

### Linting

Lint both applications:
```bash
npm run lint
```

Lint separately:
```bash
npm run lint:frontend  # Frontend linting
npm run lint:backend   # Backend linting
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect your repository** to Vercel
2. **Configure build settings:**
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy** 🚀

### Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Configure service:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Environment: `Node`

3. **Set environment variables** (see `backend/.env.example`)
   - ⚠️ **Important:** Set `CORS_ORIGIN` to your Vercel frontend URL

4. **Deploy** 🚀

### Alternative: Backend on Vercel

The backend includes `vercel.json` for serverless deployment:
```bash
cd backend
vercel
```

---

## 🔐 Environment Variables

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | ✅ |
| `PORT` | Server port (default: 5000) | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | ✅ |
| `RESEND_API_KEY` | Resend email API key | ✅ |
| `EMAIL_FROM` | Sender email address | ✅ |
| `ADMIN_EMAILS` | Admin email addresses | ✅ |

---

## 🗄 Database

### Supabase (PostgreSQL)

The project uses Supabase for primary data storage. Schema files:

- **`supabase_blog_casestudy.sql`** - Blog posts and case studies
- **`supabase_seed_data.sql`** - Initial seed data
- **`backend/sql/schema.sql`** - Main database schema
- **`backend/sql/testimonials.sql`** - Customer testimonials
- **`backend/sql/portfolio_projects.sql`** - Portfolio items
- **`backend/sql/profiles.sql`** - User profiles

### MongoDB

MongoDB is used for:
- Agent execution logs
- System metrics
- Task tracking

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://your-backend.onrender.com`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/public/plans` | Get pricing plans |
| GET | `/api/public/testimonials` | Get testimonials |
| GET | `/api/public/portfolio` | Get portfolio projects |
| GET | `/api/public/blogs` | Get blog posts |
| GET | `/api/public/case-studies` | Get case studies |
| POST | `/api/service-requests` | Submit service request |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/check-admin` | Check admin status |
| POST | `/api/payments/create-order` | Create payment order |
| POST | `/api/payments/verify` | Verify payment |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/requests` | Get all service requests |
| GET | `/api/admin/metrics` | Get dashboard metrics |
| GET | `/api/admin/payments` | Get payment history |
| PATCH | `/api/admin/plans/:id` | Update pricing plan |
| POST | `/api/admin/testimonials` | Create testimonial |
| DELETE | `/api/admin/testimonials/:id` | Delete testimonial |

For complete API documentation, see the [backend README](backend/README.md).

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is **UNLICENSED** and private. All rights reserved by MV Software.

---

## 👨‍💻 Author

**MV Software**
- Website: [MV Software](https://mvsoftware.vercel.app)
- GitHub: [@Mayurv153](https://github.com/Mayurv153)

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

**Made with ❤️ by MV Software**

⭐ Star this repo if you find it helpful!

</div>
