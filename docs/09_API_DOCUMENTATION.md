# API Documentation
## AI Data Explainer+ - RESTful API Specification

---

## 1. Base URL

**Development:** `http://localhost:3000/api`
**Production:** `https://your-domain.com/api`

---

## 2. Authentication

**Current:** None (session-based)
**Future:** Bearer token / JWT

---

## 3. Endpoints

### 3.1 Upload Dataset

**POST** `/upload`

Upload and parse a CSV or Excel file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (CSV or Excel)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "filename": "data.csv",
    "filepath": "/uploads/uuid-filename.csv",
    "metadata": {
      "rows": 1234,
      "columns": 15,
      "columnNames": ["id", "name", "value"],
      "columnTypes": {
        "id": "numeric",
        "name": "categorical",
        "value": "numeric"
      },
      "missingValues": {
        "id": 0,
        "name": 5,
        "value": 2
      },
      "fileSize": 2621440,
      "memoryUsage": 5242880
    },
    "preview": [
      { "id": 1, "name": "Item A", "value": 100 },
      { "id": 2, "name": "Item B", "value": 200 }
    ]
  },
  "sessionId": "uuid-session-id"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid file type. Only CSV and Excel files are allowed."
}
```

---

### 3.2 Analyze Dataset

**POST** `/analyze`

Calculate statistics for the dataset.

**Request:**
```json
{
  "sessionId": "uuid-session-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "numeric": {
        "id": { "mean": 617, "median": 617, "mode": null, "min": 1, "max": 1234, "std": 356 },
        "value": { "mean": 150, "median": 150, "mode": 100, "min": 50, "max": 250, "std": 50 }
      },
      "categorical": {
        "name": { "mode": "Item A", "unique": 10 }
      }
    },
    "duplicateRows": 12,
    "uniqueValues": {
      "id": 1234,
      "name": 10,
      "value": 50
    }
  }
}
```

---

### 3.3 Generate Insights

**POST** `/insights`

Generate AI-powered business insights.

**Request:**
```json
{
  "sessionId": "uuid-session-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "executiveSummary": "This dataset contains sales data...",
    "businessSummary": "The data represents monthly sales...",
    "keyFindings": [
      "Product X is the best seller",
      "Sales peak in December"
    ],
    "patterns": ["Seasonal trends observed"],
    "trends": ["Upward trend in Q4"],
    "outliers": ["Unusually high sales in March"],
    "customerBehavior": ["Customers prefer bundle purchases"],
    "salesInsights": ["Average order value: $150"],
    "growthOpportunities": ["Expand to new regions"],
    "riskAnalysis": ["Declining sales in Category Y"],
    "recommendations": ["Increase marketing for Product X"],
    "futureScope": ["Track customer satisfaction"]
  }
}
```

---

### 3.4 Chat With Data

**POST** `/chat`

Ask questions about the dataset (streaming).

**Request:**
```json
{
  "sessionId": "uuid-session-id",
  "question": "Which product sold the most?"
}
```

**Response (SSE stream):**
```
data: {"type": "chunk", "content": "Based on the data"}

data: {"type": "chunk", "content": ", Product X sold"}

data: {"type": "chunk", "content": " the most with 500 units."}

data: {"type": "done", "fullResponse": "Based on the data, Product X sold the most with 500 units."}
```

---

### 3.5 Get Recommendations

**POST** `/recommendations`

Generate AI-powered recommendations.

**Request:**
```json
{
  "sessionId": "uuid-session-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "recommendation": "Increase inventory for Product X",
        "reason": "Product X has consistent high demand",
        "priority": "High",
        "expectedImpact": "20% increase in sales"
      },
      {
        "recommendation": "Launch marketing campaign for Category Y",
        "reason": "Category Y shows growth potential",
        "priority": "Medium",
        "expectedImpact": "15% increase in awareness"
      }
    ]
  }
}
```

---

### 3.6 Generate Report

**POST** `/report`

Generate downloadable PDF report.

**Request:**
```json
{
  "sessionId": "uuid-session-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportUrl": "/reports/uuid-report.pdf",
    "filename": "data-report-2024-01-15.pdf"
  }
}
```

---

### 3.7 Health Check

**GET** `/health`

Check system health and AI provider status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "providers": {
    "ollama": { "available": true, "model": "llama3.2" },
    "groq": { "available": true },
    "openrouter": { "available": true }
  }
}
```

---

## 4. Error Responses

### 4.1 Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### 4.2 HTTP Status Codes
- `200 OK`: Successful request
- `400 Bad Request`: Invalid input
- `413 Payload Too Large`: File too large
- `422 Unprocessable Entity`: Invalid file format
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: AI providers unavailable

---

## 5. Rate Limiting

**Current:** None
**Future:** 100 requests per minute per IP

---

## 6. Response Time Targets

- Upload: < 5 seconds
- Analysis: < 3 seconds
- Insights: < 10 seconds (first response)
- Chat: < 5 seconds (first chunk)
- Report: < 10 seconds

---

## 7. Security Headers

- `Helmet`: Security headers
- `CORS`: Configured origins
- `Content-Type`: application/json

---

## 8. Testing

### 8.1 Example cURL Commands

**Upload:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@data.csv"
```

**Analyze:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "uuid"}'
```

**Insights:**
```bash
curl -X POST http://localhost:3000/api/insights \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "uuid"}'
```

---

## 9. Versioning

**Current:** v1
**URL Pattern:** `/api/v1/{endpoint}`

---

## 10. Future Endpoints

- `POST /auth/login` - User authentication
- `GET /datasets` - List user datasets
- `DELETE /datasets/:id` - Delete dataset
- `POST /datasets/:id/share` - Share dataset
- `GET /history` - Analysis history
