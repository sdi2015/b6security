# Project Guidelines for Future Agents

## Overview
- **Project name:** B6 Security Operations Platform
- **Purpose:** Provides a multi-page dashboard for managing security guards, sites, schedules, incidents, clients, and reports. Routes are defined in `src/App.tsx` and render page components under `src/pages`.

## Tech Stack
- Vite + React 18 with TypeScript modules.
- Tailwind CSS and shadcn/ui component primitives for styling and UI patterns.
- React Router for client-side routing and layout composition.
- TanStack Query for server-state management; a shared `QueryClient` is created in `src/App.tsx`.
- Supabase client utilities live under `supabase/` and `src/lib` for backend integration helpers.

## Environment & Setup
1. Ensure Node.js **>= 18** and npm **>= 8** (enforced via `package.json` engines).
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server with hot reloading:
   ```sh
   npm run dev
   ```
4. To preview a production build locally:
   ```sh
   npm run build
   npm run preview
   ```

## Development Commands
| Use case | Command |
| --- | --- |
| Run Vite dev server | `npm run dev` |
| Create production build | `npm run build` |
| Build in development mode | `npm run build:dev` |
| Preview the production build | `npm run preview` |
| Lint the project with ESLint | `npm run lint` |
| Repair lockfile if dependencies drift | `npm run repair-lock` |

## Coding Conventions
- Use TypeScript strictly; avoid introducing plain `.js` files unless tooling demands it.
- Prefer functional React components with hooks; colocate feature-specific hooks in `src/hooks/` or feature subfolders.
- Leverage the `@/` path alias for importing from `src/` (configured via Vite/TS).
- Styling should primarily use Tailwind utility classes combined with shadcn/ui components. Keep custom CSS in `src/index.css` or component-scoped files when necessary.
- Reuse shared UI components from `src/components` and domain modules from `src/features` before creating new variants.
- Follow ESLint guidance; ensure `npm run lint` passes before committing.

## Architectural Notes
- Page-level components reside in `src/pages` and are registered as routes in `src/App.tsx`. Add new routes above the catch-all `*` route comment.
- Shared global state (e.g., account/session data) is provided via React context providers under `src/context`.
- API and data access helpers live in `src/lib` and should wrap Supabase or other integrations with clear TypeScript types.
- When introducing asynchronous data flows, prefer TanStack Query hooks for caching, loading states, and error handling.
- Keep domain-specific logic under `src/features/<domain>/` with a clear separation between UI, hooks, and services to encourage modular design.

