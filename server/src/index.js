// Entry point: boot Express, connect to MongoDB, mount routes.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import examRoutes from './routes/exam.routes.js';
import questionRoutes from './routes/question.routes.js';
import attemptRoutes from './routes/attempt.routes.js';

const app = express();

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Root Route
app.get('/', (_, res) => {
  res.send('Backend Running Successfully');
});

// Health Route
app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);

// 404 Middleware
app.use(notFound);

// Error Middleware
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB connected`);
      console.log(`API listening on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });