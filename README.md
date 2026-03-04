# Vanness — Student Performance Tracker

Skill Test for Fullstack Developer Trainee at **Vanness Plus Consulting Co., Ltd.**

A web application for tracking student performance, managing assignments, and grading submissions.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Express 4, Mongoose 8, Node.js
- **Database:** MongoDB
- **Auth:** JWT (Bearer token)
- **Package Manager:** npm workspaces (monorepo)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

Required variables in `server/.env`:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiration (e.g., `7d`) |
| `PORT` | Server port (default: `5000`) |

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start development servers

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Test Credentials

After running the seed script:

| Role | Email | Password |
|---|---|---|
| Instructor | InstructorTest@test.com | password123 |
| Student 1 | StudentTest@test.com | password123 |
| Student 2 | StudentTest2@test.com | password123 |
| Student 3 | StudentTest3@test.com | password123 |

## Developer

**Pisute Chen** — pisute.che@student.mahidol.ac.th
