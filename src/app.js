import express from 'express';
import contactRoutes from './routes/contact.js';
import {
  helmetMiddleware,
  corsMiddleware,
  globalLimiter,
  globalErrorHandler
} from './middleware/security.js';

const app = express();

// Trust proxy (required for Railway / reverse proxies)
app.set('trust proxy', 1);

// Hide x-powered-by
app.disable('x-powered-by');

// Security headers
app.use(helmetMiddleware);

// CORS
app.use(corsMiddleware());

// Global rate limiter
app.use(globalLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Email engine is running',
    timestamp: new Date().toISOString()
  });
});

// Support legacy and proxy setups that hit either /api/contact or /contact
app.use(['/api/', '/'], contactRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;
