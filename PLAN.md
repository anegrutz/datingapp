# Plan: Grindr-Style Location-Based Dating Web App

> A pragmatic, build-ready plan for a geo-proximity dating/social web application
> inspired by Grindr. Starts with an analysis of what makes the product work, then
> defines the feature set, architecture, data model, safety/legal requirements, and a
> phased delivery roadmap.

---

## 1. Product Analysis — Why Grindr Works

Grindr's core differentiator is **immediacy + proximity**. Unlike swipe apps (Tinder/Bumble)
that gate conversation behind a mutual match, Grindr shows a live grid of nearby people and
lets anyone message anyone right away. The product lessons that matter for our design:

| Principle | What it means for us |
|-----------|----------------------|
| **Proximity-first discovery** | The home screen is a grid of nearby users sorted by distance, not a curated feed. Distance is the primary signal. |
| **Low friction to contact** | No mutual-match requirement. Open DMs (with safety controls) drive engagement. |
| **Fast, photo-led grid** | A dense, image-first grid that loads instantly. Speed and density beat polish. |
| **Lightweight profiles** | Short profiles (photo, headline, a few "stats"/tags). Identity is expressed through tags, not long bios. |
| **Real-time presence** | "Online now" and recency are core ranking signals. The app feels alive. |
| **Ephemerality & control** | Disappearing photos, incognito/invisible mode, block/report are first-class, not afterthoughts. |
| **Safety as a feature** | In a dating context (especially LGBTQ+ users, some in hostile regions), privacy and safety are product features, not compliance checkboxes. |

### Key takeaways that shape the build
1. **Geolocation and ranking are the heart of the app** — invest here first.
2. **Real-time chat + presence** is the second pillar.
3. **Safety/trust/moderation** must be built in from day one, not bolted on.
4. Everything else (premium features, filters, albums) is layered on top.

---

## 2. Design & UX Analysis (Best Practices)

### 2.1 Information architecture (primary navigation)
A bottom tab bar (mobile-web first) with 4–5 destinations:
- **Grid / Explore** — nearby users (default landing).
- **Messages** — conversation list with unread + online indicators.
- **Taps / Likes** — lightweight "interest" signals received.
- **Profile** — your own profile + settings/visibility controls.
- (Optional) **Saved / Favorites**.

### 2.2 The grid (home screen)
- Responsive masonry/grid of square avatar tiles (3 across on phone, more on desktop).
- Each tile overlays: online dot, distance, display name, optional "fresh/new" badge.
- Infinite scroll with cursor pagination; load distance-sorted batches.
- Pull-to-refresh re-queries location.
- Filters sheet: distance radius, age range, tags/"looking for", online-now toggle.

### 2.3 Profile view
- Hero photo carousel + thumbnail strip.
- Headline + "About".
- Structured **stats/tags** (e.g. role, relationship goal, interests) rendered as chips.
- Distance + last-online (subject to privacy settings).
- Primary actions: **Message**, **Tap/Like**, **Favorite**, **Block/Report** (always reachable).

### 2.4 Chat
- 1:1 threads, real-time delivery, typing indicators, read receipts (toggleable).
- Send: text, photos (with optional view-once/expiring), location share (explicit, opt-in), reactions.
- Safety affordances inline: report message, block user, "unsend".

### 2.5 Visual / interaction principles
- **Dark theme by default** (category convention; reduces glare in private/nighttime use).
- Mobile-first, thumb-reachable controls; works as an installable **PWA**.
- Optimistic UI for messages and taps; skeleton loaders for the grid.
- Accessibility: WCAG AA contrast, semantic landmarks, focus states, reduced-motion support, alt text.
- Performance budget: grid first contentful paint < 1.5s on 4G; images lazy-loaded + responsive (`srcset`, AVIF/WebP).

### 2.6 Onboarding (kept short)
1. Sign up (email/OAuth) → 2. Age gate (18+) → 3. Location permission →
4. Add a photo + display name → 5. Land on grid. Defer optional profile fields.

---

## 3. Feature Set

### 3.1 MVP (Phase 1 — must-have)
- Email/OAuth auth, sessions, **18+ age verification gate**.
- Profile: display name, photos (upload + moderation), headline, tags/stats.
- **Geolocation capture** + distance-sorted nearby grid with pagination & filters.
- **Real-time 1:1 chat** (text + images) with presence ("online now") & unread counts.
- **Taps/likes** (lightweight interest signal) + notifications.
- **Block & report**; basic admin moderation queue.
- Privacy controls: show/hide distance, show/hide online status, incognito.
- Account settings, logout, delete account (GDPR-style data deletion).
- Push notifications (Web Push) for messages/taps.

### 3.2 Phase 2 (engagement & trust)
- Photo verification / verified badge (selfie-pose match).
- Favorites/saved list; "viewed me" list.
- Expiring / view-once photos in chat; album sharing with per-user grants.
- Advanced filters (tags, "looking for", body/role attributes), saved filters.
- Typing indicators, read receipts (toggle), message reactions, unsend.
- Spam/abuse detection (rate limits, image hashing against known-bad, link scanning).

