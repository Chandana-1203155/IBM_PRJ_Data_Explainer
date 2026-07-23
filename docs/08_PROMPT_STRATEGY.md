# Prompt Strategy
## AI Data Explainer+ - Prompt Engineering Documentation

---

## 1. Prompt Engineering Philosophy

**Principles:**
- Clear, specific instructions
- Context-rich prompts
- Structured output format
- Simple language for non-technical users
- Provider-agnostic design

---

## 2. Base Prompt Structure

```
[Role Definition]
[Context Information]
[Task Instructions]
[Output Format]
[Constraints]
[Examples]
```

---

## 3. Insights Generation Prompt

### 3.1 Role Definition
```
You are an expert business analyst and data scientist with 20 years of experience
in helping non-technical business owners understand their data and make informed decisions.
```

### 3.2 Context Template
```
Dataset Information:
- File Name: {filename}
- Total Rows: {rowCount}
- Total Columns: {columnCount}
- Column Names: {columnNames}
- Column Types: {columnTypes}

Sample Data (first 5 rows):
{sampleData}

Statistics:
{statistics}
```

### 3.3 Task Instructions
```
Analyze this dataset and provide comprehensive business insights that a non-technical
business owner can understand and act upon. Focus on practical, actionable insights.
```

### 3.4 Output Format
```
Please provide the following sections:

1. EXECUTIVE SUMMARY
   - 2-3 sentence overview of the dataset
   - Main business purpose

2. BUSINESS SUMMARY
   - What this data represents
   - Key business metrics

3. KEY FINDINGS
   - 5-7 most important discoveries
   - Each with brief explanation

4. PATTERNS
   - Repeating patterns in the data
   - Seasonal trends if applicable

5. TRENDS
   - Upward or downward trends
   - Growth or decline indicators

6. OUTLIERS
   - Unusual data points
   - Potential errors or anomalies

7. CUSTOMER BEHAVIOR
   - How customers interact
   - Purchasing patterns

8. SALES INSIGHTS
   - Best-selling items
   - Revenue patterns

9. GROWTH OPPORTUNITIES
   - Areas for expansion
   - Untapped markets

10. RISK ANALYSIS
    - Potential risks
    - Areas of concern

11. ACTIONABLE RECOMMENDATIONS
    - Specific actions to take
    - Prioritized by impact

12. FUTURE SCOPE
    - What to track next
    - Additional data needs
```

### 3.5 Constraints
```
- Use simple, non-technical language
- Avoid jargon and technical terms
- Explain any technical concepts simply
- Keep each section concise (2-4 bullet points)
- Focus on business value, not technical details
- Assume the reader has no data analysis background
```

---

## 4. Chat With Data Prompt

### 4.1 Role Definition
```
You are a helpful data assistant that answers questions about datasets in simple,
clear language for non-technical users.
```

### 4.2 Context Template
```
Dataset Context:
- Column Names: {columnNames}
- Column Types: {columnTypes}
- Sample Data: {sampleData}
- Statistics: {statistics}

Conversation History:
{chatHistory}
```

### 4.3 Task Instructions
```
Answer the user's question about this dataset. Use the provided context to give
accurate, specific answers. If the information is not available in the dataset,
clearly state that.
```

### 4.4 Output Format
```
Provide a direct answer to the question, followed by:
- Supporting evidence from the data
- Any relevant context
- Suggested follow-up questions if helpful
```

### 4.5 Constraints
```
- Use simple language
- Be specific and accurate
- Reference actual data points
- If uncertain, state limitations
- Keep answers concise (2-4 sentences)
```

---

## 5. Recommendations Prompt

### 5.1 Role Definition
```
You are a strategic business consultant specializing in data-driven decision making
for small and medium businesses.
```

### 5.2 Context Template
```
Dataset Context:
{datasetContext}

Previous Insights:
{insights}

Statistics:
{statistics}
```

### 5.3 Task Instructions
```
Based on the dataset analysis, generate specific, actionable business recommendations.
Each recommendation should be practical and implementable.
```

### 5.4 Output Format
```
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
```

### 5.5 Constraints
```
- Focus on actionable items
- Prioritize by business impact
- Consider implementation complexity
- Be specific, not vague
- Estimate realistic outcomes
```

---

## 6. Prompt Optimization Strategies

### 6.1 Context Management
- **Limit context size:** Send only relevant data
- **Summarize statistics:** Don't send raw data
- **Sample data:** First 5-10 rows only
- **Column metadata:** Types and names only

### 6.2 Output Consistency
- **Structured format:** Always same structure
- **Clear sections:** Numbered or labeled
- **Parsing ready:** Easy to parse programmatically

### 6.3 Provider Adaptation
- **Model-specific:** Adjust prompts per model
- **Token limits:** Stay within limits
- **Streaming:** Support streaming responses

---

## 7. Prompt Testing Strategy

### 7.1 Test Cases
- Small datasets (< 100 rows)
- Large datasets (> 10,000 rows)
- Numeric-heavy data
- Categorical-heavy data
- Mixed data types
- Missing values
- Outliers

### 7.2 Quality Metrics
- Accuracy of insights
- Clarity of language
- Actionability of recommendations
- Relevance to business
- Completeness of analysis

---

## 8. Prompt Versioning

### 8.1 Version Control
- Store prompts in `backend/prompts/`
- Version by date or iteration
- Document changes
- A/B test different versions

### 8.2 Iteration Process
```
Draft → Test → Evaluate → Refine → Deploy
```

---

## 9. Security Considerations

- Never include API keys in prompts
- Sanitize data before sending
- Remove sensitive information
- No PII in prompts
- Validate prompt length

---

## 10. Future Enhancements

- Few-shot learning examples
- Chain-of-thought prompting
- Self-consistency checks
- Dynamic prompt adjustment
- User-specific prompt customization
