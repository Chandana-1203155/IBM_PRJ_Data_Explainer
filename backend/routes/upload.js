// Upload Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { uploadLimiter } = require('../middleware/rateLimitMiddleware');

// Upload file endpoint
router.post('/', uploadLimiter, uploadMiddleware.single('file'), uploadController.upload);

module.exports = router;
