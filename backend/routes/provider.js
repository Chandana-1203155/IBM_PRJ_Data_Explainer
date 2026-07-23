// Provider Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const aiProviderService = require('../services/aiProviderService');

// Get provider health status
router.get('/health', async (req, res) => {
    try {
        const health = await aiProviderService.checkProviderHealth();
        res.json({
            success: true,
            health
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get provider statistics
router.get('/stats', (req, res) => {
    try {
        const stats = aiProviderService.getProviderStats();
        const providerStats = aiProviderService.providers.map(p => p.getStats());
        
        res.json({
            success: true,
            serviceStats: stats,
            providerStats
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Switch provider
router.post('/switch', (req, res) => {
    try {
        aiProviderService.switchToNextProvider();
        const currentProvider = aiProviderService.getCurrentProvider();
        
        res.json({
            success: true,
            currentProvider: currentProvider.name
        });
    } catch (error) {
        console.error('Switch provider error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
