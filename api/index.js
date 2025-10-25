import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import ConnectDb from './config/mongodb.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import listingRouter from './routes/listingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ===============================
// 🌐 Middleware Configuration
// ===============================

app.use(cors({
  origin: [
    "https://real-estate-app-gilt.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ===============================
// 🔗 Database Connection
// ===============================
ConnectDb();

// ===============================
// 🧭 API Routes
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "MERN Real Estate API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRoutes);

// ===============================
// ⚠️ Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ===============================
// 🚀 Start Server
// ===============================
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server is running on port ${port}`));
