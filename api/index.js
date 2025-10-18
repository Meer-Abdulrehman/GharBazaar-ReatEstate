// ===============================
// 📦 Server.js (Main Entry Point)
// ===============================

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 🧩 Import custom modules
import ConnectDb from './config/mongodb.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import listingRouter from './routes/listingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// 🗂️ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Load environment variables
dotenv.config();

// 🚀 Initialize Express App
const app = express();

// ===============================
// 🌐 Middleware Configuration
// ===============================

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "https://real-estate-app-gilt.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ===============================
// 🔗 Database Connection
// ===============================
ConnectDb();

// ===============================
// 🧭 API Routes
// ===============================

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "MERN Real Estate API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Main API routes
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
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
