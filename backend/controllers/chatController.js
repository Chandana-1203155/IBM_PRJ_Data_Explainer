// Chat Controller - AI Data Explainer+

const aiService = require('../services/aiService');
const sessionManager = require('../utils/sessionManager');
const chatHistoryManager = require('../utils/chatHistoryManager');
const constants = require('../config/constants');

class ChatController {
    async chat(req, res) {
        try {
            const { sessionId, question } = req.body;
            console.log('Chat request received', { sessionId, question: question?.slice(0, 120) });

            // Get session data
            const session = sessionManager.getSession(sessionId);
            if (!session) {
                console.warn('Chat request missing session:', sessionId);
                return res.status(404).json({
                    success: false,
                    error: constants.ERRORS.SESSION_NOT_FOUND
                });
            }

            const currentProvider = require('../services/aiProviderService').getCurrentProvider();
            console.log('Chat using provider:', currentProvider?.name);

            // Set up SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

            let fullResponse = '';

            // Stream AI response with fallback
            try {
                await aiService.chatWithDataset(session, question, (chunk) => {
                    if (chunk) {
                        fullResponse += chunk;
                        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
                    }
                });
            } catch (aiError) {
                console.error('AI chat error, using fallback:', aiError);
                // Send fallback response
                fullResponse = this.generateFallbackResponse(session, question);
                res.write(`data: ${JSON.stringify({ type: 'chunk', content: fullResponse })}\n\n`);
            }

            // Send completion signal with the full assembled response
            res.write(`data: ${JSON.stringify({ type: 'done', fullResponse })}\n\n`);
            res.end();
        } catch (error) {
            console.error('Chat error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: error.message || constants.ERRORS.AI_PROVIDER_UNAVAILABLE
                });
            }
        }
    }

    generateFallbackResponse(session, question) {
        const metadata = session.metadata || {};
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes('row') || questionLower.includes('record') || questionLower.includes('count')) {
            return `The dataset contains ${metadata.rows || 'unknown'} rows/records.`;
        } else if (questionLower.includes('column') || questionLower.includes('field')) {
            return `The dataset has ${metadata.columns || 'unknown'} columns: ${(metadata.columnNames || []).slice(0, 5).join(', ')}.`;
        } else {
            return `I apologize, but the AI service is currently unavailable. Your dataset has ${metadata.rows || 'unknown'} rows and ${metadata.columns || 'unknown'} columns. Please check your AI provider configuration.`;
        }
    }

    async getHistory(req, res) {
        try {
            const { sessionId } = req.params;

            const history = chatHistoryManager.getHistory(sessionId);

            res.json({
                success: true,
                history
            });
        } catch (error) {
            console.error('Get chat history error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async clearHistory(req, res) {
        try {
            const { sessionId } = req.params;

            chatHistoryManager.clearHistory(sessionId);

            res.json({
                success: true,
                message: 'Chat history cleared'
            });
        } catch (error) {
            console.error('Clear chat history error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new ChatController();
