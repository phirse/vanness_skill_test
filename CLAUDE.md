# Vanness — Student Performance Tracker

## Stack
- MERN: MongoDB, Express 4, React 19, Node.js + TypeScript on both sides
- Package manager: **npm workspaces** (monorepo)
- Tailwind CSS v4 (no config file)

## Monorepo Structure
```
Vanness/
├── client/   # Vite + React 19 + TypeScript (port 5173)
├── server/   # Express 4 + Mongoose 8 + TypeScript (port 5000)
└── package.json  # root with npm workspaces + concurrently
```

## Key Scripts (run from root)
- `npm run dev`   — starts both client (Vite :5173) and server (:5000) via concurrently
- `npm run build` — builds both
- `npm run lint`  — lints both

## Role Types
```typescript
type Role = 'student' | 'instructor'
```
No enums — use union types everywhere (see TS flags below).

## TypeScript Flags (client tsconfig.app.json)
- `erasableSyntaxOnly: true` → **no `enum`**, use union types instead
- `verbatimModuleSyntax: true` → use **`import type {}`** for type-only imports
- `noUnusedLocals: true`, `noUnusedParameters: true` → no unused variables/params

## Tailwind v4 Setup
- Plugin: `@tailwindcss/vite` added to `client/vite.config.ts` (before `react()`)
- CSS: `client/src/index.css` contains only `@import "tailwindcss";`
- **No** `tailwind.config.js` or `postcss.config.js` needed

## Environment Files
- `server/.env`: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`
- `client/.env`: `VITE_API_URL=http://localhost:5000/api`

## Server Entry Points
- `server/src/index.ts` — Express app, routes registered
- `server/src/config/db.ts` — MongoDB connection
- `server/src/middleware/auth.ts` — JWT Bearer protect + AuthRequest interface
- `server/src/middleware/role.ts` — requireInstructor, attachRole
- `server/src/models/User.ts` — role, academicYear, studentId fields
- `server/src/models/Assignment.ts`
- `server/src/models/Submission.ts`
