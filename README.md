# FreshBulk App

## Project Description

A modern bulk ordering platform for fresh Vegetables & Fruits, designed to streamline the ordering experience for customers and vendors alike. Built with Next.js and TypeScript for a fast and scalable frontend, it integrates Clerk Authentication for secure user access and Redux for efficient state management of product data and orders.

### The platform allows users to:

- Browse and order fresh produce in bulk
- Track orders in real-time
- Manage user sessions securely
- Experience responsive design across devices

Users can:

- Browse products
- Place orders
- Track orders with live status updates
- Cancel pending orders

Admins can:

- Manage products
- Manage orders

## ✨ Features

- ✅ Authentication using Clerk
- ✅ Product catalogue (with Redux state)
- ✅ Order placement form
- ✅ Order status tracking
- ✅ Order cancelation (only if status is "pending")
- ✅ Persistent user data with localStorage fallback

## 🧰 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Clerk Auth**
- **Redux Toolkit**
- **Axios**
- **SQLite or PostgreSQL (via Prisma)**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PranayKallepu/FreshBulk-App.git
cd freshbulk-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory with the following variables:

```bash
DATABASE_URL="file:./dev.db"  # SQLite for local dev, or your PostgreSQL connection string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= #your_clerk_publishable_key
CLERK_SECRET_KEY= #your_clerk_secret_key


```

### 4. Set up the database

Using Prisma:

```bash
#dependencies
npm i prisma --save-dev
npm install @prisma/client
#init
npx prisma init --datasource-provider postgresql
# add models
npx prisma migrate dev --name init
#create db url in .env
```

If you're using PostgreSQL, update the DATABASE_URL in .env accordingly.

### 5. Run development server

```bash
npm run dev
```

## 🛠 API Endpoints

```http
<!-- products API Endpoints -->
1. GET     /api/products         // Fetch all products
2. POST    /api/products         // Create a new product for admins
3. PUT     /api/products/:id     // Update a product for admins
4. DELETE  /api/products/:id     // Delete a product for admins

<!-- orders API Endpoints -->
5. GET     /api/orders         // Fetch all orders for admins
6. GET     /api/orders/:id     // Fetch a specific order
7. POST    /api/orders         // Create a new order
8. PUT  /api/orders/:id     // update status of specific order for admins

```

## 📝 Notes

Auth is handled via Clerk, so make sure to configure your Clerk Project.

- site: https://dashboard.clerk.dev

Orders are filtered by user’s username or a localStorage fallback

Only orders with status === "pending" can be cancelled

## 📁 Folder Structure

```bash
/app
  /api/orders         # API routes for orders
  /api/products         # API routes for products
  /admin              # Admin dashboard
  /orders             # Order Tracking via ID & Display status
  /products           # Product Catalogue
/components         # UI components (Navbar, OrderForm, Footer, etc.)
/store              # Redux store for product management
/lib                # Utility functions (prisma)
/prisma             # Prisma schema(database)
middleware.ts       # Clerk middleware for authentication
```
