import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration - applied FIRST
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Global preflight handler
app.options('*', cors(corsOptions));

// Body parsers - applied AFTER CORS
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Import routes AFTER CORS setup
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Set charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Routes - applied AFTER all middleware
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Error handling middleware - applied LAST
app.use(notFound);
app.use(errorHandler);

export default app;
