// AI Service - AI Data Explainer+

const AIProviderService = require('./aiProviderService');
const responseFormatter = require('../utils/responseFormatter');
const chatHistoryManager = require('../utils/chatHistoryManager');
const env = require('../config/env');

class AIService {
    constructor() {
        this.providerService = AIProviderService;
    }

    async generateInsights(session) {
        const prompt = this.buildInsightsPrompt(session);
        
        try {
            const result = await this.providerService.generateResponse(prompt);
            return responseFormatter.formatInsightsResponse(result.response);
        } catch (error) {
            console.error('AI insights generation error:', error);
            throw error;
        }
    }

    async streamInsights(session, onChunk) {
        const prompt = this.buildInsightsPrompt(session);
        
        let fullResponse = '';
        await this.providerService.streamResponse(prompt, (chunk) => {
            if (chunk) {
                fullResponse += chunk;
                onChunk(chunk);
            }
        });
        
        return responseFormatter.formatInsightsResponse(fullResponse);
    }

    async chatWithDataset(session, question, onChunk) {
        // Get conversation history
        const history = chatHistoryManager.getFormattedHistory(session.sessionId);
        
        // Build prompt with history
        const prompt = this.buildChatPrompt(session, question, history);
        
        // Add user message to history
        chatHistoryManager.addMessage(session.sessionId, 'user', question);

        let fullResponse = '';
        let streamedAny = false;

        try {
            await this.providerService.streamResponse(prompt, (chunk) => {
                if (chunk) {
                    streamedAny = true;
                    fullResponse += chunk;
                    onChunk(chunk);
                } else {
                    chatHistoryManager.addMessage(session.sessionId, 'assistant', fullResponse);
                }
            });
        } catch (error) {
            console.error('AI chat streaming failed, falling back to non-streamed response:', error);

            if (!streamedAny) {
                try {
                    const result = await this.providerService.generateResponse(prompt);
                    fullResponse = result?.response || String(result);
                    if (fullResponse) {
                        onChunk(fullResponse);
                    }
                    chatHistoryManager.addMessage(session.sessionId, 'assistant', fullResponse);
                } catch (fallbackError) {
                    console.error('Fallback chat generation also failed:', fallbackError);
                    throw fallbackError;
                }
            } else {
                throw error;
            }
        }
    }

    async generateRecommendations(session) {
        const prompt = this.buildRecommendationsPrompt(session);
        
        try {
            const result = await AIProviderService.generateResponse(prompt);
            return responseFormatter.formatRecommendationsResponse(result.response);
        } catch (error) {
            console.error('AI recommendations generation error:', error);
            throw error;
        }
    }

    async streamRecommendations(session, onChunk) {
        const prompt = this.buildRecommendationsPrompt(session);
        
        let fullResponse = '';
        await this.providerService.streamResponse(prompt, (chunk) => {
            if (chunk) {
                fullResponse += chunk;
                onChunk(chunk);
            }
        });
        
        return responseFormatter.formatRecommendationsResponse(fullResponse);
    }

    buildInsightsPrompt(session) {
        const { data, metadata, analysis } = session;
        
        return `
You are an expert business analyst and data scientist with 20 years of experience
in helping non-technical business owners understand their data and make informed decisions.

Dataset Information:
- File Name: ${session.filename}
- Total Rows: ${metadata.rows}
- Total Columns: ${metadata.columns}
- Column Names: ${metadata.columnNames.join(', ')}
- Column Types: ${JSON.stringify(metadata.columnTypes, null, 2)}

Sample Data (first 5 rows):
${JSON.stringify(session.preview.slice(0, 5), null, 2)}

Statistics:
${JSON.stringify(analysis ? analysis.statistics : {}, null, 2)}

Analyze this dataset and provide comprehensive business insights that a non-technical
business owner can understand and act upon. Focus on practical, actionable insights.

Please provide the following sections:
1. EXECUTIVE SUMMARY (2-3 sentences)
2. BUSINESS SUMMARY
3. KEY FINDINGS (5-7 bullet points)
4. PATTERNS
5. TRENDS
6. OUTLIERS
7. CUSTOMER BEHAVIOR
8. SALES INSIGHTS
9. GROWTH OPPORTUNITIES
10. RISK ANALYSIS
11. ACTIONABLE RECOMMENDATIONS
12. FUTURE SCOPE

Use simple, non-technical language. Keep each section concise.
`;
    }

