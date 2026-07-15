# 🛒 Full Stack E-Commerce App

A full stack e-commerce platform built with the **MERN stack**, featuring custom JWT authentication, real-time cart management, and order processing.

## ✨ Features

- 🔐 **Custom JWT Authentication** — Secure signup/login with protected routes and token-based session handling (built without third-party auth libraries)
- 🛍️ **Product Catalog** — Browse and view product listings
- 🛒 **Shopping Cart** — Add, update, and remove items with real-time cart state
- 📦 **Order Management** — Place orders and track order history backed by MongoDB
- 🎨 **Responsive UI** — Built with React for a clean, mobile-friendly experience

## 🛠️ Tech Stack

**Frontend**
- React
- (add: React Router / Context API / Redux — whichever you used)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication

## 📁 Project Structure

```
ecommerce-fullstack-design/
├── backend/                              # Express + MongoDB API
│   ├── routes/                           # Auth, product, cart, order routes
│   ├── models/                           # Mongoose schemas
│   └── middleware/                       # JWT auth middleware
└── frontend/
    └── ecommerce-fullstack-design/       # React client
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend/ecommerce-fullstack-design
npm install
npm start
```

### Environment Variables
Create a `.env` file in the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🔑 What I Focused On

The hardest part of this project wasn't the UI — it was getting **auth, cart, and order logic** to stay consistent: handling token expiry mid-session, keeping cart state accurate as stock changes, and structuring the backend so each piece (auth, products, orders) stays cleanly separated and easy to extend.

## 📬 Contact

Built by **Hasnain Jaffer**
📧 hasnainkaimi10@gmail.com
💬 Open to freelance projects & full-time roles as a Full Stack MERN Developer
