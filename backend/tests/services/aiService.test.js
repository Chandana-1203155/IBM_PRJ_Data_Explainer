// AI Service Tests - AI Data Explainer+

const aiService = require('../../services/aiService');
const insightsController = require('../../controllers/insightsController');
const sessionManager = require('../../utils/sessionManager');

describe('AIService', () => {
    test('should build insights prompt correctly', () => {
        const mockSession = {
            filename: 'test.csv',
            metadata: {
                rows: 100,
                columns: 5,
                columnNames: ['name', 'age', 'score'],
                columnTypes: { name: 'categorical', age: 'numeric', score: 'numeric' }
            },
            preview: [{ name: 'John', age: 25, score: 95 }],
            analysis: {
                statistics: {
                    numeric: {
                        age: { mean: 25, median: 25, mode: 25, min: 20, max: 30, std: 3 }
                    }
                }
            }
        };

        const prompt = aiService.buildInsightsPrompt(mockSession);
        expect(prompt).toContain('business analyst');
        expect(prompt).toContain(mockSession.filename);
        expect(prompt).toContain('EXECUTIVE SUMMARY');
    });

    test('should build chat prompt correctly', () => {
        const mockSession = {
            filename: 'test.csv',
            metadata: {
                columnNames: ['name', 'age'],
                columnTypes: { name: 'categorical', age: 'numeric' }
            },
            preview: [{ name: 'John', age: 25 }],
            analysis: null
        };

        const prompt = aiService.buildChatPrompt(mockSession, 'What is the average age?');
        expect(prompt).toContain('What is the average age?');
        expect(prompt).toContain('name');
        expect(prompt).toContain('age');
    });

    test('should return fallback insights when AI generation fails', async () => {
        const mockSession = {
            sessionId: 'test-session',
            filename: 'test.csv',
            metadata: {
                rows: 10,
                columns: 3,
                columnNames: ['name', 'age'],
                columnTypes: { name: 'categorical', age: 'numeric' }
            },
            preview: [{ name: 'John', age: 25 }],
            analysis: { statistics: {} }
        };

        sessionManager.createSession(mockSession.sessionId, mockSession);

        const originalGenerateInsights = aiService.generateInsights;
        aiService.generateInsights = jest.fn().mockRejectedValue(new Error('AI failed'));

        const fallbackInsights = insightsController.generateFallbackInsights(mockSession);
        expect(fallbackInsights.executiveSummary).toContain('10');
        expect(fallbackInsights.keyFindings).toHaveLength(3);

        aiService.generateInsights = originalGenerateInsights;
    });
});
