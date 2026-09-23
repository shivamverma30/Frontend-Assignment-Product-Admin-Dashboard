# Product Admin Dashboard

A frontend product administration dashboard built with Next.js App Router, React, TypeScript, Tailwind CSS, Axios, and the DummyJSON API. It includes authenticated product browsing, URL-driven search and filtering, product details, and browser-local CRUD persistence for DummyJSON's simulated mutations.

## Live Demo

[https://frontend-assignment-product-admin-shivam-verma.vercel.app/](https://frontend-assignment-product-admin-shivam-verma.vercel.app/)

### Demo credentials

- Username: `emilys`
- Password: `emilyspass`

## Features

### Authentication

- Login through DummyJSON with username/password credentials.
- User-safe invalid credential errors.
- Protected `/products` routes, including details, add, and edit routes.
- Logout with auth state and token removal.
- Bearer token attachment for authenticated API requests.
- Duplicate login submission prevention.

### Product management

- Product image, title, category, price, rating, and stock.
- Semantic desktop table with view, edit, and delete actions.
- Mobile product cards with the same core product information and actions.
- Product details with image gallery, description, metadata, and DummyJSON reviews.

### Pagination

- API pagination using `limit` and `skip`.
- Numbered pages, Previous, and Next controls.
- Page sizes of 10, 20, and 50.
- Range text such as `Showing 21-40 of 194`.
- Invalid and oversized page values are normalized safely.

### Search

- Server-side search through `/products/search?q=`.
- 400ms debounce before issuing search requests.
- Search resets the current page to 1.
- Search value is synchronized to the URL.
- Previous requests are canceled and stale responses are ignored.
- Delayed-response behavior was verified with an artificially delayed `phone` request while replacing it with `laptop`.

### Filtering and sorting

- Categories loaded from DummyJSON.
- Category filtering through `/products/category/:category`.
- Sorting by price, rating, or title.
- Ascending and descending sort order.
- Filter and sort values are synchronized to the URL.

### Product details

- Route: `/products/[id]`.
- Product images and gallery.
- Description, category, price, rating, and stock.
- Reviews from DummyJSON.
- Clear not-found state and back link for invalid or unavailable products.

### CRUD

- Add product at `/products/new`.
- Edit product at `/products/[id]/edit`.
- Delete confirmation dialog before removal.
- Validation for title, description, category, price, stock, and optional image URL.
- Duplicate save and delete request prevention.
- Success, loading, API error, and validation feedback.
- Local persistence for DummyJSON's simulated mutations.

### UI states

- Contextual skeleton loading states.
- Empty catalog/search results.
- Product, category, detail, form, and delete error states.
- Retry actions where retrying is meaningful.
- Responsive table/card presentation without horizontal overflow at the reviewed target widths.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and App Router |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP/API requests |
| DummyJSON | Backend/API |

No React Query, SWR, table library, pagination library, or additional UI/state-management dependency is used.

## API Endpoints

All requests use the shared Axios instance in `lib/api/client.ts`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/login` | Authenticate the demo user |
| `GET` | `/products` | Fetch paginated products |
| `GET` | `/products/search?q=` | Search products |
| `GET` | `/products/categories` | Load category options |
| `GET` | `/products/category/:category` | Fetch products in a category |
| `GET` | `/products/:id` | Fetch product details |
| `POST` | `/products/add` | Simulate product creation |
| `PUT` | `/products/:id` | Simulate product update |
| `DELETE` | `/products/:id` | Simulate product deletion |

## Architecture

The application keeps API calls outside UI components:

```text
UI routes
  ↓
Components and hooks
  ↓
API service modules and product store
  ↓
Shared Axios instance
  ↓
DummyJSON API
```

Important repository structure:

```text
app/
├── (dashboard)/
│   ├── products/page.tsx
│   ├── products/[id]/page.tsx
│   ├── products/[id]/edit/page.tsx
│   └── products/new/page.tsx
├── login/page.tsx
└── globals.css
components/
├── auth/
├── layout/
├── products/
└── ui/
hooks/
├── use-product-categories.ts
├── use-product-detail.ts
└── use-product-list.ts
lib/
├── api/
│   ├── auth.ts
│   ├── client.ts
│   ├── errors.ts
│   └── products.ts
├── auth/
├── product-store.ts
├── constants.ts
└── utils/product-query.ts
types/
├── auth.ts
└── product.ts
```

## Authentication Flow

1. The user submits username and password through the login form.
2. `lib/api/auth.ts` sends `POST /auth/login` through the shared Axios client.
3. DummyJSON returns access-token and user information.
4. The auth session abstraction stores the session in browser `localStorage` under `product-admin.auth-session`.
5. The Axios request interceptor reads the auth abstraction and adds `Authorization: Bearer <token>` when a token exists.
6. `AuthGuard` waits for session hydration before redirecting unauthenticated users from protected routes.
7. Logout clears the auth session and routes to `/login`.
8. A centralized response interceptor clears the session and publishes an auth change on `401` responses without creating redirect loops.

This is client-side persistence appropriate for a frontend assignment; it is not a server-side session or secure production authentication system.

## URL State

Product-list state is represented by these query parameters:

- `page`
- `pageSize`
- `search`
- `category`
- `sortBy`
- `sortOrder`

Example:

```text
/products?page=2&pageSize=20&search=phone&sortBy=price&sortOrder=asc
```

Refreshing or sharing the URL reproduces the same list query. Invalid values such as `?page=abc`, negative pages, unsupported page sizes, invalid sort fields, and invalid sort orders fall back to safe defaults. If a valid request reveals that a page is beyond the available range, the URL is corrected to the last valid page.

## Handling Stale Search Responses

Search input is debounced for 400ms so typing does not issue a request for every keystroke. Debounce alone is not enough for correctness: a request started for `phone` can still be in flight when a later `laptop` request starts, and the older response might finish last.

The product-list hook uses both mechanisms:

- Each request receives an `AbortController` signal and the previous request is aborted when the query changes.
- Each request receives a sequence identity. A response is applied only if its identity is still the current one.

This means an older response cannot replace a newer query result even if cancellation arrives too late. The behavior was tested with an artificially delayed `phone` response equivalent to the assignment's delayed-response scenario, followed by a `laptop` search.

## Search + Category API Limitation

DummyJSON exposes search and category filtering through separate endpoints and does not provide the combined server-side search-plus-category operation required by the assignment.

The application therefore uses this explicit behavior:

- Non-empty search uses `/products/search`.
- Non-empty category with an empty search uses `/products/category/:category`.
- The category selector is disabled while search is active and explains why.
- Clearing search re-enables category filtering.

The UI does not pretend that the API supports a combined query.

## DummyJSON Mutation Persistence

DummyJSON `POST`, `PUT`, and `DELETE` product operations are simulated and are not permanent server-side persistence. The dedicated `lib/product-store.ts` abstraction keeps the visible result in browser `localStorage`:

- `product-admin.created-products` stores created products.
- `product-admin.product-overrides` stores edit overrides keyed by product ID.
- `product-admin.deleted-product-ids` stores deleted IDs.

List and detail data merge these records with API results. Newly created products can be opened even though DummyJSON cannot fetch them. Edited products show their local override. Deleted products are hidden from lists and show an unavailable/not-found state in details. Invalid or missing stored JSON is handled by falling back to empty records and removing the corrupt value. Product mutation state is separate from auth state and is not cleared by logout.

## Loading, Empty, and Error Handling

- Product lists show skeleton rows/cards while loading.
- Existing product content remains visible while a changed query updates where practical.
- Category loading and category errors are represented in selectors and toolbar feedback.
- Details and edit routes show loading skeletons, API errors, or not-found states; the details view provides a retry action for retryable failures.
- Forms disable controls and show `Saving...` during submission.
- Delete dialogs show `Deleting...` and prevent duplicate actions.
- Empty list/search results show a meaningful empty state.
- API errors use the normalized error shape from `lib/api/errors.ts` rather than exposing Axios internals.
- Retry actions repeat the current request.
- Invalid product IDs and invalid URL values are handled without a broken page.

## Responsive Design

- At desktop widths, products use a semantic HTML table.
- Below the desktop table breakpoint, products use cards instead of forcing horizontal table scrolling.
- The reviewed layouts include approximately 1440px, 1024px, 768px, and 390px widths with no horizontal overflow in the final mobile check.

## Design Decisions

1. API calls are separated into `lib/api/auth.ts` and `lib/api/products.ts` so UI components focus on rendering and interaction.
2. One Axios instance centralizes the base URL, bearer-token attachment, normalized errors, and unauthorized handling.
3. URL parameters are the single source of truth for product-list state, making refresh and sharing predictable.
4. Search is debounced to reduce avoidable requests, while cancellation and request identity provide correctness.
5. Search and category use separate DummyJSON endpoints because the API does not support the required combined operation.
6. DummyJSON mutations are merged through one product store so browser-visible changes survive refreshes.
7. React Query and SWR were not used because this assignment benefits from explicit request lifecycle and stale-response handling.
8. Table and pagination behavior are implemented with semantic HTML and small local components rather than additional libraries.

## Problem Faced and Solution

### Problem

A locally created product could be returned by DummyJSON's simulated add endpoint without complete fields such as `rating`, `images`, or `reviews`.

### Cause

DummyJSON mutation responses are simulated and can be partial compared with a full product returned from `GET /products`.

### Solution

The product store normalizes mutation responses with complete safe defaults before storing them. Product rows, cards, and details also use an explicit no-image state when no thumbnail exists.

### Result

Created products remain safe to render in lists and details, survive refresh, and can be edited or locally deleted even though the server does not persist them.

## AI Assistance

AI tools were used for implementation guidance, code suggestions, debugging, edge-case review, and README drafting. The final implementation was checked against the repository, linted, type-checked, production-built, and exercised through browser workflow checks. The README is intentionally limited to behavior supported by the current codebase.

## Setup

No environment variables are required.

```bash
git clone https://github.com/shivamverma30/Frontend-Assignment-Product-Admin-Dashboard.git
cd Frontend-Assignment-Product-Admin-Dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

## Assignment Compliance

- [x] Login
- [x] Correct credentials
- [x] Wrong credential handling
- [x] Logout
- [x] Protected routes
- [x] Product image
- [x] Product title
- [x] Category
- [x] Price
- [x] Rating
- [x] Stock
- [x] Desktop table
- [x] Mobile cards
- [x] Pagination using `limit`/`skip`
- [x] Page numbers
- [x] Previous/Next
- [x] Page sizes 10/20/50
- [x] `Showing X-Y of Z`
- [x] Debounced search
- [x] Search resets page
- [x] Stale request protection
- [x] Delayed-response search verification
- [x] Category filter
- [x] Price sorting
- [x] Rating sorting
- [x] Title sorting
- [x] Product details
- [x] Images
- [x] Description
- [x] Reviews
- [x] Wrong ID/not-found state
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Validation
- [x] Delete confirmation
- [x] Loading state
- [x] Empty state
- [x] Error state
- [x] Retry
- [x] URL page state
- [x] URL search state
- [x] URL filter state
- [x] URL sort state
- [x] Invalid URL handling
- [x] Duplicate login prevention
- [x] Duplicate save prevention
- [x] Shared Axios setup
- [x] Centralized API error handling
- [x] API calls separated from UI
- [x] Small reusable components
- [x] No React Query
- [x] No SWR
- [x] No ready-made table library
- [x] No ready-made pagination library

## Submission

### Live Demo

[https://frontend-assignment-product-admin-shivam-verma.vercel.app/](https://frontend-assignment-product-admin-shivam-verma.vercel.app/)

### GitHub Repository

[https://github.com/shivamverma30/Frontend-Assignment-Product-Admin-Dashboard](https://github.com/shivamverma30/Frontend-Assignment-Product-Admin-Dashboard)

### Demo Credentials

- Username: `emilys`
- Password: `emilyspass`
