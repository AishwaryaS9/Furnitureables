# Furnitureables

Furnitureables is a full-stack furniture e-commerce platform built with Next.js. It includes a customer-facing storefront (browsing, cart, wishlist, checkout, orders) and a separate admin dashboard for managing products, orders, customers, reviews, and analytics.

**Live Demo:** https://furnitureables-store.vercel.app/

## Features

**Storefront**

- Product catalog with filtering, search, and category pills
- Product detail pages with reviews and related products
- Cart and wishlist with sync across sessions, including a "Quick Add" button on product cards that switches to "Go to Cart" once an item has been added
- Multi-address checkout with Stripe and Razorpay payment support
- Order history, order details, and downloadable PDF invoices, plus an emailed invoice (PDF attached) when an order is confirmed
- Order tracking timeline on the order details page: Order Placed → Order Confirmed → Packed & Shipped → In Transit → Out for Delivery → Delivered, with a timestamp on each completed step (vertical layout on mobile, horizontal on tablet/desktop)
- "Processing Order…" loading state on the checkout button for both Stripe and Razorpay payments, which also blocks double submission
- Contact form (Web3Forms), plus About, FAQ, Privacy, Terms, and Cookies pages
- Branded splash screen on first load
- Animated home page (Framer Motion): staggered hero entrance, plus scroll-triggered reveals for the Shop by Category, Featured Collection, and Designed for You sections
- Custom branded 404 (not found) page with search and quick navigation back into the store
  **Admin Dashboard**

- Product management with CSV bulk upload/export and AI-generated product descriptions
- Order management with status updates (Confirmed → Shipped → In Transit → Out for Delivery → Delivered, or Cancelled) and search (for COD orders, payment status automatically moves from `PENDING` to `PAID` once the order is marked `DELIVERED`; prepaid Stripe/Razorpay orders are `PAID` from the moment the order is placed)
- Coupon management, including deletion (coupons already used on an order are protected — deactivate instead)
- Real-time order notifications in the admin header (Server-Sent Events), with read/unread state
- Customer management
- Review moderation
- Analytics dashboard (revenue, category performance, order funnel, ratings, stock vs. sales, and more)
  **Platform**

- Authentication and role-based admin access via Clerk
- GraphQL API layer alongside REST API routes
- PostgreSQL database via Prisma ORM
- Media uploads via Vercel Blob
- Google Analytics 4 (GA4) tracking across the storefront — automatic pageviews on every client-side route change, plus custom events (cart/wishlist icon clicks, newsletter signup, hero CTA clicks, product list views)

