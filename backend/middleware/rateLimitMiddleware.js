// Rate Limiting Middleware - AI Data Explainer+

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Upload rate limiter (stricter)
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: {
        success: false,
        error: 'Upload limit exceeded. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// AI request rate limiter
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 AI requests per minute
    message: {
        success: false,
        error: 'AI request limit exceeded. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Chat rate limiter
const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 chat messages per minute
    message: {
        success: false,
        error: 'Chat limit exceeded. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    uploadLimiter,
    aiLimiter,
    chatLimiter
};
