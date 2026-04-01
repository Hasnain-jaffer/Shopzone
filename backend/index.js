import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './src/config/dbConnection.js';
import productRoutes from "./src/routes/productRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"
import { isAuthenticated } from "./src/middleware/authMiddleware.js"

dotenv.config();
dbConnect()

const app = express();

const corsOptions = {
    origin: ['http://localhost:3001'],
    credentials: true,
};

app.use(cors(corsOptions));     
app.use(express.json());

app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)


const PORT = process.env.PORT || 5002;  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
