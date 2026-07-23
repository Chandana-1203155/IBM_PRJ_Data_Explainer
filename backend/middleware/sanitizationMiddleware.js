// Input Sanitization Middleware - AI Data Explainer+

const xss = require('xss');

class SanitizationMiddleware {
    static sanitizeString(input) {
        if (typeof input !== 'string') return input;
        return xss(input, {
            whiteList: {}, // No HTML tags allowed
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });
    }

    static sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        
        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    sanitized[key] = this.sanitizeString(obj[key]);
                } else if (Array.isArray(obj[key])) {
                    sanitized[key] = obj[key].map(item => 
                        typeof item === 'string' ? this.sanitizeString(item) : item
                    );
                } else if (typeof obj[key] === 'object') {
                    sanitized[key] = SanitizationMiddleware.sanitizeObject(obj[key]);
                } else {
                    sanitized[key] = obj[key];
                }
            }
        }
        return sanitized;
    }

    static sanitizeBody(req, res, next) {
        if (req.body) {
            req.body = SanitizationMiddleware.sanitizeObject(req.body);
        }
        next();
    }

    static sanitizeQuery(req, res, next) {
        if (req.query) {
            req.query = SanitizationMiddleware.sanitizeObject(req.query);
        }
        next();
    }

    static sanitizeParams(req, res, next) {
        if (req.params) {
            req.params = SanitizationMiddleware.sanitizeObject(req.params);
        }
        next();
    }
}

module.exports = SanitizationMiddleware;
