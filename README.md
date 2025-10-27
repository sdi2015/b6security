# GuardTech Security Operations Platform

GuardTech is B6 Security's web-based command center for managing guard deployments, client contracts, and incident response. The application centralizes day-to-day operations—giving coordinators, schedulers, and account managers a shared view of guard coverage, open incidents, and client deliverables.

## Key capabilities
- **Command center dashboard** that surfaces upcoming shifts, staffing gaps, incident queues, and site coverage metrics through rich data visualizations and tables.
- **Guard roster management** with status tracking, certification records, and scheduling preferences backed by Supabase queries or offline mock data for demos.
- **Site and client directories** that tie guard posts to contract details, supporting quick lookups when planning coverage or reviewing service levels.
- **Scheduling tools** for reviewing near-term shift assignments and monitoring guard check-ins across time zones.
- **Incident reporting workflows** that capture severity, status, and follow-up requirements for field investigations.
- **Field operations and reporting pages** dedicated to mobile response teams, KPI tracking, and client-ready exports (see `src/pages/*`).

## Technology stack
- **Frontend:** Vite + React 18 with TypeScript for a fast, typed developer experience.
- **UI system:** Tailwind CSS and shadcn/ui primitives for accessible, composable components.
- **Data layer:** TanStack Query orchestrates Supabase reads/mutations with resilient retries and cache updates, falling back to realistic mock data when Supabase credentials are absent (ideal for local demos).
- **Backend integration:** Supabase client configured via environment variables with safe guards when credentials are missing.
- **State management:** Lightweight React context for authenticated account metadata (`src/context/AccountContext.tsx`).

## Project structure
```
├── src
│   ├── pages/              # Route-level views (dashboard, guards, sites, schedule, incidents, reports, clients, settings)
│   ├── components/         # Shared UI elements, layout scaffolding, and domain widgets
│   ├── features/operations # Hooks and types that wrap Supabase or mock data sources
│   ├── context/            # Application-wide providers (theme, account, toasts)
│   └── lib/                # Supabase client, mock data seeds, and utility helpers
├── public/                 # Static assets served by Vite
├── supabase/               # Database migrations and seed scripts for managed tables
└── scripts/                # Developer tooling (e.g., lockfile repair)
```

## Getting started
1. **Install prerequisites**
   - Node.js ≥ 18 and npm ≥ 8 are required (enforced in `package.json`).
2. **Clone and install**
   ```bash
   git clone <repository-url>
   cd b6security
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env.local` file at the project root with:
     ```bash
     VITE_SUPABASE_URL=<https://your-project.supabase.co>
     VITE_SUPABASE_ANON_KEY=<public-anon-key>
     ```
   - Without these keys, the app gracefully falls back to mock operations data for exploration, but writes and authentication will be disabled.
4. **Run the development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` to explore GuardTech.
5. **Build for production** (optional)
   ```bash
   npm run build
   npm run preview
   ```

## Supabase setup (optional but recommended)
1. Provision a Supabase project and apply the SQL migrations in `supabase/migrations` to create the required tables.
2. Generate a service role key for backend scripts if you need seed data beyond the provided mocks.
3. Use Supabase Row Level Security (RLS) policies to scope data by `account_id`, mirroring the client-side filters enforced in the React hooks.

## Available scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Produce an optimized production bundle. |
| `npm run build:dev` | Generate a development-mode build useful for debugging bundling issues. |
| `npm run preview` | Serve the built assets locally to verify the production bundle. |
| `npm run lint` | Lint the entire project with ESLint and TypeScript configuration. |
| `npm run repair-lock` | Reconcile dependency versions if the lockfile becomes inconsistent. |

## Development tips
- **Routing:** All pages are registered in `src/App.tsx`; add new routes above the catch-all `*` route.
- **Data fetching:** Prefer the hooks in `src/features/operations/hooks.ts` to keep caching rules and Supabase permissions consistent. Extend them with `useMutation` when adding create/update flows.
- **Styling:** Tailwind utility classes and shadcn/ui components provide the baseline visual language. Extend via `src/components` rather than ad-hoc CSS for consistency.
- **Mock mode:** During early development or demos without Supabase credentials, the mock data functions in `src/lib/mockData.ts` supply realistic seed entities that mirror production schema expectations.

## Contributing
1. Create a feature branch for your work.
2. Ensure `npm run lint` passes before committing.
3. Submit a pull request summarizing the change, including screenshots for UI updates when relevant.

GuardTech is the foundation for B6 Security's operational excellence. Contributions that improve guard oversight, incident transparency, or client collaboration are highly valued.
