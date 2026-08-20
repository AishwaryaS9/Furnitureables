# Furnitureables

Furnitureables is a full-stack furniture e-commerce platform built with Next.js. It includes a customer-facing storefront (browsing, cart, wishlist, checkout, orders) and a separate admin dashboard for managing products, orders, customers, reviews, and analytics.

**Live Demo:** https://furnitureables-store.vercel.app/

## Features

**Storefront**

- Product catalog with filtering, search, and category pills
- Product detail pages with reviews and related products
- Cart and wishlist with sync across sessions
- Multi-address checkout with Stripe and Razorpay payment support
- Order history, order details, and downloadable PDF invoices
- AI-powered smart search and chat (Google Gemini)

**Admin Dashboard**

- Product management with CSV bulk upload/export and AI-generated product descriptions
- Order management with status updates and search
- Customer management
- Review moderation
- Analytics dashboard (revenue, category performance, order funnel, ratings, stock vs. sales, and more)

**Platform**

- Authentication and role-based admin access via Clerk
- GraphQL API layer alongside REST API routes
- PostgreSQL database via Prisma ORM
- Media uploads via Vercel Blob

## Tech Stack

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router)                  |
| Language         | TypeScript                                                     |
| UI               | React 19, Tailwind CSS 4, shadcn/ui, Radix/Base UI primitives  |
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

## Project Structure

```
app/
  (shop)/          # Customer-facing storefront routes (products, cart, checkout, orders, wishlist...)
  (admin)/         # Admin dashboard routes (products, orders, customers, reviews, analytics, upload)
  (admin-auth)/    # Admin sign-in route
  api/             # REST API routes (AI, GraphQL, Stripe/Clerk webhooks, media & CSV upload)
components/        # Shared and feature UI components (admin/, product/, cart/, checkout/, orders/, address/, wishlist/, ui/...)
hooks/             # React Query hooks for data fetching and mutations
lib/               # Server/client utilities: auth, cart, coupons, CSV, GraphQL clients, orders, payments, uploads
prisma/            # Prisma schema and seed script
graphql/           # GraphQL schema/type definitions
providers/         # App-level React providers (React Query, etc.)
store/             # Zustand stores
types/             # Shared TypeScript types
```

## Data Model

Defined in `prisma/schema.prisma`, the core models include:

`User`, `Product`, `ProductMedia`, `Cart`, `CartItem`, `Address`, `Order`, `OrderItem`, `Wishlist`, `Review`, `Coupon`

with supporting enums for media type, order status, payment status/method, review status, and discount type.

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- Accounts/API keys for Clerk, Stripe, Razorpay, and Google Gemini (as needed for the features you plan to use)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:

```bash
# Database
DATABASE_URL=

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

# App
NEXT_PUBLIC_APP_URL=
```

### 3. Set up the database

Generate the Prisma client and push/migrate the schema:

```bash
npx prisma generate
npx prisma migrate dev
```

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

| Command         | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start the development server                        |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server                         |
| `npm run lint`  | Run ESLint                                          |

## Admin Access

Admin routes (`/admin/*`, except `/admin/sign-in`) are protected by Clerk middleware. To grant a user admin access, set `role: "admin"` in that user's `publicMetadata` in your Clerk dashboard.

## Deployment

This app can be deployed to any platform that supports Next.js (e.g. [Vercel](https://vercel.com)). Make sure all environment variables above are configured in your hosting provider, and that your PostgreSQL database and Stripe/Clerk webhook endpoints (`/api/stripe/webhook`, `/api/webhooks/clerk`) are reachable from the deployed URL.
