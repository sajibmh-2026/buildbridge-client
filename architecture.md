# 🏗 BuildBridge — System Architecture

## Overview

BuildBridge is a full-stack Developer Collaboration Platform built with a **client-server architecture**. The frontend is a Next.js 15 single-page application, and the backend is an Express.js REST API connected to MongoDB Atlas.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js 15)                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Context  │  │ Services │   │
│  │ (App     │  │ (UI,     │  │ (Auth    │  │ (Axios   │   │
│  │  Router) │  │  Layout, │  │  State)  │  │  API)    │   │
│  │          │  │  Charts) │  │          │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘         │
│                              │                               │
│                     HTTP/REST (Axios)                        │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Express.js)                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Routes   │  │Middleware│  │  Models  │  │  Utils   │   │
│  │ (Auth,   │  │ (Auth,   │  │(Mongoose │  │ (JWT,    │   │
│  │  Project,│  │  Role    │  │ Schemas) │  │  bcrypt) │   │
│  │  App,    │  │  Guard)  │  │          │  │          │   │
│  │  Dash)   │  │          │  │          │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┘   │
│       │              │              │                        │
│       └──────────────┴──────────────┘                        │
│                              │                               │
│                     Mongoose ODM                             │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                     │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Users   │  │ Projects │  │  Apps    │                  │
│  │Collection│  │Collection│  │Collection│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Authentication Flow
```
User → Login Page → POST /api/auth/login
  → Server validates email/password
  → Server generates JWT (7-day expiry)
  → Client stores token in localStorage
  → Axios interceptor attaches token to all requests
  → authenticate middleware verifies token on protected routes
  → authorize middleware checks user role for admin routes
```

### Project Creation Flow
```
User → Add Project (3-step wizard)
  Step 1: Title, descriptions, category, difficulty, image
  Step 2: Required skills selection
  Step 3: Review & submit
  → POST /api/projects (with JWT)
  → Server validates & creates project in MongoDB
  → Redirect to project detail page
```

### Application Flow
```
Applicant → View Project → Apply with message
  → POST /api/applications
  → Owner sees application in Dashboard
  → Owner accepts/rejects
  → PATCH /api/applications/:id
  → Status updated in MongoDB
```

---

## Database Schema

### User
```typescript
{
  name: string;           // Display name
  email: string;          // Unique email
  password: string;       // bcrypt hashed (12 rounds)
  photo: string;          // Profile photo URL
  role: "user" | "admin"; // Access level
  skills: string[];       // Developer skills
  bio: string;            // Short bio
  createdAt: Date;
  updatedAt: Date;
}
```

### Project
```typescript
{
  title: string;              // Project name
  shortDescription: string;   // Brief description (200 chars)
  description: string;        // Full description (markdown)
  category: ProjectCategory;  // web-dev, mobile, ai-ml, etc.
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "open" | "in-progress" | "completed";
  requiredSkills: string[];   // Skills needed
  image: string;              // Cover image URL
  owner: ObjectId → User;     // Project creator
  maxMembers: number;         // Team size limit
  createdAt: Date;
  updatedAt: Date;
}
```

### Application
```typescript
{
  projectId: ObjectId → Project;  // Target project
  applicantId: ObjectId → User;   // Applicant
  message: string;                // Application message
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## API Architecture

### Route Structure
```
/api
├── /auth
│   ├── POST   /register       — Create account
│   ├── POST   /login          — Get JWT token
│   ├── GET    /profile        — Get current user
│   └── PATCH  /profile        — Update profile
│
├── /projects
│   ├── GET    /               — List projects (search, filter, paginate)
│   ├── GET    /:id            — Get project details
│   ├── POST   /               — Create project [auth]
│   ├── PATCH  /:id            — Update project [auth + owner]
│   └── DELETE /:id            — Delete project [auth + owner]
│
├── /applications
│   ├── POST   /               — Apply to project [auth]
│   ├── GET    /my             — Get my applications [auth]
│   └── PATCH  /:id            — Accept/Reject [auth + owner]
│
└── /dashboard
    ├── GET    /stats          — User dashboard stats [auth]
    ├── GET    /admin-stats    — Platform stats [auth + admin]
    ├── GET    /users          — List users [auth + admin]
    └── PATCH  /users/:id/role — Change role [auth + admin]
