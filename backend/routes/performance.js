// Performance Monitoring Routes - AI Data Explainer+

const express = require('express');
const router = express.Router();
const performanceMonitor = require('../utils/performanceMonitor');

// Get performance metrics
router.get('/metrics', (req, res) => {
    try {
        const endpoint = req.query.endpoint;
        const metrics = performanceMonitor.getMetrics(endpoint);
        
        res.json({
            success: true,
            metrics
        });
    } catch (error) {
        console.error('Performance metrics error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get system metrics
router.get('/system', (req, res) => {
    try {
        const systemMetrics = performanceMonitor.getSystemMetrics();
        
        res.json({
            success: true,
            systemMetrics
        });
    } catch (error) {
        console.error('System metrics error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get performance alerts
router.get('/alerts', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const alerts = performanceMonitor.getAlerts(limit);
        
        res.json({
            success: true,
            alerts
        });
    } catch (error) {
        console.error('Performance alerts error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Clear alerts
router.delete('/alerts', (req, res) => {
    try {
        performanceMonitor.clearAlerts();
        
        res.json({
            success: true,
            message: 'Alerts cleared'
        });
    } catch (error) {
        console.error('Clear alerts error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Reset metrics
router.delete('/metrics', (req, res) => {
    try {
        const endpoint = req.query.endpoint;
        performanceMonitor.resetMetrics(endpoint);
        
        res.json({
            success: true,
            message: 'Metrics reset'
        });
    } catch (error) {
        console.error('Reset metrics error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
