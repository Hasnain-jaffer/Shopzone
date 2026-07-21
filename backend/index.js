import dns from 'dns'; // Set DNS servers to Google's public DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnect from './src/config/dbConnection.js';
import productRoutes from "./src/routes/productRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"
import { apiLimiter } from './src/middleware/rateLimiters.js';
import { sanitizeInput } from './src/middleware/sanitizeInput.js';

dotenv.config();

const REQUIRED_VARS = ['CONNECTION_STRING', 'TOKEN_SECRET'];
const missing = REQUIRED_VARS.filter((key) => !process.env[key] || process.env[key].trim() === '');
if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('   Copy backend/.env.example to backend/.env and fill in real values.');
    process.exit(1);
}

dbConnect()

const app = express();

app.use(helmet());

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3001',
    credentials: true, // required so the httpOnly auth cookie is sent/received cross-origin
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Strips any request keys starting with '$' or containing '.' to prevent
// NoSQL (MongoDB operator) injection via req.body/query/params.
app.use(sanitizeInput);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiLimiter);

app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
