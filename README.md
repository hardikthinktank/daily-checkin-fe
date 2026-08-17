# Daily Check-In — Frontend

Frontend for the Daily Check-In care-management demo, integrated
against the real backend.

## Stack

- React 19 + TypeScript, Vite
- React Router (SPA)
- TanStack Query for server state (loading/error/empty handling)
- Zustand for the tiny bit of local UI state
- React Hook Form + Zod for forms/validation
- Tailwind CSS v4
- Recharts for the physician summary charts

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Requires `VITE_API_BASE_URL` pointing at a running backend — set it in `.env.local`:

```
VITE_API_BASE_URL=https://your-backend-url
```

## Layout

Four personas, one app, switched via the header nav:

- `/patient` — daily check-in + conditional follow-ups
- `/care-manager` — work list + flag detail + actions
- `/admin` — patient roster table
- `/physician` — monthly summary

## Architecture

Components and hooks never call `fetch` directly:

```
component → hooks/queries|mutations → api/*.service.ts → api/client.ts → fetch(...)
```

Each `api/*.service.ts` owns the wire-format mapping (the backend's snake_case JSON →
this app's camelCase `types/domain.ts` shapes), so components only ever see the mapped
types. `api/client.ts` centralizes the base URL, headers, and the uniform
`{error_code, message, detail}` error shape into `ApiError`.

