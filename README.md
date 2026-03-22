# MC Perfumery App

A luxury perfume e-commerce app built with Next.js + Tailwind CSS + MongoDB.

## Features

- Home + Shop + Product detail
- Cart management (localStorage)
- Checkout flow with mock payment
- Login/Signup with JWT + MongoDB hashed password
- Admin dashboard for product CRUD (protected by admin token)
- Search + category filter
- Responsive luxury UI (black/gold/white theme)

## Folder structure

- `pages/` - Next.js routes including API endpoints
- `components/` - common UI components
- `lib/` - data utilities, cart helpers and DB connection

## Setup

1. Copy `.env.example` to `.env.local`
2. Set values

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=mc-perfumery-db
JWT_SECRET=somethingverysecret
ADMIN_TOKEN=supersecrettoken
NEXT_PUBLIC_ADMIN_TOKEN=supersecrettoken
```

3. Install dependencies

```
npm install
```

4. Start development server

```
npm run dev
```

5. Seed products

```
curl -X POST http://localhost:3000/api/seed -H "Authorization: Bearer supersecrettoken"
```

## Admin

- Open `/admin`
- Click **Set Admin Token** (sets localStorage token for admin requests)
- Add/remove products

## Notes

- Cart is stored in `localStorage`.
- Checkout is mock; payment is simulated.
- user auth via `/api/auth/login` and `/api/auth/signup`.

## build

```
npm run build
npm run start
```
