// Logger Middleware - AI Data Explainer+

const performanceMonitor = require('../utils/performanceMonitor');

const logger = (req, res, next) => {
    const start = Date.now();
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const success = res.statusCode < 400;
        
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        
        // Record performance metrics
        performanceMonitor.recordRequest(req.path, duration, success);
    });
    
    next();
};

module.exports = logger;