### 3.3 Phase 3 (monetization & scale)
- Premium tier: unlimited grid (see more profiles), advanced filters, incognito, "viewed me",
  no ads, read receipts control, push-to-top.
- Travel/"Explore" mode: browse another location before arriving.
- Albums marketplace / events / group features (optional).
- Payments (Stripe) + subscription management.

---

## 4. Recommended Tech Stack

Chosen for fast iteration, strong real-time support, and a single-language full stack.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | **Next.js (React, TypeScript) as a PWA** + Tailwind CSS | SSR/ISR for fast first load, file routing, great DX, installable mobile-web. |
| **State/data** | TanStack Query + Zustand | Server-cache + light client state. |
| **Backend API** | **Node.js + NestJS (TypeScript)** REST + WebSocket gateway | Structured, testable, shares types with frontend. |
| **Real-time** | WebSockets (Socket.IO) backed by **Redis** pub/sub | Chat, presence, typing, live grid updates; horizontally scalable. |
| **Database** | **PostgreSQL + PostGIS** | Relational core **plus first-class geospatial** queries (`ST_DWithin`, KNN `<->`) for proximity. |
| **Cache/presence** | Redis | Online presence, rate limiting, pub/sub fan-out, session/token store. |
| **Object storage** | S3-compatible (AWS S3 / Cloudflare R2) + CDN | Photos, signed upload/download URLs. |
| **Image pipeline** | On-the-fly resize/transcode (e.g. imgproxy/Cloudflare Images) | Responsive AVIF/WebP, strip EXIF (removes embedded GPS!). |
| **Auth** | Auth.js/NextAuth or custom JWT + refresh; OAuth providers | Email + social login. |
| **Push** | Web Push (VAPID) / FCM | Notifications without a native app. |
| **Search/feed** | Postgres first; add Elasticsearch only if needed | Avoid premature complexity. |
| **Infra** | Docker, deployed on a managed platform (Fly.io/Render/AWS); IaC later | Reproducible; sticky-session or Redis adapter for WS. |
| **Observability** | OpenTelemetry, Sentry, structured logs | Errors, traces, abuse metrics. |

> **Why PostGIS over a NoSQL geo store:** dating apps need both relational integrity
> (users, blocks, messages, consent grants) **and** fast radius/KNN search. PostGIS gives both
> in one database, simplifying ops for an MVP. Revisit a dedicated geo index (e.g. geohash in
> Redis) only if read volume demands it.

### Alternative stacks (if preferred)
- **Django + Channels + PostGIS** (Python) — excellent geo + admin out of the box.
- **Rails + ActionCable + PostGIS** — fast CRUD, mature.
- **Supabase/Firebase** — fastest MVP (auth, realtime, storage managed) at the cost of
  geo-query flexibility and vendor lock-in. Good for a prototype.

---

## 5. Data Model (core entities)

```
User            id, email, hashed_pw/oauth, dob (age gate), created_at,
                last_active_at, is_banned, role(user/mod/admin)

Profile         user_id, display_name, headline, about,
                tags[] / structured stats (role, looking_for, etc.),
                primary_photo_id, visibility_settings(json)

Photo           id, user_id, storage_key, status(pending/approved/rejected),
                nsfw_score, is_private(album), created_at      // EXIF stripped on upload

Location        user_id (1:1), geog(Point, SRID 4326), updated_at,
                precision(exact/approx), share_distance(bool)   // PostGIS GEOGRAPHY column

Conversation    id, created_at, last_message_at
ConvParticipant conversation_id, user_id, last_read_at, muted

Message         id, conversation_id, sender_id, type(text/image/loc),
                body/ciphertext, media_id, expires_at, unsent(bool), created_at

Tap (Like)      from_user_id, to_user_id, created_at        // unique pair/day

Favorite        user_id, target_user_id, created_at
Block           blocker_id, blocked_id, created_at          // enforced on all reads
Report          reporter_id, target_user_id/message_id, reason, status, created_at
AlbumGrant      owner_id, viewer_id, granted_at, revoked_at  // private album consent
Subscription    user_id, plan, status, stripe_ids, period_end
Device          user_id, web_push_subscription, platform, last_seen
```

### Proximity query (PostGIS)
```sql
-- Nearby, not-blocked, visible users ordered by distance (KNN index-friendly)
SELECT u.id, ST_Distance(l.geog, :me) AS meters
FROM locations l
JOIN users u ON u.id = l.user_id
WHERE u.is_banned = false
  AND ST_DWithin(l.geog, :me, :radius_m)
  AND u.id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = :me_id)
  AND u.id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = :me_id)
ORDER BY l.geog <-> :me
LIMIT :page_size;
```
Index: `CREATE INDEX ON locations USING GIST (geog);`

---

## 6. Real-Time Architecture

- **WebSocket gateway** authenticates the socket (JWT), joins user to a room `user:{id}`.
- **Presence:** on connect, set `presence:{id}` in Redis with TTL; heartbeat refreshes it;
  expiry ⇒ offline. Publish presence changes via Redis pub/sub so other nodes update grids.
