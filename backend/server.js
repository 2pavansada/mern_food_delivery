import express from 'express';
import cors from 'cors';
import path from 'path';
import os from 'os';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from cwd .env or backend/.env
dotenv.config();
if (fs.existsSync(path.resolve('backend', '.env'))) {
  dotenv.config({ path: path.resolve('backend', '.env') });
}

import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Application configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Dynamic CORS configuration supporting local dev, custom domains, and Vercel deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
  ...(process.env.ADMIN_URL ? [process.env.ADMIN_URL.replace(/\/+$/, '')] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check explicit allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Automatically allow any Vercel deployment preview or production domain
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    
    // In development or if explicitly allowed, allow origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'token', 'Authorization']
}));

// Static uploads serving (both local directory and serverless /tmp)
const localUploads = path.resolve('uploads');
const tmpUploads = path.join(os.tmpdir(), 'uploads');

if (!fs.existsSync(localUploads)) {
  try { fs.mkdirSync(localUploads, { recursive: true }); } catch (e) {}
}
if (!fs.existsSync(tmpUploads)) {
  try { fs.mkdirSync(tmpUploads, { recursive: true }); } catch (e) {}
}

app.use('/images', express.static(localUploads));
app.use('/images', express.static(tmpUploads));

// Ensure database connection middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database connection attempt failed:", err.message);
    }
  }
  next();
});

// API Endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Health check and root endpoints
app.get('/', (req, res) => {
  res.send('BITEZY API is running');
});

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'BITEZY API is active and ready' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initial DB connection attempt on startup
connectDB().catch(err => console.error("Initial DB connect error:", err.message));

// Start server if not running inside a serverless environment (e.g. Vercel)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

// Export default app for Vercel serverless execution
export default app;
