# 🛒 Shopzone — Full Stack E-Commerce App

A full-stack e-commerce platform built with the **MERN stack**, featuring custom JWT authentication, real-time cart management, and order processing.

![JavaScript](https://img.shields.io/badge/JavaScript-99.7%25-yellow)
![MERN](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- 🔐 **Custom JWT Authentication** — Secure signup/login with protected routes and token-based session handling, built without third-party auth libraries
- 🛍️ **Product Catalog** — Browse and view product listings
- 🛒 **Shopping Cart** — Add, update, and remove items with real-time cart state
- 📦 **Order Management** — Place orders and track order history, backed by MongoDB
- 🎨 **Responsive UI** — Built with React for a clean, mobile-friendly experience

---

## 🛠️ Tech Stack

**Frontend**
- React
- React Router
- Context API (state management)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- bcrypt for password hashing

> ℹ️ If your frontend uses Redux instead of Context API, update this section accordingly.

---

## 📁 Project Structure

```
Shopzone/
├── backend/                              # Express + MongoDB API
│   ├── routes/                           # Auth, product, cart, order routes
│   ├── models/                           # Mongoose schemas
│   └── middleware/                       # JWT auth middleware
└── frontend/
    └── ecommerce-fullstack-design/       # React client
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- MongoDB running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the repository

```bash
git clone https://github.com/Hasnain-jaffer/Shopzone.git
cd Shopzone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend/ecommerce-fullstack-design
npm install
npm start
```

The app should now be running at `http://localhost:3000`, connecting to the API at `http://localhost:5000`.

---

## 🔑 What I Focused On

The hardest part of this project wasn't the UI — it was getting **auth, cart, and order logic** to stay consistent: handling token expiry mid-session, keeping cart state accurate as stock changes, and structuring the backend so each piece (auth, products, orders) stays cleanly separated and easy to extend.

---

## 🗺️ Roadmap

- [ ] Payment gateway integration
- [ ] Admin dashboard for product/order management
- [ ] Product search and filtering
- [ ] Wishlist functionality
- [ ] Unit and integration tests

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or submit an issue.

---

## 📬 Contact

Built by **Hasnain Jaffer**
📧 hasnainkaimi10@gmail.com
💬 Open to freelance projects & full-time roles as a Full Stack MERN Developer
