// Validation Middleware - AI Data Explainer+

const { body, validationResult } = require('express-validator');

// Validate session ID
const validateSessionId = [
    body('sessionId')
        .notEmpty()
        .withMessage('Session ID is required')
        .isString()
        .withMessage('Session ID must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        next();
    }
];

// Validate chat request
const validateChatRequest = [
    body('sessionId')
        .notEmpty()
        .withMessage('Session ID is required')
        .isString()
        .withMessage('Session ID must be a string'),
    body('question')
        .notEmpty()
        .withMessage('Question is required')
        .isString()
        .withMessage('Question must be a string')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Question must be between 1 and 1000 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        next();
    }
];

module.exports = {
    validateSessionId,
    validateChatRequest
};
