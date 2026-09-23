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

Remote data remains the source of truth for reads; these local records are merged at the product repository boundary so refreshes preserve the current browser session without pretending that the API persisted the mutation.

## Product query behavior

Product list state is represented in the URL with `page`, `pageSize`, `search`, `category`, `sortBy`, and `sortOrder`. Search uses `/products/search`, while category filtering uses `/products/category/{category}` only when search is empty. DummyJSON does not expose a combined search-and-category endpoint, so the category control is disabled during search and the UI explains why.

Search input changes update the URL immediately, but product requests wait 400ms after the last keystroke. Debouncing reduces unnecessary requests; it is not sufficient for correctness because an older request can still finish after a newer one. Each list request also gets an `AbortController` and a request sequence identity, so canceled or stale responses cannot replace the latest query result.

## Next implementation slice

1. Build the product detail view.
2. Add create/edit/delete workflows and focused loading, error, empty, and retry states.
