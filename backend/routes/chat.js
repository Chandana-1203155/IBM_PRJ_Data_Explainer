// Chat Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const validationMiddleware = require('../middleware/validationMiddleware');
const { chatLimiter } = require('../middleware/rateLimitMiddleware');

// Chat endpoint (streaming)
router.post('/', chatLimiter, validationMiddleware.validateChatRequest, chatController.chat);

// Get chat history
router.get('/history/:sessionId', chatLimiter, chatController.getHistory);

// Clear chat history
router.delete('/history/:sessionId', chatController.clearHistory);

module.exports = router;