```

### Middleware Pipeline
```
Request → CORS → JSON Parser → Route Handler
                                ↓
                          authenticate (JWT verify + DB role fetch)
                                ↓
                          authorize (role check)
                                ↓
                          Handler (business logic)
                                ↓
                          Response (JSON)
```

---

## Frontend Architecture

### Component Hierarchy
```
App
├── Providers (AuthContext, Toast)
│   └── Layout (Navbar + Content + Footer)
│       ├── Home Page
│       │   ├── Hero (animated)
│       │   ├── Statistics (scroll animation)
│       │   ├── Categories (scroll animation)
│       │   ├── FeaturedProjects (scroll animation)
│       │   ├── HowItWorks (scroll animation)
│       │   ├── Testimonials (scroll animation)
│       │   ├── FAQ (scroll animation)
│       │   └── CTA (scroll animation)
│       │
│       ├── Explore Page (search + filters + grid)
│       ├── Dashboard Page (tabs: overview, projects, applications, admin)
│       ├── Profile Page (user info + projects)
│       └── Project Pages (detail, add, edit)
│
└── Auth Pages (Login, Register) — no navbar/footer
```

### State Management
```
AuthContext (React Context)
├── user: IUser | null
├── loading: boolean
├── login(email, password)
├── register(name, email, password)
├── logout()
└── loadUser() — refresh from API

Local State (useState)
├── Dashboard: activeTab, dashboardData, adminData
├── Explore: projects, filters, pagination
└── Forms: form data, validation, submission state
```

---

## Security

| Concern | Solution |
|---------|----------|
| Password Storage | bcryptjs with 12 salt rounds |
| Authentication | JWT tokens (7-day expiry) |
| Authorization | Role-based middleware (user/admin) |
| API Security | CORS whitelist, JSON body parser |
| Input Validation | Server-side validation on all endpoints |
| Stale Roles | authenticate middleware fetches current role from DB |

---

## Performance Optimizations

| Area | Technique |
|------|-----------|
| Images | Next.js Image component with lazy loading |
| Loading | Skeleton loaders for all pages |
| Animations | CSS transitions + Intersection Observer (no heavy JS library) |
| API | MongoDB aggregation pipelines for dashboard stats |
| Caching | JWT tokens in localStorage (7-day validity) |
| Bundle | Turbopack for faster dev builds |

---

## Deployment Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │     │   Render /   │     │   MongoDB    │
│  (Client)    │────▶│   Railway    │────▶│    Atlas     │
│              │     │  (Server)    │     │  (Database)  │
│  Next.js 15  │     │  Express.js  │     │  Cloud DB    │
│  Static/SSR  │     │  REST API    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
     ▲                      ▲                      ▲
     │                      │                      │
  HTTPS               HTTPS/HTTP              MongoDB SRV
  Port 443            Port 5000               Port 27017
```

---

## Tech Decisions & Rationale

| Decision | Reasoning |
|----------|-----------|
| Next.js App Router | Modern React with SSR, file-based routing, built-in optimizations |
| Express.js | Lightweight, flexible REST API with extensive middleware ecosystem |
| MongoDB Atlas | Cloud-hosted NoSQL, flexible schema, free tier for development |
| JWT over Sessions | Stateless auth, works across domains, mobile-friendly |
| Tailwind CSS v4 | Rapid UI development, small bundle, custom theme system |
| React Context | Built-in state management, no extra dependencies for auth state |
| Axios | Request/response interceptors for automatic token attachment |
| Recharts | Lightweight, composable React charting library |