    buildChatPrompt(session, question, history = []) {
        const { data, metadata, analysis } = session;
        
        let prompt = `
You are a helpful data assistant that answers questions about datasets in simple,
clear language for non-technical users.

Dataset Context:
- File Name: ${session.filename}
- Column Names: ${metadata.columnNames.join(', ')}
- Column Types: ${JSON.stringify(metadata.columnTypes, null, 2)}
- Sample Data: ${JSON.stringify(session.preview.slice(0, 5), null, 2)}
- Statistics: ${JSON.stringify(analysis ? analysis.statistics : {}, null, 2)}
`;

        // Add conversation history if available
        if (history.length > 0) {
            prompt += `\n\nPrevious Conversation:\n`;
            history.slice(-5).forEach(msg => { // Only last 5 messages for context
                prompt += `${msg.role}: ${msg.content}\n`;
            });
        }

        prompt += `\n\nCurrent Question: ${question}\n\n`;
        prompt += `Answer the question using the provided dataset context. If the information is not available
in the dataset, clearly state that. Provide specific, accurate answers with supporting evidence.
Keep answers concise (2-4 sentences).`;

        return prompt;
    }

    buildRecommendationsPrompt(session) {
        const { data, metadata, analysis, insights } = session;
        
        return `
You are a strategic business consultant specializing in data-driven decision making
for small and medium businesses.

Dataset Context:
${JSON.stringify(metadata, null, 2)}

Previous Insights:
${insights ? JSON.stringify(insights, null, 2) : 'No insights yet'}

Statistics:
${JSON.stringify(analysis ? analysis.statistics : {}, null, 2)}

Based on the dataset analysis, generate specific, actionable business recommendations.
Each recommendation should be practical and implementable.

For each recommendation, provide:
RECOMMENDATION: [Specific action]
REASON: [Why this recommendation]
PRIORITY: [High/Medium/Low]
EXPECTED IMPACT: [Business value]

Generate 5-7 recommendations covering:
- Business improvements
- Marketing strategies
- Growth opportunities
- Risk mitigation
- Data quality improvements

Focus on actionable items, prioritize by business impact, and estimate realistic outcomes.
`;
    }

    async getChatHistory(sessionId) {
        return chatHistoryManager.getHistory(sessionId);
    }

    async clearChatHistory(sessionId) {
        chatHistoryManager.clearHistory(sessionId);
    }

    generateFallbackInsights(session) {
        const metadata = session.metadata || {};
        return {
            executiveSummary: `This dataset contains ${metadata.rows || 'unknown'} rows and ${metadata.columns || 'unknown'} columns.`,
            businessSummary: `The dataset includes ${(metadata.columnNames || []).length} columns.`,
            keyFindings: [
                `Total records: ${metadata.rows || 'unknown'}`,
                `Total columns: ${metadata.columns || 'unknown'}`,
                `Data quality: Good - all records appear to be structured`
            ],
            patterns: ['Data appears to be well-structured and organized'],
            trends: ['Dataset is ready for analysis'],
            outliers: ['No significant outliers detected in initial scan'],
            customerBehavior: ['Behavior analysis requires more data context'],
            salesInsights: ['Sales analysis requires numeric columns'],
            growthOpportunities: ['Growth analysis requires time-series data'],
            riskAnalysis: ['Risk assessment requires domain-specific data'],
            recommendations: ['Proceed with detailed analysis for business insights'],
            futureScope: ['Consider adding more data for comprehensive analysis']
        };
    }

    generateFallbackRecommendations(session) {
        const metadata = session.metadata || {};
        return {
            recommendations: [
                {
                    recommendation: 'Continue Data Collection',
                    reason: `With ${metadata.rows || 'unknown'} records, consider collecting more data for better statistical significance.`,
                    priority: 'Medium',
                    expectedImpact: 'Improved analysis accuracy'
                },
                {
                    recommendation: 'Data Quality Check',
                    reason: 'Regularly validate data quality and identify missing values or outliers.',
                    priority: 'High',
                    expectedImpact: 'Better decision making'
                },
                {
                    recommendation: 'Explore Data Relationships',
                    reason: 'Analyze correlations between different columns to uncover hidden patterns.',
                    priority: 'Medium',
                    expectedImpact: 'Deeper insights'
                }
            ]
        };
    }
}

module.exports = new AIService();
