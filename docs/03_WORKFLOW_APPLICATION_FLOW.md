# Workflow & Application Flow
## AI Data Explainer+ - User Journey & System Flow Documentation

---

## 1. User Journey Map

### 1.1 First-Time User Flow

```
User Access
    ↓
Landing Page
    ↓
Click "Get Started" / "Upload Data"
    ↓
Dashboard (Empty State)
    ↓
Upload Dataset (Drag & Drop or Browse)
    ↓
File Validation
    ↓
Dataset Processing
    ↓
Dataset Overview Display
    ↓
Explore Features:
    - View Statistics
    - View Charts
    - Read AI Insights
    - Chat with Data
    - View Recommendations
    - Generate PDF Report
```

### 1.2 Returning User Flow

```
User Access
    ↓
Landing Page
    ↓
Click "Get Started"
    ↓
Dashboard (Previous Session State - Optional Future)
    ↓
Upload New Dataset or Continue Previous
    ↓
Continue Analysis
```

---

## 2. Detailed Application Flow

### 2.1 File Upload Flow

```
User Action: Drag file or Click Browse
    ↓
Frontend: Display drop zone / file picker
    ↓
User: Selects file
    ↓
Frontend: Validate file (extension, size)
    ↓
If Invalid: Show error message
    ↓
If Valid: Show upload progress
    ↓
Frontend: Send file to backend (/api/upload)
    ↓
Backend: Multer middleware receives file
    ↓
Backend: Validate file again (security)
    ↓
Backend: Save to temporary uploads directory
    ↓
Backend: Parse file (CSV or Excel)
    ↓
If Parse Error: Return error to frontend
    ↓
If Parse Success: Extract data
    ↓
Backend: Calculate basic metadata (rows, columns, etc.)
    ↓
Backend: Return metadata to frontend
    ↓
Frontend: Display dataset overview
    ↓
Frontend: Store dataset in memory for analysis
```

### 2.2 Dataset Analysis Flow

```
Dataset Overview Display
    ↓
User: Clicks "Analyze" or automatic trigger
    ↓
Frontend: Send request to (/api/analyze)
    ↓
Backend: Receive dataset context
    ↓
Backend: Calculate statistics
    - Mean, Median, Mode
    - Min, Max, Std Dev
    - Missing values
    - Data types
    ↓
Backend: Identify column types
    - Numeric
    - Categorical
    - Date
    ↓
Backend: Return statistics to frontend
    ↓
Frontend: Display statistics table
    ↓
Frontend: Trigger chart generation
```

### 2.3 Chart Generation Flow

```
Statistics Calculated
    ↓
Frontend: Determine chart types for each column
    ↓
Frontend: Send chart data to Chart.js
    ↓
Chart.js: Render charts
    - Bar chart for categorical
    - Pie chart for distribution
    - Line chart for time series
    - Scatter plot for correlations
    - Histogram for numeric distribution
    - Box plot for outliers
    - Heatmap for correlations
    ↓
Frontend: Display charts in dashboard
    ↓
User: Interact with charts (hover, zoom, etc.)
```

### 2.4 AI Insights Generation Flow

```
Dataset Analyzed
    ↓
User: Clicks "Generate Insights" or automatic trigger
    ↓
Frontend: Send request to (/api/insights)
    ↓
Backend: Receive dataset context
    ↓
Backend: Prepare AI prompt
    - Dataset summary
    - Statistics
    - Column information
    - Sample data
    ↓
Backend: Select AI provider (based on AI_PROVIDER env)
    ↓
Backend: Call AI provider API
    ↓
If Success: Receive AI response
    ↓
If Failure: Switch to next provider
    ↓
Backend: Parse AI response
    - Executive Summary
    - Business Summary
    - Key Findings
    - Patterns
    - Trends
    - Outliers
    - Customer Behavior
    - Sales Insights
    - Growth Opportunities
    - Risk Analysis
    - Recommendations
    - Future Scope
    ↓
Backend: Return insights to frontend
    ↓
Frontend: Display insights in organized sections
    ↓
User: Read insights
```

### 2.5 Chat With Data Flow

