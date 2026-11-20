# 🍔 BITEZY — Modern MERN Food Delivery Platform

A full-stack, production-ready food delivery platform built with the MERN stack (MongoDB, Express.js, React 18, Node.js) and Vite. Features a dual-interface architecture: an engaging customer-facing storefront and a real-time executive operations admin dashboard.

---

## 🏗️ Architecture Overview

```text
                                  VERCEL
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  CUSTOMER FRONTEND             ADMIN PORTAL                BACKEND API
  React 18 + Vite               React 18 + Vite             Express 4 + Node.js
  Route: /                      Route: /admin               Route: /api/*
         │                           │                           │
         └───────────────────────────┴─────────────┬─────────────┘
                                                   │
                                            MongoDB Atlas
                                                   │
                                       ┌───────────┴───────────┐
                                       ▼                       ▼
                                Stripe Payments        Cloudinary Storage
                                (Card Checkout)        (Food Image CDN)
```

### Public Routing Structure
- **`/`** &rarr; BITEZY Customer Storefront (Browsing, Cart, Checkout, Order Tracking)
- **`/admin`** &rarr; BITEZY Executive Operations Portal (Inventory, Orders, Metrics, Dispatch)
- **`/api/*`** &rarr; Express REST API (Auth, Food CRUD, Cart, Orders, Healthchecks)
- **`/images/*`** &rarr; Static Dish Images (falls back to persistent cloud CDN when configured)

---

## 📂 Project Structure

```text
mern-food-delivery-app-main/
│
├── vercel.json                 # Unified Vercel Multi-Service Monorepo Configuration
├── .gitignore                  # Global Git ignore rules
├── README.md                   # Project documentation
│
├── frontend/                   # Customer Web Application
│   ├── public/                 # Static assets & SPA fallback (_redirects)
│   ├── src/                    # React components, pages & StoreContext
│   ├── .env.example            # Frontend environment variable template
│   ├── package.json            # React 18, Vite 5, Axios, React Router
│   ├── vercel.json             # Sub-project Vercel config
│   └── vite.config.js          # Vite config (base: '/')
│
├── admin/                      # Operations & Dispatch Admin Portal
│   ├── public/                 # Static assets & SPA fallback (_redirects)
│   ├── src/                    # Admin views (Dashboard, Add, List, Orders, Customers)
│   ├── .env.example            # Admin environment variable template
│   ├── package.json            # React 18, Vite 5, Axios, React Toastify
│   ├── vercel.json             # Sub-project Vercel config
│   └── vite.config.js          # Vite config (base: '/admin/' for unified routing)
│
└── backend/                    # Node.js & Express REST API
    ├── config/                 # MongoDB connection manager (connectDB)
    ├── controllers/            # User, Food, Cart, Order controllers
    ├── middleware/             # JWT auth middleware
    ├── models/                 # Mongoose schemas (User, Food, Order)
    ├── routes/                 # Express route handlers
    ├── uploads/                # Local development image directory
    ├── test_order_tracking.js  # Order lifecycle & state machine test suite
    ├── .env.example            # Backend environment variable template
    ├── package.json            # Express 4, Mongoose 8, JWT, Stripe, Multer
    ├── vercel.json             # Sub-project Vercel serverless config
    └── server.js               # Express application entrypoint (export default app)
```

---

## 🛠️ Technologies Used

- **Frontend & Admin**: React 18, Vite 5, React Router v6, Axios, React Toastify
- **Backend**: Node.js (v18+ / v20+), Express 4, Mongoose 8, Multer, JSON Web Tokens (JWT), Bcrypt, Validator
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Payments**: Stripe Checkout API
- **Deployment**: Vercel (Multi-Service Architecture & Serverless Functions)
- **Styling**: Modern CSS3 custom properties with responsive flexbox/grid

---

## ⚙️ Environment Variables

Copy the provided `.env.example` templates to `.env` in the respective folders:

### 1. Backend (`backend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Local server port | `4000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Strong random string (32+ chars) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or mock fallback) | `sk_test_placeholder` |
| `FRONTEND_URL` | Frontend origin for CORS and checkout redirects | `http://localhost:5173` |
| `ADMIN_URL` | Admin origin for CORS | `http://localhost:5174` |
| `CLOUDINARY_CLOUD_NAME` | *(Optional)* Cloudinary cloud name for persistent images | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | *(Optional)* Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | *(Optional)* Cloudinary API secret | `your_api_secret` |
| `CLOUDINARY_UPLOAD_PRESET`| *(Optional)* Unsigned upload preset | `your_upload_preset` |

### 2. Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Backend URL (leave empty for unified Vercel domain) | `http://localhost:4000` (dev) / `""` (prod) |
| `VITE_ADMIN_URL` | Admin portal URL | `http://localhost:5174` (dev) / `/admin` (prod) |

