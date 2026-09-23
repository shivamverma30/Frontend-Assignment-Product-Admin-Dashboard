# Product Admin Dashboard

A restrained product operations workspace built with Next.js App Router, React, TypeScript, Tailwind CSS, Axios, and DummyJSON.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The current foundation exposes `/login`, `/products`, and `/products/[id]`.

Validation commands:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Architecture

- `app/` contains route composition and the protected dashboard layout.
- `components/` contains reusable layout, auth, and UI primitives.
- `lib/api/client.ts` is the only Axios instance. It applies the DummyJSON base URL, attaches the stored access token, and publishes unauthorized responses consistently.
- `lib/api/auth.ts` and `lib/api/products.ts` contain typed request functions. UI components do not call Axios directly.
- `types/` contains the shared auth and product contracts.
- `lib/constants.ts` contains storage keys, safe page-size options, and API defaults.

## Client-side mutation persistence

DummyJSON mutations are simulated and are not persisted by the API. The completed dashboard will retain the user-visible result in `localStorage` using three separate records:

- `product-admin.created-products` for products created in this browser.
- `product-admin.product-overrides` for edits keyed by product id.
- `product-admin.deleted-product-ids` for ids hidden from the catalog.

Remote data remains the source of truth for reads; these local records are merged at the product repository boundary so refreshes preserve the current browser session without pretending that the API persisted the mutation. Product mutation state is intentionally independent from login state and survives logout/login.

## Product query behavior

Product list state is represented in the URL with `page`, `pageSize`, `search`, `category`, `sortBy`, and `sortOrder`. Search uses `/products/search`, while category filtering uses `/products/category/{category}` only when search is empty. DummyJSON does not expose a combined search-and-category endpoint, so the category control is disabled during search and the UI explains why.

Search input changes update the URL immediately, but product requests wait 400ms after the last keystroke. Debouncing reduces unnecessary requests; it is not sufficient for correctness because an older request can still finish after a newer one. Each list request also gets an `AbortController` and a request sequence identity, so canceled or stale responses cannot replace the latest query result.

## Authentication

The DummyJSON demo credentials are `emilys` / `emilyspass`. Authentication uses `POST /auth/login`; the access token and user session are stored in browser `localStorage` for this frontend-only assignment. There are no environment variables required.

## CRUD behavior

Create, update, and delete calls are sent to DummyJSON through the shared Axios service. Because DummyJSON simulates mutations, successful responses are written to the local product store: created products, per-ID edit overrides, and deleted IDs. Details and list views merge that state with API responses, including locally created products and deleted-product not-found states.

## Engineering notes

One important issue was authentication hydration during a full page refresh. The protected layout initially rendered before the browser session had been read, which could redirect a valid user to login. The auth store now exposes a hydration snapshot and the guard waits for it before redirecting.

AI tools helped scaffold repetitive TypeScript, component, and API wiring during development. The implementation was reviewed with lint, TypeScript, production builds, browser interaction checks, delayed search requests, responsive viewports, and forced API failures. No claim is made that every line was manually typed.

## Compliance checklist

- [x] Login with correct credentials and useful wrong-credential errors
- [x] Axios login request and one shared Axios instance
- [x] Bearer token interceptor and centralized normalized errors
- [x] Logout and protected product routes
- [x] Product image, title, category, price, rating, and stock
- [x] Desktop semantic table and mobile cards
- [x] `limit`, `skip`, numbered pagination, Previous, Next, page sizes 10/20/50
- [x] `Showing X-Y of Z` range text
- [x] Debounced server-side search with page reset
- [x] AbortController and request identity stale-response protection
- [x] Delayed search verification with `delay=2000` behavior simulated in browser routing
- [x] Categories API and category endpoint filtering
- [x] Price, rating, and title sorting with ascending/descending order
- [x] Product details, gallery, description, reviews, and invalid ID state
- [x] Add and edit forms with validation and duplicate-submit protection
- [x] Delete confirmation dialog with duplicate-delete protection
- [x] Local persistence for created, edited, and deleted products
- [x] Loading, empty, error, and retry states for async product flows
- [x] URL state for page, page size, search, category, sort, and order
- [x] Invalid URL normalization and oversized-page correction
- [x] API separation, small components, and no duplicated request logic
- [x] No React Query, SWR, table library, pagination library, or new dependency
- [x] README documentation
- [ ] Regular Git commits: commits are intentionally left for the project owner per instructions
- [x] Production build readiness verified

## Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run build
```

1. Build the product detail view.
2. Add create/edit/delete workflows and focused loading, error, empty, and retry states.