## Tech Stack

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router)                  |
| Language         | TypeScript                                                     |
| UI               | React 19, Tailwind CSS 4, shadcn/ui, Base UI primitives        |
| Database         | PostgreSQL, [Prisma ORM](https://www.prisma.io)                |
| Auth             | [Clerk](https://clerk.com)                                     |
| Payments         | [Stripe](https://stripe.com), [Razorpay](https://razorpay.com) |
| AI               | Google Gemini (`@google/generative-ai`)                        |
| API              | GraphQL (`graphql-yoga`) + REST route handlers                 |
| Data fetching    | TanStack Query, `graphql-request`                              |
| State            | Zustand                                                        |
| Media storage    | Vercel Blob                                                    |
| Forms/validation | React Hook Form, Zod                                           |
| Charts           | Recharts                                                       |
| PDF generation   | `@react-pdf/renderer`                                          |
| Animation        | [Framer Motion](https://www.framer.com/motion)                 |
| Analytics        | Google Analytics 4 (`@next/third-parties`)                     |
| Unit testing     | [Vitest](https://vitest.dev), React Testing Library            |
| E2E testing      | [Playwright](https://playwright.dev)                           |

## Project Structure

```
app/
  (shop)/            # Customer-facing storefront routes (home, products, cart, checkout, orders, addresses, wishlist, about, contact, faq, privacy, terms, cookies)
  (admin)/admin/     # Admin dashboard routes (analytics, coupons, customers, notifications, orders, products, reviews, upload)
  (admin-auth)/      # Admin sign-in route
  api/               # REST API routes (AI, GraphQL, Stripe/Clerk webhooks, media & CSV upload)
  not-found.tsx      # Custom branded 404 page (site-wide)
components/          # Shared and feature UI components (admin/, product/, cart/, checkout/, orders/, address/, wishlist/, common/SplashScreen, analytics/, ui/...)
hooks/               # React Query hooks for data fetching and mutations
lib/                 # Server/client utilities
  ai/, analytics/, auth/, constants/, coupon/, csv/, email/, graphql/, notifications/, order/, upload/, validations/
prisma/              # Prisma schema and seed script
generated/prisma/    # Generated Prisma client (re-run `npx prisma generate` after schema changes)
providers/           # App-level React providers (React Query, etc.)
store/               # Zustand stores (cart, checkout, coupon, filters, ...)
types/               # Shared TypeScript types
tests/               # Automated tests (see Testing)
  unit/              #   Vitest unit/component tests
  e2e/               #   Playwright end-to-end tests
middleware.ts        # Clerk middleware protecting admin routes
vitest.config.mts    # Vitest configuration
vitest.setup.ts      # Vitest setup (jest-dom matchers, cleanup)
playwright.config.ts # Playwright configuration
prisma.config.ts     # Prisma CLI configuration (schema path, seed, DIRECT_URL)
```

## Data Model

Defined in `prisma/schema.prisma`, the core models include:

`User`, `Product`, `ProductMedia`, `Cart`, `CartItem`, `Address`, `Order`, `OrderItem`, `Wishlist`, `Review`, `Coupon`, `AdminNotification`

with supporting enums for media type, order status, payment status/method, review status, and discount type.

`Order` also stores a timestamp for each tracking milestone — `confirmedAt`, `shippedAt`, `inTransitAt`, `outForDeliveryAt`, `deliveredAt` — which power the order timeline.

## Order & Payment Status Logic

`Order` tracks `status` (`PENDING`, `CONFIRMED`, `SHIPPED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`) and `paymentStatus` (`PENDING`, `PAID`, ...) independently, since they don't always change together.

- **Cash on Delivery (COD):** the order is created as `CONFIRMED` / `PENDING` payment in a single request (`placeOrder`), since there's nothing further to confirm. `paymentStatus` stays `PENDING` through `CONFIRMED` and `SHIPPED`. When the admin marks the order `DELIVERED`, `paymentStatus` is automatically updated to `PAID` in the same update, reflecting that cash is collected at the point of delivery. If a COD order is `CANCELLED` before delivery, `paymentStatus` remains `PENDING` (no payment was ever collected).
- **Razorpay (prepaid):** the order is created as `PENDING` while the Razorpay order/payment is opened client-side, then immediately confirmed to `CONFIRMED` / `PAID` in the same request once the client calls `verifyRazorpayPayment` with the signed payment details.
- **Stripe (prepaid):** the order is created as `PENDING` alongside the PaymentIntent. Once `stripe.confirmCardPayment` succeeds client-side, the client calls the `confirmStripePayment` mutation, which re-verifies the PaymentIntent directly against Stripe's API and, if it's genuinely `succeeded`, updates the order to `CONFIRMED` / `PAID` in the same request — so the order page reflects the correct status immediately, without needing a refresh. The `/api/stripe/webhook` route runs the same confirmation logic (`lib/order/confirmStripeOrder.ts`) as a fallback, in case the client-side call never completes (e.g. the tab is closed right after payment). Both paths are idempotent, so whichever one confirms the order first is the only one that triggers the admin notification and confirmation email.
  Once an order is `CONFIRMED`, the admin is notified in real time and a confirmation/invoice email is sent (`lib/order/onOrderConfirmed.ts`). Post-confirmation status changes (`SHIPPED` / `IN_TRANSIT` / `OUT_FOR_DELIVERY` / `DELIVERED` / `CANCELLED`) are made by the admin and live in `adminUpdateOrderStatus` in `graphql/resolvers/order.ts`.

### Order tracking timeline

The order details page (`components/orders/details/OrderTimeline.tsx`) maps `status` to six steps:

| Step             | Reached when                | Timestamp shown    |
| ---------------- | --------------------------- | ------------------ |
| Order Placed     | The order exists            | `createdAt`        |
| Order Confirmed  | `CONFIRMED` or later        | `confirmedAt`      |
| Packed & Shipped | `SHIPPED` or later          | `shippedAt`        |
| In Transit       | `IN_TRANSIT` or later       | `inTransitAt`      |
| Out for Delivery | `OUT_FOR_DELIVERY` or later | `outForDeliveryAt` |
| Delivered        | `DELIVERED`                 | `deliveredAt`      |

- `confirmedAt` is set automatically when payment is confirmed (or immediately for COD), so _Order Placed_ and _Order Confirmed_ typically complete within seconds of each other. The remaining timestamps are set when the admin changes the status.
- Times are displayed in IST (`Asia/Kolkata`) so server and client renders match.
- Orders created before the timestamp fields existed fall back to `createdAt` for the first two steps; later steps they already passed show no time.
- A `CANCELLED` order shows a cancelled card instead of the timeline.

## Getting Started

### Prerequisites

- Node.js 20.9+ (required by Next.js 16)
- A PostgreSQL database
- Accounts/API keys for Clerk, Stripe, Razorpay, Google Gemini, and Web3Forms (as needed for the features you plan to use)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:

```bash
# Database
DATABASE_URL=
DIRECT_URL=          # direct (non-pooled) connection used by the Prisma CLI for db push / migrate

# Clerk (authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Google Gemini (AI features)
GEMINI_API_KEY=
GEMINI_MODEL=

# Web3Forms (contact form)
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=

# SMTP (order invoice emails)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_SECURE=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=
SMTP_SUPPORT_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPPORT_EMAIL=

# Google Analytics 4 (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

SMTP settings are optional in development — if unset, invoice emails are skipped (logged to the console) instead of failing order placement.

`NEXT_PUBLIC_SUPPORT_EMAIL` is the public contact address shown on the Contact, Terms, Privacy, and Cookies pages and on invoices. It's optional — if unset, it falls back to `support@furnitureables.com`.

`NEXT_PUBLIC_GA_MEASUREMENT_ID` is also optional — if unset, all GA tracking code no-ops safely and nothing is sent to Google. See [Analytics](#analytics) below.

### 3. Set up the database

Generate the Prisma client and push/migrate the schema:

```bash
npx prisma generate
npx prisma migrate dev   # or: npx prisma db push
```

> Re-run `npx prisma generate` and apply the schema (`migrate dev` / `db push`) whenever `prisma/schema.prisma` changes, then restart the dev server. Otherwise Prisma throws errors such as `Unknown argument` for new fields.

Optionally seed the database:

```bash
npx tsx prisma/seed.ts
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront. Admin routes are available under `/admin` and require a Clerk user with `publicMetadata.role === "admin"`; sign in at `/admin/sign-in`.

## Available Scripts

| Command                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run dev`           | Start the development server                                         |
| `npm run build`         | Generate the Prisma client and build for production                  |
| `npm run start`         | Start the production server                                          |
| `npm run lint`          | Run ESLint                                                           |
| `npm test`              | Run unit tests with Vitest in watch mode                             |
| `npm run test:run`      | Run all unit tests once                                              |
| `npm run test:coverage` | Run unit tests once with a V8 coverage report                        |
| `npm run test:e2e`      | Run Playwright end-to-end tests                                      |
| `npm run test:e2e:ui`   | Run Playwright in interactive UI mode                                |
| `postinstall`           | Runs automatically after `npm install` to generate the Prisma client |

## Testing

### Unit and component tests (Vitest)

Tests live in `tests/unit/` and mirror the source layout. Vitest runs in a Node environment, resolves the `@/` alias, and loads `vitest.setup.ts` (jest-dom matchers and automatic cleanup). Prisma and external services are mocked, so no database or API keys are needed.

```
tests/unit/
  api/          # Route handlers (Stripe webhook)
  components/   # React Testing Library tests (ProductCard, ShopByCategory, StatusBadges, AppSyncs)
  graphql/      # Resolver tests: cart, order, payment, admin authorization
  helpers/      # Shared test factories (e.g. makeCoupon)
  hooks/        # useDebounce, useHydrated
  lib/          # Cart, coupons, CSV parser, order building/confirmation, validations, utils
    coupon/  csv/  order/  validations/
  store/        # Zustand stores: cart, checkout, coupon, filters
```

```bash
npm run test:run        # run everything once
npm test                # watch mode
npm run test:coverage   # coverage for lib/, store/, hooks/, components/
npx vitest run tests/unit/graphql/order.test.ts   # a single file
```

### End-to-end tests (Playwright)

Tests live in `tests/e2e/` and run against the real UI in two projects: **desktop-chrome** and **mobile-chrome** (Pixel 7). `tests/e2e/helpers/mockStoreApi.ts` mocks the store's API responses, so the specs don't need a seeded database.

- `home.spec.ts` — home page
- `cart.spec.ts` — guest cart flow (quick add, go to cart)

```bash
npx playwright install      # first time only: download browsers
npm run test:e2e            # starts `npm run dev` automatically if nothing is running
npm run test:e2e:ui         # interactive mode
```

Set `E2E_BASE_URL` to test an already-running or deployed site instead of starting a local server. In CI (`CI=true`), the suite builds and starts the app, retries failed tests twice, and writes an HTML report.

## Admin Access

Admin routes (`/admin/*`, except `/admin/sign-in`) are protected by Clerk middleware. To grant a user admin access, set `role: "admin"` in that user's `publicMetadata` in your Clerk dashboard.

## Analytics

Storefront pages (`app/(shop)/**`, including the home page, product listing/detail, cart, checkout, and every page sharing `app/(shop)/layout.tsx`) send data to Google Analytics 4 via [`@next/third-parties`](https://www.npmjs.com/package/@next/third-parties). Admin routes are intentionally excluded.

- **Setup:** set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (format `G-XXXXXXXXXX`) from your GA4 property's Web data stream. Without it, tracking is a no-op.
- **Pageviews:** `components/analytics/GoogleAnalyticsPageTracker.tsx` reports a `page_view` event on every client-side route change (App Router navigations don't trigger a full page load, so this is needed in addition to GA's automatic initial pageview).
- **Custom events:** defined via the `event()` helper in `lib/analytics/gtag.ts`, currently fired for:
  - `select_content` — cart icon click, wishlist icon click, hero CTA clicks
  - `sign_up` — newsletter signup (footer)
  - `view_item_list` — product listing page, whenever the visible result set changes (filter, search, pagination)
- **Verifying locally:** run the dev server with the env var set, open GA4 → Reports → Realtime, and interact with the site — events should appear within seconds.

## Deployment

This app can be deployed to any platform that supports Next.js (e.g. [Vercel](https://vercel.com)). Make sure all environment variables above are configured in your hosting provider, and that your PostgreSQL database and Stripe/Clerk webhook endpoints (`/api/stripe/webhook`, `/api/webhooks/clerk`) are reachable from the deployed URL.