### 3. Admin (`admin/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Backend URL (leave empty for unified Vercel domain) | `http://localhost:4000` (dev) / `""` (prod) |
| `VITE_BASE_PATH` | Router and asset base path | `/` (dev) / `/admin` (prod) |
| `VITE_FRONTEND_URL` | Link back to live storefront | `http://localhost:5173` (dev) / `/` (prod) |

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/2pavansada/mern_food_delivery.git
cd mern_food_delivery

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dependencies
cd ../admin
npm install
cd ..
```

### 2. Run the Services Locally

Open three terminal windows:

- **Terminal 1 — Backend**:
  ```bash
  cd backend
  npm run server
  # Server starts on http://localhost:4000
  ```

- **Terminal 2 — Customer Frontend**:
  ```bash
  cd frontend
  npm run dev
  # Frontend starts on http://localhost:5173
  ```

- **Terminal 3 — Admin Portal**:
  ```bash
  cd admin
  npm run dev
  # Admin portal starts on http://localhost:5174
  ```

### 3. Run Backend Test Suite

```bash
cd backend
node test_order_tracking.js
```
All 30 unit tests validating order lifecycle states, transition guards, and customer ownership checks should pass.

---

## ☁️ Vercel Deployment Instructions

The repository is configured for **Vercel's Multi-Service Architecture**, allowing all three applications to run under a single Vercel project and domain.

### Option A: Unified Monorepo Deployment (Recommended)

1. **Push repository to GitHub**:
   Ensure all changes are pushed to `https://github.com/2pavansada/mern_food_delivery.git`.
2. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository: `2pavansada/mern_food_delivery`.
   - Leave the **Root Directory** as `./` (the root of the repo).
   - Vercel automatically detects the root `vercel.json` file containing the `frontend`, `admin`, and `backend` services.
3. **Configure Environment Variables in Vercel**:
   Under **Project Settings &rarr; Environment Variables**, add:
   - `MONGODB_URI`: Your production MongoDB Atlas URI
   - `JWT_SECRET`: A secure random secret string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (or `sk_test_placeholder` for mock mode)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: *(Recommended for production uploads)*
4. **Deploy**:
   Click **Deploy**. Vercel will build all services and deploy them with unified routing:
   - `https://your-domain.vercel.app/` &rarr; Frontend
   - `https://your-domain.vercel.app/admin` &rarr; Admin Portal
   - `https://your-domain.vercel.app/api/*` &rarr; Express Backend

### Option B: Separate Vercel Projects

If you prefer deploying each application as an isolated Vercel project:
1. **Backend Project**:
   - Set Root Directory to `backend`.
   - Framework: Other / Node.js.
   - Set environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
2. **Frontend Project**:
   - Set Root Directory to `frontend`.
   - Set `VITE_API_URL` to your backend Vercel URL.
   - Set `VITE_ADMIN_URL` to your admin Vercel URL.
3. **Admin Project**:
   - Set Root Directory to `admin`.
   - Set `VITE_API_URL` to your backend Vercel URL.
   - Set `VITE_BASE_PATH` to `/`.
   - Set `VITE_FRONTEND_URL` to your frontend Vercel URL.

---

## 🛡️ Key Fixes & Enhancements Implemented

1. **Security & Credentials**:
   - Removed all hardcoded MongoDB Atlas credentials.
   - Safe `.env.example` templates created for backend, frontend, and admin.
   - Secured root and sub-project `.gitignore` rules to guarantee secrets are never committed.
2. **Dynamic API & CORS Resolution**:
   - Replaced all hardcoded `http://localhost:4000` URLs across the frontend and admin codebases with environment-driven variables.
   - Implemented dynamic CORS supporting local development, deployed Vercel domains, and preview URLs.
3. **Serverless Architecture Compatibility**:
   - Refactored `backend/server.js` to export the Express application as `export default app` for Vercel Serverless execution.
   - Added database connection caching to avoid opening multiple Mongoose connections across cold starts.
   - Added `/api/health` monitoring endpoint.
4. **Subpath Admin Routing**:
   - Configured Vite `base` and React Router `basename` in `admin` so the management portal operates cleanly under `/admin` without colliding with storefront assets.
   - Created `_redirects` and rewrite rules for Single Page Application deep link refreshes.
5. **Persistent Image Storage Support**:
   - Added Cloudinary cloud storage upload handler using native `fetch` (zero additional npm dependencies).
   - Created safe fallback for local disk and serverless `/tmp` storage.
6. **Order & Payment Resilience**:
   - Dynamic frontend redirect resolution for Stripe checkout (`success_url` and `cancel_url`).
   - Mock payment gateway fallback when Stripe keys are unconfigured.

---

## 📄 License & Attribution

Developed for **BITEZY**. Built with React, Vite, Express, and MongoDB.
Repository: [https://github.com/2pavansada/mern_food_delivery](https://github.com/2pavansada/mern_food_delivery)
