// Routes Aggregator - AI Data Explainer+

const express = require('express');
const router = express.Router();

// Import routes
const uploadRoutes = require('./upload');
const analyzeRoutes = require('./analyze');
const insightsRoutes = require('./insights');
const chatRoutes = require('./chat');
const recommendationsRoutes = require('./recommendations');
const reportRoutes = require('./report');
const providerRoutes = require('./provider');
const performanceRoutes = require('./performance');

// Mount routes
router.use('/upload', uploadRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/insights', insightsRoutes);
router.use('/chat', chatRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/report', reportRoutes);
router.use('/provider', providerRoutes);
router.use('/performance', performanceRoutes);

module.exports = router;
