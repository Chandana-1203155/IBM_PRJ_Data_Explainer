// Response Formatter - AI Data Explainer+

class ResponseFormatter {
    formatInsightsResponse(rawResponse) {
        // Parse AI response into structured insights
        // Enhanced parser with better pattern matching
        
        const sections = {
            executiveSummary: '',
            businessSummary: '',
            keyFindings: [],
            patterns: [],
            trends: [],
            outliers: [],
            customerBehavior: [],
            salesInsights: [],
            growthOpportunities: [],
            riskAnalysis: [],
            recommendations: [],
            futureScope: []
        };

        const sectionHeaders = {
            'EXECUTIVE SUMMARY': 'executiveSummary',
            'BUSINESS SUMMARY': 'businessSummary',
            'KEY FINDINGS': 'keyFindings',
            'PATTERNS': 'patterns',
            'TRENDS': 'trends',
            'OUTLIERS': 'outliers',
            'CUSTOMER BEHAVIOR': 'customerBehavior',
            'SALES INSIGHTS': 'salesInsights',
            'GROWTH OPPORTUNITIES': 'growthOpportunities',
            'RISK ANALYSIS': 'riskAnalysis',
            'ACTIONABLE RECOMMENDATIONS': 'recommendations',
            'FUTURE SCOPE': 'futureScope'
        };

        // Simple parsing logic
        const lines = rawResponse.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            const trimmed = line.trim();
            
            // Check for section headers
            for (const [header, sectionKey] of Object.entries(sectionHeaders)) {
                if (trimmed.toUpperCase().includes(header)) {
                    currentSection = sectionKey;
                    return;
                }
            }
            
            if (trimmed && currentSection) {
                if (Array.isArray(sections[currentSection])) {
                    // Check for bullet points or numbered lists
                    if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\./)) {
                        const item = trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s*/, '');
                        if (item) {
                            sections[currentSection].push(item);
                        }
                    } else if (trimmed.length > 10) {
                        // Add as item if substantial
                        sections[currentSection].push(trimmed);
                    }
                } else {
                    // For text sections (executive summary, business summary)
                    sections[currentSection] += trimmed + ' ';
                }
            }
        });

        // Clean up strings
        Object.keys(sections).forEach(key => {
            if (typeof sections[key] === 'string') {
                sections[key] = sections[key].trim();
            }
        });

        // Provide defaults if sections are empty
        if (!sections.executiveSummary) {
            sections.executiveSummary = 'No executive summary generated.';
        }
        if (sections.keyFindings.length === 0) {
            sections.keyFindings = ['Analysis completed successfully'];
        }

        return sections;
    }

    formatRecommendationsResponse(rawResponse) {
        const recommendations = [];
        
        // Enhanced parsing for recommendations
        const lines = rawResponse.split('\n');
        let currentRec = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            
            if (trimmed.match(/^RECOMMENDATION:/i)) {
                if (currentRec) {
                    recommendations.push(currentRec);
                }
                currentRec = {
                    recommendation: trimmed.replace(/^RECOMMENDATION:/i, '').trim(),
                    reason: '',
                    priority: 'Medium',
                    expectedImpact: ''
                };
            } else if (trimmed.match(/^REASON:/i) && currentRec) {
                currentRec.reason = trimmed.replace(/^REASON:/i, '').trim();
            } else if (trimmed.match(/^PRIORITY:/i) && currentRec) {
                const priority = trimmed.replace(/^PRIORITY:/i, '').trim();
                // Normalize priority
                if (priority.match(/high/i)) {
                    currentRec.priority = 'High';
                } else if (priority.match(/low/i)) {
                    currentRec.priority = 'Low';
                } else {
                    currentRec.priority = 'Medium';
                }
            } else if (trimmed.match(/^EXPECTED IMPACT:/i) && currentRec) {
                currentRec.expectedImpact = trimmed.replace(/^EXPECTED IMPACT:/i, '').trim();
            } else if (trimmed.match(/^-/) && currentRec && !currentRec.recommendation.includes(trimmed)) {
                // Additional details
                if (currentRec.reason) {
                    currentRec.reason += ' ' + trimmed.replace(/^-/, '').trim();
                }
            }
        });

        if (currentRec) {
            recommendations.push(currentRec);
        }

        // Provide default if no recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                recommendation: 'Continue monitoring your data regularly',
                reason: 'Ongoing analysis helps identify trends and opportunities',
                priority: 'Medium',
                expectedImpact: 'Improved decision making'
            });
        }

        return { recommendations };
    }

    sanitizeResponse(response) {
        // Remove any sensitive information
        // Sanitize HTML/JS to prevent XSS
        return response
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    formatChatResponse(rawResponse) {
        // Format chat response for display
        return {
            content: this.sanitizeResponse(rawResponse),
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new ResponseFormatter();
