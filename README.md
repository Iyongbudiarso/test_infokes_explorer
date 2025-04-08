# Test Infokes Explorer

A full-stack application with Vue.js frontend and Bun/Elysia.js backend for file/folder exploration.

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- MySQL database server running

## Setup & Installation

1. Install dependencies for all packages:
```bash
bun run install:all
```

2. Setup backend environment:
```bash
cd backend
cp env.sample .env
```
Edit the `.env` file with your MySQL database credentials and JWT secret:
```
DATABASE_URL="mysql://user:password@localhost:3306/db_test_infokes_explorer"
JWT_SECRET="your_jwt_secret"
BCRYPT_SALT_ROUNDS=10
```

3. Run database migrations and seed:
```bash
cd backend
bun prisma migrate dev
bun run seed
```

## Running Development Servers

To run both frontend and backend concurrently:

```bash
bun run dev
```

This will start:
- Frontend server at http://localhost:5173
- Backend server at http://localhost:3000

## Available Scripts

- `bun run dev` - Start both frontend and backend development servers
- `bun run install:all` - Install dependencies for both frontend and backend
- `bun run seed` - Run database seeding script