```
Dataset Loaded
    ↓
User: Opens chat interface
    ↓
Frontend: Display chat input
    ↓
User: Types question (e.g., "Which product sold the most?")
    ↓
Frontend: Send question to (/api/chat)
    ↓
Backend: Receive question
    ↓
Backend: Retrieve relevant dataset context
    - Column names
    - Sample data
    - Statistics
    - Schema information
    ↓
Backend: Prepare AI prompt with context
    ↓
Backend: Select AI provider
    ↓
Backend: Initiate streaming request
    ↓
Backend: Stream response chunks to frontend
    ↓
Frontend: Display response progressively
    ↓
User: Reads partial response
    ↓
Backend: Complete streaming
    ↓
Frontend: Store in conversation history
    ↓
User: Asks follow-up question
    ↓
Process repeats with conversation context
```

### 2.6 AI Recommendations Flow

```
AI Insights Generated
    ↓
User: Clicks "View Recommendations" or automatic trigger
    ↓
Frontend: Send request to (/api/recommendations)
    ↓
Backend: Receive dataset context and insights
    ↓
Backend: Prepare AI prompt
    - Dataset summary
    - Previous insights
    - Statistics
    ↓
Backend: Call AI provider
    ↓
Backend: Parse AI response
    - Business Recommendations
    - Marketing Suggestions
    - Growth Opportunities
    - Risk Alerts
    - Data Cleaning Suggestions
    ↓
Backend: Structure recommendations with:
    - Recommendation text
    - Reason
    - Priority (High/Medium/Low)
    - Expected Business Impact
    ↓
Backend: Return to frontend
    ↓
Frontend: Display in priority-sorted cards
    ↓
User: Reviews recommendations
```

### 2.7 PDF Report Generation Flow

```
Analysis Complete
    ↓
User: Clicks "Generate PDF Report"
    ↓
Frontend: Send request to (/api/report)
    ↓
Backend: Receive dataset context
    ↓
Backend: Gather all data
    - Dataset overview
    - Statistics
    - Charts (as images)
    - AI insights
    - Recommendations
    ↓
Backend: Generate PDF using jsPDF
    - Cover page with branding
    - Table of contents
    - Dataset overview section
    - Statistics section
    - Charts section
    - Executive summary
    - Business insights
    - Recommendations
    - Future scope
    - Generated date
    ↓
Backend: Save PDF to temporary directory
    ↓
Backend: Return PDF download URL
    ↓
Frontend: Trigger download
    ↓
Browser: Download PDF file
    ↓
Backend: Cleanup temporary PDF file
```

### 2.8 AI Provider Fallback Flow

```
Backend: Attempt to use Primary Provider (Ollama)
    ↓
If Success: Use provider
    ↓
If Failure: Log error
    ↓
Backend: Switch to Secondary Provider (Groq)
    ↓
If Success: Use provider
    ↓
If Failure: Log error
    ↓
Backend: Switch to Tertiary Provider (OpenRouter)
    ↓
If Success: Use provider
    ↓
If Failure: Return error to frontend
    ↓
Frontend: Display error message
    ↓
User: Notified of AI service unavailability
```

---

## 3. System Architecture Flow

### 3.1 Request Flow Diagram

```
User Browser
    ↓
Frontend (HTML/CSS/JS)
    ↓
HTTP/HTTPS Request
    ↓
Backend API (Express.js)
    ↓
Middleware Layer
    - CORS
    - Helmet
    - Express Validator
    - Error Handler
    ↓
Router Layer
    - /api/upload
    - /api/analyze
    - /api/insights
    - /api/chat
    - /api/recommendations
    - /api/report
    ↓
Controller Layer
    - UploadController
    - AnalysisController
    - InsightsController
    - ChatController
    - ReportController
    ↓
Service Layer
    - FileService
    - AnalysisService
    - VisualizationService
    - AIProviderService
    - ReportService
    ↓
Provider Layer
    - OllamaProvider
    - GroqProvider
    - OpenRouterProvider
    ↓
External APIs / Local Services
    - Ollama (Local)
    - Groq API
    - OpenRouter API
    ↓
Response Flow (Reverse)
```

### 3.2 Data Flow Diagram

