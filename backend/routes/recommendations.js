// Recommendations Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');
const validationMiddleware = require('../middleware/validationMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

// Generate recommendations endpoint
router.post('/', aiLimiter, validationMiddleware.validateSessionId, recommendationsController.generate);

module.exports = router;
