// Insights Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const validationMiddleware = require('../middleware/validationMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

// Generate insights endpoint
router.post('/', aiLimiter, validationMiddleware.validateSessionId, insightsController.generate);

module.exports = router;
