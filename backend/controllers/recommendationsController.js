// Recommendations Controller - AI Data Explainer+

const aiService = require('../services/aiService');
const sessionManager = require('../utils/sessionManager');
const constants = require('../config/constants');

class RecommendationsController {
    async generate(req, res) {
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

            // Set up SSE for progressive streaming
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');

            let connectionClosed = false;
            req.on('close', () => { connectionClosed = true; });

            // Generate AI recommendations with streaming and fallback
            let recommendations;
            try {
                recommendations = await aiService.streamRecommendations(session, (chunk) => {
                    if (!connectionClosed && chunk) {
                        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
                    }
                });
            } catch (aiError) {
                console.error('AI recommendations error, using fallback:', aiError);
                recommendations = aiService.generateFallbackRecommendations(session);
            }

            // Update session with recommendations
            session.recommendations = recommendations;
            sessionManager.updateSession(sessionId, session);

            if (!connectionClosed) {
                res.write(`data: ${JSON.stringify({ type: 'done', data: recommendations })}\n\n`);
                res.end();
            }
        } catch (error) {
            console.error('Recommendations generation error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: error.message || constants.ERRORS.AI_PROVIDER_UNAVAILABLE
                });
            }
        }
    }

    generateFallbackRecommendations(session) {
        return aiService.generateFallbackRecommendations(session);
    }
}

module.exports = new RecommendationsController();
