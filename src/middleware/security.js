import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// ─── Helmet (security headers) ───
export const helmetMiddleware = helmet();

// ─── CORS ───
export const corsMiddleware = () => {
  const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  return cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};

// ─── Global rate limiter: 100 req / 15 min per IP ───
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests' }
});

// ─── Contact endpoint limiter: 5 req / 10 min per IP ───
export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests' }
});

// ─── Slow down on /api/contact: after 2 req, add 1s delay per req ───
export const contactSlowDown = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 2,
  delayMs: (hits) => (hits - 2) * 1000,
});

// ─── Bot protection middleware ───
export const botProtection = (req, res, next) => {
  // Reject missing user-agent
  const userAgent = req.headers['user-agent'];
  if (!userAgent || userAgent.trim().length === 0) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    // Reject invalid content-type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ success: false, error: 'Unsupported media type' });
    }

    // Reject empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, error: 'Empty request body' });
    }

    // Reject suspicious payloads (script tags, SQL injection patterns)
    const bodyStr = JSON.stringify(req.body);
    const suspiciousPatterns = [
      /<script[\s>]/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /;\s*--/,
    ];
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(bodyStr)) {
        return res.status(400).json({ success: false, error: 'Invalid request payload' });
      }
    }
  }

  next();
};

// ─── Global error handler ───
export const globalErrorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'
  });
};
