# Fit Forge frontend

Custom clothing web app. Frontend only, with mock data. Stack: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, react-router, zod, lucide-react. Package manager: pnpm.

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck
pnpm lint
pnpm build
```

Demo login: any email and a password of 6+ characters.

## Flow

Login → measurement tutorial → style quiz → 6 photos → avatar → outfits → outfit → try-on → bag → checkout → order confirmation. Unfinished onboarding always resumes at the first unfinished step.

Routes: `/login`, `/onboarding/measure|style|photos|generating`, `/app`, `/app/outfit/:id`, `/app/try-on`, `/cart`, `/checkout`, `/order/confirmation`.

## Free services for the MVP

### Try-on: IDM-VTON (chosen, implemented)

- Service: `yisol/IDM-VTON` on Hugging Face Spaces, called with `@gradio/client` from the browser.
- Cost: free demo, no card needed.
- Limits:
  - ZeroGPU quota is small and shared. Reports disagree on the free allowance (about 3.5 to 5 GPU-minutes per day). Each run reserves about 60 seconds, so expect roughly 3 to 5 try-ons per day per account. Queues can be long.
  - One garment per run. A look with several pieces runs one step per piece.
  - Quality depends on the input photo: a plain background and a full-body front photo work best.
- Licence: CC-BY-NC-SA 4.0, so non-commercial use only.
- Rejected:
  - 302.ai / Leffa: paid, $0.15 per call.
  - FASHN hosted API: paid. The open weights are not a free hosted service.
  - OOTDiffusion: also a free demo, but IDM-VTON is the more direct match.
  - opentryon: no confirmed free hosted demo.
  - V0 template: needs a paid OpenAI key.

### Avatar: none chosen yet

No free service builds a body model from six photos. The app uses the mock avatar (the front photo, no 3D model). The `AvatarProvider` interface is ready for a real service. Candidates still under consideration:
- `gradiopro/PSHuman` (free Space): reconstructs a clothed person from one photo. Last updated December 2024, and I could not confirm that it is running. It does not use six photos.
- Rejected: Avatar SDK / MetaPerson (API is enterprise-only), Sideload ($2 per generation), Ready Player Me (shut down January 2026), WaveSpeedAI (face swap, not body models).

## Configuration

Copy `.env.example` to `.env.local` and fill in the values you need. `.env.local` is git-ignored.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | empty | Empty = mock data for every feature API. |
| `VITE_AVATAR_PROVIDER` | `mock` | Avatar service. Only `mock` exists today. |
| `VITE_TRYON_PROVIDER` | `mock` | Set to `idm-vton` to use the free try-on demo. |
| `VITE_IDM_VTON_SPACE` | `yisol/IDM-VTON` | Hugging Face Space used by `idm-vton`. |
| `VITE_HF_TOKEN` | empty | Optional Hugging Face token for a larger ZeroGPU quota. |

**Security:** any `VITE_` value is bundled into the browser code and is visible to anyone who opens the page. This setup is for local demos only. Real keys must move to a backend, which then calls the service.

If a service is missing, misconfigured, times out or hits its limit, the app shows a friendly notice and uses the mock result. A failed request is retried once, with a 150-second timeout for try-on and 90 seconds for avatars. Results are cached in localStorage, so repeated requests are avoided.

## Photos and placeholder images

- Photos are personal data. For the MVP, use test photos only. In the mock flow, photos are stored in this browser's localStorage and are not sent to any server. With `idm-vton`, the front photo and garment image are sent to Hugging Face.
- `public/images/` contains flat-colour placeholder PNGs named by gender (`men-*`, `women-*`). Replace them with real photos of men's and women's clothing on matching models. The placeholders are not photos.

## Architecture

- Each feature lives in `src/features/<name>/`. Screens import only hooks and components, never API modules or mock data.
- `api/<name>-api.ts` defines an interface (for example `CatalogApi`) and its mock implementation. A real HTTP implementation can replace the mock there, using `src/lib/http-client.ts`, without changing components or hooks. `src/lib/api-config.ts` decides between mock and HTTP based on `VITE_API_URL`.
- `TryOnViewer` (`src/features/tryon/components/tryon-viewer.tsx`) is the only try-on component screens use. It renders whatever the active `TryOnProvider` returns.
- Mock persistence (session, onboarding progress, measurements, style, photos, cart, orders) is in `src/lib/mock-db.ts`, with an artificial delay.

## Notes

- `src/components/ui/` contains shadcn/ui components (base-ui variant). Some are unused in the app.
- Bundle: `@gradio/client` is loaded only when the `idm-vton` provider runs.
