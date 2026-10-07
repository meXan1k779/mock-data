# finex-education — Claude Instructions

## Project overview

Indonesian financial education platform (Finex Kita). Users write and read articles about trading and finance. Articles go through a moderation pipeline before being published.

Tech stack: **Next.js 16 (App Router) · React 19 · TypeScript · Redux Toolkit + RTK Query · Tailwind CSS v4 · TipTap editor**

---

## Commands

```bash
npm run dev        # start dev server on localhost:3000
npm run build      # production build
npm run lint:fix   # ESLint + auto-fix
npm run format     # Prettier
npm run start      # gen-env then next start (prod)
```

`npm run start` requires `BASE_API_URL` in the environment — it writes `public/__env.js` (picked up at runtime via `window.env.BASE_API_URL`). For dev, create a `.env.local` with `BASE_API_URL=<url>`.

---

## Architecture — Feature-Sliced Design (FSD)

```
app/          Next.js App Router pages & layouts
widgets/      Self-contained page sections (header, footer, topics, moderating)
features/     Business logic slices (auth, article, profile, settings, main)
shared/       Reusable primitives (ui, hooks, utils, types, icons, api, constants)
mocks/        Static mock data used for development/testing
```

**Layering rule:** each layer can only import from layers below it:
`app` → `widgets` → `features` → `shared`

Never import upward (e.g., `shared` must not import from `features`).

---

## State management

- **RTK Query** for all server data — endpoints are injected into `baseApi` (`shared/api/base-api.ts`) using `baseApi.injectEndpoints()`.
- **Redux slices** for client-only state: `auth` (tokens + user), `articleSave` (editor draft), `article` (current article view).
- Store lives in `shared/api/store.ts`.

### Auth flow
- JWT stored in `localStorage` (`accessToken`, `refreshToken`).
- `baseQueryWithReauth` in `base-api.ts` auto-refreshes on `jwt expired` error, then retries the original request. On refresh failure it dispatches `logout()`.
- `initializeAuth` action is called on app boot to rehydrate state from localStorage.

### RTK Query tag types
`Auth | User | Profile | AllMyContent | Content | AllContent | ModeratorCards`

---

## API

Base URL resolved at runtime:
- **Client:** `window.env.BASE_API_URL` (injected by `scripts/makeFrontEnv.js` into `public/__env.js`)
- **Server (SSR):** `process.env.BASE_API_URL`

All requests send `Authorization: Bearer <accessToken>` and `Content-Type: application/json`.

---

## Article status lifecycle

```
draft → moderatorReview → regulatorReview → approved
                ↓                ↓
        moderator_rejected   regulator_rejected
                                    ↓
                               hidden / deleted
```

Type: `shared/types/article-status.ts` → `ArticleStatus` enum.

---

## Design system

Tokens are defined in `app/globals.css` under `@theme {}` — **not** in `tailwind.config.js` (which is minimal). Always use token-based class names, e.g.:

```
bg-primary-bg        → #FFCD05 (brand yellow)
text-content-primary → #111928
border-border-tetriary → #E3E7ED
bg-background-secondary → #F5F7FA
```

Custom breakpoints: `xs(320) sm(640) md(768) 2md(960) lg(1024) xl(1280) 2xl(1440)`

Fonts: `font-noto` (body, default) · `font-manrope` (headings/display)

---

## Component patterns

- **Shared UI** components live in `shared/ui/<name>/` — use these before creating new ones.
- **Feature UI** lives in `features/<feature>/ui/`.
- **Modals** use `react-modal` with the `.custom-overlay` class for the backdrop.
- **Skeleton loaders** exist as sibling files (e.g. `card.tsx` / `skeleton.tsx`).
- Rich text editing uses **TipTap** with custom extensions in `shared/ui/tiptap-editor/`.

---

## Key shared hooks

| Hook | Purpose |
|---|---|
| `useAnalytics` | GTM event + pageview tracking |
| `useAutoSave` | Debounced auto-save for the article editor |
| `useContentSaver` | Handles draft/publish save logic |
| `useUnsavedChanges` | Warns before leaving with unsaved editor state |
| `useTimerWithPersist` | Countdown timer backed by localStorage (used for email resend) |
| `useClickOutside` | Closes dropdowns/popups |
| `useMedia` | Breakpoint detection |
| `usePasswordValidation` | Password strength rules |

---

## Important conventions

- `clsx` for conditional classnames — always prefer over template strings.
- `dynamic(() => import(...), { ssr: false })` for components that need browser APIs (Header, Topics).
- Images served from `storage.googleapis.com` — allowed in `next.config.ts` `images.domains`.
- `DOMPurify` must be used before rendering any user-generated HTML.
- Indonesian city list is in `shared/constants/cities.ts` — don't rebuild it.

---

## What to watch out for

1. **`window.env` vs `process.env`** — the API URL is runtime-injected; never hardcode it.
2. **RTK Query cache invalidation** — when a mutation changes data, make sure to invalidate the right tag so queries refetch.
3. **SSR vs client** — many components are client-only (`'use client'`). Avoid accessing `localStorage`/`window` at module level; guard with `typeof window !== 'undefined'`.
4. **`publicRuntimeConfig` is deprecated** in Next.js 16 — it's kept for legacy code; prefer `window.env` for new work.
5. **Article editor state** lives in Redux (`articleSave` slice), not local React state — keep editor updates going through that slice.
