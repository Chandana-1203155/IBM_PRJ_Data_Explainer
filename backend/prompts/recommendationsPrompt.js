// Recommendations Prompt Template - AI Data Explainer+

const RECOMMENDATIONS_PROMPT_TEMPLATE = `
You are a strategic business consultant specializing in data-driven decision making
for small and medium businesses.

Dataset Context:
{datasetContext}

Previous Insights:
{insights}

Statistics:
{statistics}

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

module.exports = RECOMMENDATIONS_PROMPT_TEMPLATE;
