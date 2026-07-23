// Analysis Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const validationMiddleware = require('../middleware/validationMiddleware');

// Analyze dataset endpoint
router.post('/', validationMiddleware.validateSessionId, analyzeController.analyze);

module.exports = router;
