# Project

Frontend of a website. Mock data for now, no real backend.

## Stack
- React, TypeScript, Tailwind CSS, Vite
- TanStack Query for data fetching
- shadcn/ui for UI components
- pnpm as package manager

## References
- Design and reference material is in `docs/ref/`
- Visual source of truth is `DESIGN.md`

## Rules
- Never use the type `any`. Use proper types, `unknown` with narrowing, or generics.

## Structure
- `src/app/router.tsx`: all routes; `src/app/providers.tsx`: global providers (TanStack Query)
- `src/app/routes/`: one file per route, only combines features and layout
- `src/features/<name>/types.ts`: entity types of that feature
- `src/features/<name>/api/<name>-api.ts`: the only place that fetches data (mock for now)
- `src/features/<name>/api/use-<name>.ts`: TanStack Query hooks around the API
- `src/features/<name>/components/`: components of that feature (e.g. `listing-card.tsx`)
- `src/components/ui/`: shadcn/ui components, added with `pnpm dlx shadcn@latest add <name>` (run inside `frontend/`)
- `src/components/layout/`: app layout (header, navigation)
- `src/lib/`: `utils.ts` (`cn`) and `mock-db.ts` (mock database and delay)

## Done when
- `pnpm typecheck` and `pnpm lint` pass
- The page was opened with Playwright MCP and screenshots at 375 px and 1440 px match DESIGN.md
- No errors in the browser console