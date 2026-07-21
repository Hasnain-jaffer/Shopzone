# 🛒 Shopzone

A full-stack e-commerce web app built with the **MERN stack** (MongoDB, Express, React, Node.js) — custom JWT authentication, an admin product dashboard, a shopping cart, and a hardened Express API.

## ✨ Features

- 🔐 **Custom JWT Authentication** — signup/login/logout with an httpOnly cookie (or Bearer header), role-based access (`user` / `admin`), and no third-party auth library
- 🛍️ **Product Catalog** — browse all products, view a single product's details
- 🛠️ **Admin Dashboard** — admin-only routes to add, update, and delete products, plus user management (list users, change roles, delete users)
- 🛒 **Shopping Cart** — add, update, and remove items with live cart state on the client
- 🧾 **Input Validation & Sanitization** — `express-validator` request validation, NoSQL-injection sanitization middleware, and rate limiting on auth/API routes
- 🛡️ **Security Headers** — `helmet`, `cors` with a configurable allowed origin, and bcrypt-hashed passwords
- 🎨 **Responsive UI** — React 19 + React Router + Tailwind CSS

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM v7
- Tailwind CSS v4
- Axios
- React Context API (auth state)

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- `helmet`, `cors`, `express-rate-limit`, `express-validator` for security/validation

## 📁 Project Structure

```
Shopzone/
├── backend/
│   ├── index.js                      # App entry point, middleware & route wiring
│   └── src/
│       ├── config/dbConnection.js    # MongoDB connection
│       ├── controllers/              # authController, productController
│       ├── middleware/               # auth, rate limiting, input sanitization, validation
│       ├── models/                   # User, Product (Mongoose schemas)
│       ├── routes/                   # /api/auth, /api/products
│       ├── validators/               # request-body validation rules
│       └── seedAdmin.js              # script to seed an initial admin user
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── components/               # Navbar, Footer, Logo, AdminRoute, ui/
        ├── context/AuthContext.jsx   # auth state provider
        └── pages/                    # Home, ProductListing, ProductDetail, Cart, Login, Register, Admin
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone https://github.com/Hasnain-jaffer/Shopzone.git
cd Shopzone
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
CONNECTION_STRING=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
PORT=5001
ALLOWED_ORIGIN=http://localhost:3001
```

> `CONNECTION_STRING` and `TOKEN_SECRET` are required — the server exits on startup if either is missing.

Run the server:

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start
```

Optionally seed an admin user:

```bash
npm run seed:admin
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will print the local URL (default `http://localhost:5173`).

## 📡 API Overview

**Auth** — `/api/auth`
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/register` | Create a new account | Public |
| POST | `/login` | Log in, sets auth cookie | Public |
| POST | `/logout` | Clear auth cookie | Public |
| GET | `/me` | Get the current user | Authenticated |
| GET | `/users` | List all users | Admin |
| PATCH | `/users/:id/role` | Update a user's role | Admin |
| DELETE | `/users/:id` | Delete a user | Admin |

**Products** — `/api/products`
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/` | List all products | Public |
| GET | `/:id` | Get a single product | Public |
| POST | `/` | Create a product | Admin |
| PUT | `/:id` | Update a product | Admin |
| DELETE | `/:id` | Delete a product | Admin |

There's also a `GET /health` endpoint for a basic uptime check.

## 🔑 Notes on the design

- Auth uses a signed JWT stored in an httpOnly cookie (falls back to a Bearer token), so the frontend never touches the raw token.
- All write routes for products and user management are gated behind `isAuthenticated` + `isAdmin` middleware.
- Request bodies are sanitized to strip `$`-prefixed or dotted keys before they reach Mongoose, to block NoSQL injection.
- Auth and general API routes are rate-limited separately to slow down brute-force attempts.

## 📬 Contact

Built by **Hasnain Jaffer**
📧 hasnainkaimi10@gmail.com
💬 Open to freelance projects & full-time roles as a Full Stack MERN Developer
