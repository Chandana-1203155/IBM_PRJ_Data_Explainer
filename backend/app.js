// Express App Configuration - AI Data Explainer+

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { apiLimiter, uploadLimiter, aiLimiter, chatLimiter } = require('./middleware/rateLimitMiddleware');
const SanitizationMiddleware = require('./middleware/sanitizationMiddleware');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
    origin: env.corsOrigin,
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(logger);

// Input sanitization
app.use(SanitizationMiddleware.sanitizeBody);
app.use(SanitizationMiddleware.sanitizeQuery);
app.use(SanitizationMiddleware.sanitizeParams);

// Rate limiting
app.use('/api/upload', uploadLimiter);
app.use('/api/insights', aiLimiter);
app.use('/api/recommendations', aiLimiter);
app.use('/api/chat', chatLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api', routes);

// Serve generated reports as static files
const reportDir = path.resolve(env.reportDir);
app.use('/reports', express.static(reportDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env.nodeEnv,
        aiProvider: env.aiProvider
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

module.exports = app;
