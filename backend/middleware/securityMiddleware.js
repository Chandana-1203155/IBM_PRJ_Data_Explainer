// Security Middleware - AI Data Explainer+

// This middleware is integrated via Helmet in app.js
// Additional security measures can be added here

const rateLimit = require('express-rate-limit');

// Rate limiting configuration (optional - can be enabled in production)
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: 'Too many requests, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// API rate limiter
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Upload rate limiter (stricter)
const uploadLimiter = createRateLimiter(60 * 60 * 1000, 10); // 10 uploads per hour

// AI request rate limiter
const aiLimiter = createRateLimiter(60 * 1000, 10); // 10 AI requests per minute

module.exports = {
    apiLimiter,
    uploadLimiter,
    aiLimiter
};