- **Chat:** message persisted to Postgres → emitted to recipient room → Web Push if offline.
- **Typing/read receipts:** transient socket events, not persisted (except `last_read_at`).
- **Scaling:** multiple gateway nodes share state via the Redis adapter; CDN/edge for static.

---

## 7. Safety, Trust & Moderation (first-class)

This is a category where safety failures cause real-world harm. Non-negotiable:

- **Strip EXIF/GPS metadata** from every uploaded image server-side.
- **Location fuzzing option:** never expose exact coordinates; expose distance buckets or
  jittered position; let users hide distance entirely. Beware *trilateration* — randomize/quantize
  distances so attackers can't triangulate a user's exact home.
- **Block enforcement** on every query (grid, chat, profile, taps).
- **Report flow** → moderation queue with admin tooling; track repeat offenders.
- **NSFW/illegal content detection** on image upload (automated classifier + human review queue);
  **zero tolerance + mandatory reporting hooks for CSAM** (e.g. hash-matching, report to NCMEC).
- **Rate limiting & anti-spam:** per-IP and per-account limits on messages, taps, signups.
- **Photo verification** to reduce catfishing.
- **Safety center:** in-app safety tips, panic/hide features, quick block, "hide me" for
  users in hostile regions.
- **Consent for private albums** (explicit grant/revoke).

---

## 8. Security & Privacy Engineering

- Passwords hashed with Argon2id; OAuth where possible; MFA optional.
- Short-lived JWT access + rotating refresh tokens; secure, httpOnly cookies.
- All media via signed URLs; private content never publicly addressable.
- Input validation + output encoding; parameterized queries; CSRF protection; strict CORS.
- TLS everywhere; HSTS; CSP; rate limiting at the edge.
- Encrypt sensitive columns at rest; consider E2E encryption for chat in a later phase.
- **Privacy/legal compliance:** GDPR/CCPA — data export, right to deletion, clear consent for
  location processing (location is sensitive personal data), age verification (18+),
  privacy policy + ToS, retention limits, and care around sexual-orientation data
  (a special category under GDPR). Consult counsel before launch in regulated markets.

---

## 9. Testing & Quality

- **Unit** (Jest/Vitest) for services & utils, esp. distance/privacy/block logic.
- **Integration** for API + DB (PostGIS queries against a test container).
- **E2E** (Playwright) for signup → grid → chat happy paths.
- **Real-time tests** for socket presence/delivery.
- **Load tests** (k6) on grid query and WS fan-out.
- **Security tests:** authz on every endpoint, block bypass attempts, EXIF stripping,
  trilateration resistance.
- CI: lint + typecheck + test on every PR; preview deploys.

---

## 10. Delivery Roadmap (phased)

| Phase | Scope | Outcome |
|-------|-------|---------|
| **0 — Foundations** (1–2 wk) | Repo, CI, Docker, Postgres+PostGIS, base schema, auth skeleton, design system/Tailwind, PWA shell. | Running scaffold, deploys. |
| **1 — MVP** (4–6 wk) | Profiles+photos+moderation, geolocation, nearby grid + filters, real-time chat + presence, taps, block/report, privacy controls, push. | Usable proximity dating app. |
| **2 — Trust & engagement** (3–4 wk) | Photo verification, favorites, viewed-me, expiring photos, advanced filters, reactions, anti-spam. | Stickier, safer product. |
| **3 — Monetization & scale** (3–4 wk) | Premium tier + Stripe, Explore/travel mode, observability/scaling hardening, load testing. | Revenue + scale-ready. |

### Immediate next steps (Phase 0 starter tasks)
1. Scaffold Next.js (TS, Tailwind, PWA) + NestJS API in a monorepo (pnpm/Turborepo).
2. `docker-compose` with Postgres+PostGIS and Redis.
3. Prisma/TypeORM schema for the core entities in §5; enable PostGIS extension + GIST index.
4. Auth (signup/login, 18+ gate) + session handling.
5. Location capture endpoint + nearby-grid endpoint with the PostGIS query in §5.
6. WebSocket gateway with presence + 1:1 chat.
7. Photo upload pipeline (signed URLs, EXIF strip, moderation status).
8. Block/report + minimal admin queue.

---

## 11. Open Decisions (to confirm before building)
- **Audience/positioning:** LGBTQ+-focused (Grindr's niche) vs. general — affects copy,
  tags, and moderation policy. (Functionality is the same.)
- **Stack:** confirm Next.js + NestJS + PostGIS, or prefer Django/Supabase for speed.
- **Native vs PWA:** PWA-first recommended for MVP; native apps later for push/location quality.
- **Hosting target:** Fly.io/Render (fast) vs AWS (control).
- **Monetization model & launch markets** (drives legal/compliance scope).

---

*This document is a starting plan. Once the stack and audience are confirmed, Phase 0
scaffolding can begin immediately using the starter tasks in §10.*