```
Input: CSV/Excel File
    ↓
File Upload
    ↓
File Parsing (PapaParse / XLSX)
    ↓
Data Validation
    ↓
Data Transformation
    ↓
In-Memory Storage (Session)
    ↓
Analysis Engine
    ↓
Statistics Calculation
    ↓
Visualization Generation
    ↓
AI Context Preparation
    ↓
AI Provider Communication
    ↓
AI Response Processing
    ↓
Insight Generation
    ↓
Report Generation
    ↓
Output: PDF Report
```

---

## 4. State Management Flow

### 4.1 Frontend State

```
Application State:
{
    currentView: 'landing' | 'dashboard',
    theme: 'light' | 'dark',
    dataset: {
        loaded: boolean,
        filename: string,
        data: Array<Object>,
        metadata: {
            rows: number,
            columns: number,
            columnNames: Array<string>,
            columnTypes: Object,
            missingValues: Object,
            file: {
                size: number,
                type: string
            }
        }
    },
    statistics: {
        calculated: boolean,
        results: Object
    },
    charts: {
        generated: boolean,
        charts: Array<Object>
    },
    insights: {
        generated: boolean,
        data: Object
    },
    chat: {
        history: Array<Object>,
        isStreaming: boolean
    },
    recommendations: {
        generated: boolean,
        items: Array<Object>
    },
    ui: {
        loading: boolean,
        error: string | null,
        notifications: Array<Object>
    }
}
```

### 4.2 Backend State

```
Session State (In-Memory):
{
    sessionId: string,
    dataset: {
        filepath: string,
        data: Array<Object>,
        metadata: Object
    },
    analysis: {
        statistics: Object,
        charts: Array<Object>
    },
    ai: {
        currentProvider: string,
        providerHistory: Array<string>
    },
    createdAt: timestamp,
    lastAccessed: timestamp
}
```

---

## 5. Error Handling Flow

### 5.1 File Upload Errors

```
Error Type: Invalid File Extension
    ↓
Detection: Frontend validation
    ↓
Action: Show error toast
    ↓
Message: "Please upload a CSV or Excel file"
    ↓
Recovery: User selects correct file

Error Type: File Too Large
    ↓
Detection: Frontend validation
    ↓
Action: Show error toast
    ↓
Message: "File size exceeds 10MB limit"
    ↓
Recovery: User selects smaller file

Error Type: Corrupted File
    ↓
Detection: Backend parsing
    ↓
Action: Return error response
    ↓
Frontend: Show error toast
    ↓
Message: "Unable to parse file. Please check if it's corrupted"
    ↓
Recovery: User uploads different file

Error Type: Empty File
    ↓
Detection: Backend parsing
    ↓
Action: Return error response
    ↓
Frontend: Show error toast
    ↓
Message: "File is empty. Please upload a file with data"
    ↓
Recovery: User uploads file with data
```

### 5.2 AI Provider Errors

```
Error Type: Primary Provider Unavailable
    ↓
Detection: API call failure
    ↓
Action: Log error, switch to secondary provider
    ↓
User Impact: Minimal (automatic fallback)
    ↓
Notification: Info toast "Using backup AI provider"

Error Type: All Providers Unavailable
    ↓
Detection: All providers fail
    ↓
Action: Return error response
    ↓
Frontend: Show error toast
    ↓
Message: "AI services are currently unavailable. Please try again later"
    ↓
Recovery: User retries later

Error Type: Rate Limit Exceeded
    ↓
Detection: API response (429)
    ↓
Action: Switch to next provider
    ↓
User Impact: Minimal (automatic fallback)
    ↓
Notification: None (seamless)
```

### 5.3 Network Errors

```
Error Type: Backend Unreachable
    ↓
Detection: Network error
    ↓
Action: Show error toast
    ↓
Message: "Unable to connect to server. Please check your connection"
    ↓
Recovery: User retries when connection restored

Error Type: Request Timeout
    ↓
Detection: Timeout after 30s
    ↓
Action: Show error toast
    ↓
Message: "Request timed out. Please try again"
    ↓
Recovery: User retries
```

---

## 6. Security Flow

### 6.1 File Upload Security

```
User Uploads File
    ↓
Frontend: Validate extension
    ↓
Frontend: Validate size
    ↓
Backend: Multer middleware
    ↓
Backend: Validate extension again
    ↓
Backend: Validate size again
    ↓
Backend: Scan for malicious content (basic)
    ↓
Backend: Generate unique filename
    ↓
Backend: Save to isolated uploads directory
    ↓
Backend: Set file permissions
    ↓
Processing: Parse with trusted libraries
    ↓
Cleanup: Delete after session
```

