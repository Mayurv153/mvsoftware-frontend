# MV Webservice Frontend

A modern, full-stack web application for MV Webservice - delivering stunning animated websites and AI-powered automations for small businesses and startups.

## 🚀 Features

- **Stunning Animations**: Built with GSAP, Framer Motion, and Lenis for smooth, eye-catching animations
- **Modern UI**: Powered by Next.js 14, React 18, and Tailwind CSS
- **AI Automations**: Integrated AI-powered solutions for business automation
- **Full Authentication**: Secure authentication system with Supabase
- **Blog & Case Studies**: Dynamic content management for blogs and case studies
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **SEO Optimized**: Built-in SEO features with metadata and sitemap generation
- **Payment Integration**: Payment processing for services

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2 (App Router)
- **UI Library**: React 18.3
- **Styling**: Tailwind CSS 3.4
- **Animations**:
  - GSAP 3.14
  - Framer Motion 12.4
  - Lenis (Smooth Scrolling)
  - Atropos (3D parallax effects)
- **UI Components**:
  - Radix UI primitives
  - Lucide React icons
  - Custom UI components
- **Database**: Supabase

### Backend
- API routes and server-side functionality handled through Next.js API routes
- Supabase for backend services and database

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mayurv153/mvsoftware-frontend.git
cd mvsoftware-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Add other environment variables as needed
```

### 4. Database Setup

Run the provided SQL scripts to set up your Supabase database:

```bash
# Run the seed data script in your Supabase SQL editor
# Files: supabase_seed_data.sql, supabase_blog_casestudy.sql
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
mvsoftware-frontend/
├── backend/              # Backend-specific files
├── frontend/             # Frontend-specific files
├── Photos/               # Image assets
├── public/               # Public static files
│   └── assets/          # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin dashboard
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── blog/        # Blog pages
│   │   ├── case-studies/# Case study pages
│   │   ├── services/    # Service pages
│   │   └── ...         # Other pages
│   ├── components/      # Reusable React components
│   ├── content/         # Content files
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   └── styles/          # Global styles
├── middleware.js        # Next.js middleware
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## 🎨 Key Features Explained

### Custom Cursor
Interactive custom cursor that enhances user experience with smooth animations.

### Smooth Scrolling
Lenis smooth scroll implementation for buttery smooth page scrolling.

### Page Loader
Beautiful loading animation for page transitions.

### Admin Dashboard
Comprehensive admin panel for managing:
- Blog posts
- Case studies
- Services
- User management
- Analytics

### Authentication
Secure authentication system powered by Supabase with:
- User registration
- Login/Logout
- Protected routes
- Profile management

## 🔒 Security

- Environment variables for sensitive data
- Middleware for route protection
- Secure authentication with Supabase
- Input validation and sanitization

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Self-hosted

## 📝 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Authors

- **Mayur Vaghela** - [GitHub](https://github.com/Mayurv153)

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with detailed information about the bug and steps to reproduce it.

## 📞 Support

For support, email support@mvwebservice.com or visit our website at [mvwebservice.com](https://mvwebservice.com).

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- Supabase for backend services
- All open-source contributors

---

Made with ❤️ by MV Webservice
