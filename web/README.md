# Proxima — web prototype

A mobile-first, dark-themed PWA prototype of the location-based dating app
described in [`../PLAN.md`](../PLAN.md). This is the **frontend, on mock data** —
the nearby grid, profiles, taps, and chat are interactive but not yet wired to a
backend.

**Live demo:** `https://anegrutz.github.io/datingapp/` (published by the
`Deploy web to GitHub Pages` GitHub Actions workflow).

## What's here

| Screen | Route | Notes |
|--------|-------|-------|
| Nearby grid | `/` | Proximity grid with online-now + distance filters |
| Profile | `/profile/[id]` | Photo hero, interests, looking-for, Message/Tap actions |
| Taps | `/taps` | Lightweight interest signals received |
| Messages | `/messages` | Conversation list with unread badges |
| Chat | `/messages/[id]` | Real-time-style thread with typing indicator + canned replies |
| Profile & settings | `/me` | Privacy/safety toggles (distance, online, incognito, read receipts) |

Avatars are generated gradients (no real photos), so the prototype ships no
personal data.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4.

## Run locally

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

## Build the static export

```bash
npm run build    # outputs to web/out
```

For GitHub Pages (project site under `/datingapp`), the workflow sets
`NEXT_PUBLIC_BASE_PATH` automatically via `actions/configure-pages`.

## Next steps

See `../PLAN.md` §10. The frontend currently reads from `src/lib/data.ts`; the
next milestone is replacing that with the live API (auth, PostGIS nearby query,
WebSocket chat/presence) and deploying the backend to a server host with a
managed PostgreSQL/PostGIS + Redis.
