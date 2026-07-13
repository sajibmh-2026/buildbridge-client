# 🌉 BuildBridge — Developer Collaboration Platform

A full-stack web application where developers discover, join, and collaborate on open-source projects. Built with Next.js 15, Express.js, and MongoDB Atlas.

![BuildBridge](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Author](#-author)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration & login with JWT tokens
- Password hashing with bcryptjs (12 rounds)
- Role-based access control (User / Admin)
- Protected routes with middleware guards

### 📂 Project Management
- 3-step project creation wizard (Details → Skills → Review)
- Rich project cards with images, difficulty badges, and skill tags
- Category filtering (Web Dev, Mobile, AI/ML, DevOps, Blockchain, etc.)
- Difficulty levels: Beginner, Intermediate, Advanced
- Project status tracking (Open, In Progress, Completed)

### 🔍 Explore & Search
- Full-text search across project titles and descriptions
- Multi-filter system: category, difficulty, status, skills
- Paginated results with smooth loading states
- Responsive grid layout (1/2/3 columns)

### 📋 Application System
- Apply to projects with a message
- Accept / Reject applications by project owner
- Application status tracking (Pending → Accepted / Rejected)
- Dashboard with application statistics

### 📊 Dashboard
- Overview tab with stat cards and charts
- My Projects tab with project management
- Applications tab with status tracking
- Admin Panel with platform-wide analytics
- Interactive charts (Recharts): category distribution, difficulty breakdown, application status, monthly activity

### 🎨 UI/UX
- Scroll-triggered animations (Intersection Observer)
- Skeleton loading states for all pages
- Responsive design (mobile → desktop)
- Toast notifications (Sonner)
- Custom scrollbar and smooth scrolling
- Gradient backgrounds and glassmorphism effects

### 🔍 SEO
- Open Graph & Twitter Card meta tags
- JSON-LD structured data (Schema.org)
- Semantic HTML with proper heading hierarchy
- Canonical URLs

---

## 🛠 Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | App Router, Server Components, Turbopack |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling with custom theme |
| **Axios** | HTTP client with interceptors |
| **React Context** | Authentication state management |
| **Recharts** | Dashboard charts & analytics |
| **React Icons** | Feather & Simple Icons |
| **Sonner** | Toast notifications |

### Backend (`server/`)
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API server |
| **TypeScript** | Type safety via tsx |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM with schema validation |
| **JWT** | Authentication tokens (7-day expiry) |
| **bcryptjs** | Password hashing (12 rounds) |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment configuration |

---

## 📁 Project Structure

```
BuildBridge/
├── client/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── (auth)/        # Auth group (login, register)
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── explore/       # Browse projects
│   │   │   ├── profile/       # User profile
│   │   │   └── projects/      # Project CRUD
│   │   ├── components/
│   │   │   ├── auth/          # RoleGuard, AdminBadge
│   │   │   ├── charts/        # Recharts components
│   │   │   ├── home/          # Landing page sections
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   └── ui/            # Button, Card, Input, Skeleton
│   │   ├── constants/         # Categories, skills, SEO config
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useInView (scroll animations)
│   │   ├── providers/         # Context providers
│   │   ├── services/          # API service layer (Axios)
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   ├── public/                # Static assets
│   ├── .env.local             # Environment variables
│   ├── next.config.ts         # Next.js configuration
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── middleware/        # Auth & error middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route handlers
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # JWT & password utilities
│   │   └── index.ts           # Server entry point
│   ├── .env                   # Environment variables
│   ├── Procfile               # Railway deployment
│   ├── render.yaml            # Render deployment
│   └── package.json
│
├── architecture.md            # System architecture document
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **MongoDB Atlas** account (or local MongoDB)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/sajibmh-2026/buildbridge-client.git
git clone https://github.com/sajibmh-2026/buildbridge-server.git

# Install backend dependencies
cd buildbridge-server
npm install

# Install frontend dependencies
cd ../buildbridge-client
npm install
```

### Running Locally

```bash
# Terminal 1 — Start backend (port 5000)
cd server
npm run dev

# Terminal 2 — Start frontend (port 3000)
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

| Role  | Email                | Password     |
|-------|----------------------|--------------|
| User  | user@buildbridge.com | User1234!    |
| Admin | admin@buildbridge.com| Admin1234!   |

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buildbridge
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |
| PATCH | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects (with filters) |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects` | Create new project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply to a project |
| GET | `/api/applications/my` | Get my applications |
| PATCH | `/api/applications/:id` | Accept/Reject application |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | User dashboard stats |
| GET | `/api/dashboard/admin-stats` | Admin platform stats |
| GET | `/api/dashboard/users` | List all users (admin) |
| PATCH | `/api/dashboard/users/:id/role` | Update user role (admin) |

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push client code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Render / Railway)
1. Push server code to GitHub
2. Create new Web Service in [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Deploy

---

## 👤 Author

**Sajib Mh** — [GitHub](https://github.com/sajibmh-2026)

---

## 📄 License

This project is built for educational purposes as part of **SCIC-13 Assignment 3** at Programming Hero.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React Framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud Database
- [Vercel](https://vercel.com) — Deployment Platform
- [Programming Hero](https://programminghero.io/) — Course Provider
