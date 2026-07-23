// Report Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const validationMiddleware = require('../middleware/validationMiddleware');

// Generate report endpoint
router.post('/', validationMiddleware.validateSessionId, reportController.generate);

module.exports = router;
