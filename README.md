# Project Management Application

A modern, full-stack project management application built with Next.js, TypeScript, Prisma, and NextAuth.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔐 Authentication & Authorization with NextAuth
- 📝 Project Management
  - Create, view, update, and delete projects
  - Project status tracking (Active, On Hold, Completed)
  - Team collaboration
- 📅 Task Management
- 👥 User Management
- 🎨 Dark/Light Mode
- 📱 Responsive Design
- 🚀 Optimized for performance

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - React Hook Form
  - Zod (Schema Validation)

- **Backend**:
  - Next.js API Routes
  - Prisma (ORM)
  - PostgreSQL (Primary Database)
  - NextAuth.js (Authentication)

- **DevOps**:
  - GitHub Actions (CI/CD)
  - Docker (Local Development)
  - Vercel (Deployment)
  - ESLint & Prettier (Code Quality)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-management-app.git
   cd project-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Database Setup

1. Create a new PostgreSQL database
2. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project/
├── app/                    # App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected routes
│   │   ├── projects/       # Project management
│   │   └── settings/       # User settings
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── auth/               # Auth components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── auth.ts             # Auth utilities
│   └── prisma.ts           # Prisma client
├── prisma/                 # Database schema
│   └── schema.prisma
├── public/                 # Static assets
└── styles/                 # Global styles
```

## API Documentation

### Authentication

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Deployment

### Vercel

1. Push your code to a GitHub repository
2. Import the project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

1. Build the Docker image:
   ```bash
   docker build -t project-management-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 project-management-app
   ```

## CI/CD

The project uses GitHub Actions for CI/CD. Workflows include:

- `CI`: Runs on pull requests and pushes to main/develop
- `Deploy`: Deploys to Vercel on push to main
- `Migrations`: Runs database migrations
- `CodeQL`: Security and quality analysis

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