### 6.2 API Security

```
Incoming Request
    ↓
Helmet: Set security headers
    ↓
CORS: Validate origin
    ↓
Express Validator: Sanitize inputs
    ↓
Rate Limiting: Check request rate (optional)
    ↓
Controller: Process request
    ↓
Output: Encode responses
    ↓
Error Handler: Sanitize error messages
    ↓
Response: Send to client
```

### 6.3 AI Provider Security

```
AI Request
    ↓
Load API key from environment variable
    ↓
Validate API key exists
    ↓
Use HTTPS for API calls
    ↓
Never log API keys
    ↓
Never include API keys in responses
    ↓
Handle errors without exposing keys
    ↓
Response: Return to application
```

---

## 7. Performance Flow

### 7.1 File Processing Performance

```
File Upload
    ↓
Chunked upload (for large files)
    ↓
Progress indicator
    ↓
Streaming parse (if possible)
    ↓
Memory-efficient processing
    ↓
Background processing
    ↓
UI remains responsive
    ↓
Complete: Display results
```

### 7.2 AI Response Performance

```
AI Request
    ↓
Initiate streaming
    ↓
First chunk: < 2 seconds
    ↓
Display first chunk immediately
    ↓
Continue streaming
    ↓
Update UI progressively
    ↓
Complete: Full response displayed
```

---

## 8. Cleanup Flow

### 8.1 Session Cleanup

```
Session Ends (User leaves or timeout)
    ↓
Backend: Detect session inactivity
    ↓
Backend: Delete uploaded files
    ↓
Backend: Delete generated reports
    ↓
Backend: Clear in-memory data
    ↓
Backend: Log cleanup
    ↓
Resources: Freed
```

### 8.2 Error Cleanup

```
Error Occurs
    ↓
Backend: Log error
    ↓
Backend: Clean up partial data
    ↓
Backend: Delete temporary files
    ↓
Backend: Clear session state
    ↓
Frontend: Display error
    ↓
Frontend: Reset to safe state
    ↓
User: Can retry
```

---

## 9. User Interaction Flow

### 9.1 Typical User Session

```
1. User lands on page
2. User views features
3. User clicks "Get Started"
4. User uploads dataset
5. User views dataset overview
6. User views statistics
7. User views charts
8. User reads AI insights
9. User asks questions via chat
10. User views recommendations
11. User generates PDF report
12. User downloads report
13. User leaves or uploads new dataset
```

### 9.2 Power User Session

```
1. User uploads dataset
2. User quickly scans overview
3. User jumps to specific charts
4. User asks targeted questions via chat
5. User drills down into insights
6. User generates multiple reports
7. User compares different datasets
```

---

## 10. Integration Flow

### 10.1 Third-Party Library Integration

```
PapaParse Integration:
    - CSV file input
    - PapaParse.parse()
    - Config options (header, dynamicTyping)
    - Parse results
    - Error handling
    - Data extraction

Chart.js Integration:
    - Data preparation
    - Chart type selection
    - Chart configuration
    - Chart.js constructor
    - Render to canvas
    - Event handling

jsPDF Integration:
    - Document creation
    - Content addition
    - Image embedding
    - Styling
    - PDF generation
    - Download trigger
```

### 10.2 AI Provider Integration

```
Ollama Integration:
    - Check Ollama availability
    - Select model (llama3.2)
    - Prepare prompt
    - HTTP request to Ollama API
    - Stream response
    - Parse response
    - Error handling

Groq Integration:
    - Load API key
    - Prepare prompt
    - HTTP request to Groq API
    - Stream response
    - Parse response
    - Error handling

OpenRouter Integration:
    - Load API key
    - Select free model
    - Prepare prompt
    - HTTP request to OpenRouter API
    - Stream response
    - Parse response
    - Error handling
```

---

## 11. Conclusion

This workflow and application flow document provides a comprehensive view of how users interact with AI Data Explainer+ and how the system processes requests. The flows are designed for optimal user experience, reliability, and performance. The multi-provider AI architecture ensures reliability, while comprehensive error handling ensures graceful degradation.

**Next Phase:** Folder Structure & Architecture Design
