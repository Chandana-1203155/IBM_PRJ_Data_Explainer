// Analysis Controller - AI Data Explainer+

const analysisService = require('../services/analysisService');
const sessionManager = require('../utils/sessionManager');
const constants = require('../config/constants');

class AnalyzeController {
    async analyze(req, res) {
        try {
            const { sessionId } = req.body;

            // Get session data
            const session = sessionManager.getSession(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: constants.ERRORS.SESSION_NOT_FOUND
                });
            }

            // Perform analysis
            const dataset = session.data ? { data: session.data, metadata: session.metadata } : session.dataset;
            const analysis = await analysisService.analyzeDataset(dataset);

            // Update session with analysis results
            session.analysis = analysis;
            sessionManager.updateSession(sessionId, session);

            res.json({
                success: true,
                data: analysis
            });
        } catch (error) {
            console.error('Analysis error:', error);
            res.status(500).json({
                success: false,
                error: error.message || constants.ERRORS.ANALYSIS_FAILED
            });
        }
    }
}

module.exports = new AnalyzeController();
