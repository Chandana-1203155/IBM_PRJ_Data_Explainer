// Prompt Builder - AI Data Explainer+

class PromptBuilder {
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

    buildChatPrompt(session, question) {
        const { data, metadata, analysis } = session;
        
        return `
You are a helpful data assistant that answers questions about datasets in simple,
clear language for non-technical users.

Dataset Context:
- Column Names: ${metadata.columnNames.join(', ')}
- Column Types: ${JSON.stringify(metadata.columnTypes, null, 2)}
- Sample Data: ${JSON.stringify(session.preview.slice(0, 5), null, 2)}
- Statistics: ${JSON.stringify(analysis ? analysis.statistics : {}, null, 2)}

Question: ${question}

Answer the question using the provided dataset context. If the information is not available
in the dataset, clearly state that. Provide specific, accurate answers with supporting evidence.
Keep answers concise (2-4 sentences).
`;
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
- RECOMMENDATION: Specific action
- REASON: Why this recommendation
- PRIORITY: High/Medium/Low
- EXPECTED IMPACT: Business value

Generate 5-7 recommendations covering:
- Business improvements
- Marketing strategies
- Growth opportunities
- Risk mitigation
- Data quality improvements

Focus on actionable items, prioritize by business impact, and estimate realistic outcomes.
`;
    }
}

module.exports = new PromptBuilder();
