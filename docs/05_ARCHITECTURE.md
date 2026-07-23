# System Architecture
## AI Data Explainer+ - Technical Architecture Documentation

---

## 1. High-Level Architecture

### 1.1 Architecture Overview

AI Data Explainer+ follows a **three-tier architecture** with a **provider-based AI integration pattern**:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│                         (Frontend)                           │
│  HTML5 | CSS3 | Vanilla JS | Chart.js | PapaParse | jsPDF   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                       Application Layer                      │
│                        (Backend)                             │
│           Express.js | Middleware | Services | Controllers   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                         AI Layer                             │
│                    (Provider Pattern)                        │
│  Ollama (Primary) | Groq (Backup) | OpenRouter (Backup)     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Style

- **Pattern:** Model-View-Controller (MVC) with Service Layer
- **Communication:** RESTful API with Server-Sent Events (SSE) for streaming
- **State Management:** Client-side state with server-side session storage
- **Deployment:** Containerized microservices-ready architecture

---

## 2. Component Architecture

### 2.1 Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Views       │    │  Components   │    │   Services    │
│               │    │               │    │               │
│ - Landing     │    │ - Navbar      │    │ - API         │
│ - Dashboard   │    │ - Sidebar     │    │ - Dataset     │
│ - Upload      │    │ - Upload      │    │ - Chart       │
│ - Charts      │    │ - Charts      │    │ - Report      │
│ - Chat        │    │ - Chat        │    │               │
│ - Reports     │    │ - Theme       │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ↓
                    ┌───────────────┐
                    │    Utils      │
                    │               │
                    │ - Validators  │
                    │ - Formatters  │
                    │ - Helpers     │
                    └───────────────┘
```

### 2.2 Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Routes      │    │ Controllers  │    │   Services    │
│               │    │               │    │               │
│ - /upload     │    │ - Upload      │    │ - File        │
│ - /analyze    │    │ - Analyze     │    │ - Analysis    │
│ - /insights   │    │ - Insights    │    │ - AI          │
│ - /chat       │    │ - Chat        │    │ - Report      │
│ - /recommend  │    │ - Recommend   │    │               │
│ - /report     │    │ - Report      │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ↓
                    ┌───────────────┐
                    │  Middleware   │
                    │               │
                    │ - CORS        │
                    │ - Helmet      │
                    │ - Validator   │
                    │ - Error       │
                    │ - Logger      │
                    └───────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Providers    │    │    Utils      │    │   Prompts     │
│               │    │               │    │               │
│ - Ollama      │    │ - Parser      │    │ - Insights    │
│ - Groq        │    │ - Analyzer    │    │ - Chat        │
│ - OpenRouter  │    │ - Statistics  │    │ - Recommend   │
│               │    │ - Formatter   │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## 3. Data Flow Architecture

### 3.1 Request-Response Flow

```
Client (Browser)
    │
    │ HTTP Request
    ↓
Express Server
    │
    ├── Middleware Pipeline
    │   ├── CORS
    │   ├── Helmet
    │   ├── Validator
    │   └── Logger
    │
    ↓
Router
    │
    ↓
Controller
    │
    ├── Request Validation
    ├── Business Logic Delegation
    │
    ↓
Service Layer
    │
    ├── Data Processing
    ├── AI Provider Selection
    ├── External API Calls
    │
    ↓
Response Formatting
    │
    ↓
Controller
    │
    ↓
Response → Client
```

### 3.2 Streaming Flow (Chat)

```
Client (Browser)
    │
    │ SSE Request
    ↓
Express Server
    │
    ↓
Chat Controller
    │
    ↓
AI Service
    │
    ├── Provider Selection
    ├── Context Preparation
    │
    ↓
AI Provider (Ollama/Groq/OpenRouter)
    │
    │ Stream Response Chunks
    ↓
AI Service
    │
    ↓
Chat Controller
    │
    │ Server-Sent Events
    ↓
Client (Browser)
    │
    └── Progressive Display
```

---

## 4. AI Provider Architecture

### 4.1 Provider Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Provider Interface                     │
│                  (BaseProvider.js)                          │
│                                                              │
│  + generateResponse(prompt, context)                       │
│  + streamResponse(prompt, context)                          │
│  + validateConfig()                                         │
│  + isAvailable()                                            │
└─────────────────────────────────────────────────────────────┘
                              △
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ OllamaProvider│    │ GroqProvider  │    │OpenRouterPrvdr│
│               │    │               │    │               │
│ - Local API   │    │ - Cloud API   │    │ - Cloud API   │
│ - llama3.2    │    │ - Groq Models │    │ - Free Models │
│ - No Limits   │    │ - Rate Limits │    │ - Rate Limits │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 4.2 Provider Selection Logic

```
AI Service
    │
    ├── Read AI_PROVIDER from environment
    │
    ├── if AI_PROVIDER == 'ollama'
    │   ├── Try OllamaProvider
    │   ├── if fails → Try GroqProvider
    │   └── if fails → Try OpenRouterProvider
    │
    ├── if AI_PROVIDER == 'groq'
    │   ├── Try GroqProvider
    │   ├── if fails → Try OpenRouterProvider
    │   └── if fails → Try OllamaProvider
    │
    └── if AI_PROVIDER == 'openrouter'
        ├── Try OpenRouterProvider
        ├── if fails → Try GroqProvider
        └── if fails → Try OllamaProvider
```

### 4.3 Fallback Mechanism

```
Provider Request
    │
    ↓
Primary Provider
    │
    ├── Success → Return Response
    │
    └── Failure
        │
        ├── Log Error
        ├── Switch to Secondary Provider
        │
        ↓
    Secondary Provider
        │
        ├── Success → Return Response
        │
        └── Failure
            │
            ├── Log Error
            ├── Switch to Tertiary Provider
            │
            ↓
        Tertiary Provider
            │
            ├── Success → Return Response
            │
            └── Failure
                │
                ├── Log Error
                └── Return Error to Client
```

---

## 5. Security Architecture

### 5.1 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  Application Security                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Network Layer │    │ Application   │    │   Data Layer  │
│               │    │    Layer      │    │               │
│ - HTTPS       │    │ - Input Val.  │    │ - Env Vars    │
│ - CORS        │    │ - Output Enc. │    │ - No Key Exp. │
│ - Helmet      │    │ - Auth (future)│   │ - File Val.   │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 5.2 API Key Management

```
Environment Variables (.env)
    │
    ├── GROQ_API_KEY
    ├── OPENROUTER_API_KEY
    └── OLLAMA_URL
         │
         ↓
    Config Module
         │
         ├── Load at startup
         ├── Validate presence
         └── Never expose
              │
              ↓
    AI Providers
         │
         ├── Use keys internally
         ├── Never log keys
         └── Never include in responses
```

### 5.3 File Upload Security

```
File Upload
    │
    ├── Frontend Validation
    │   ├── Extension check
    │   ├── Size check
    │   └── Type check
    │
    ↓
Backend Middleware
    │
    ├── Multer Configuration
    │   ├── File size limit
    │   ├── Allowed extensions
    │   └── Safe filename generation
    │
    ↓
File Processing
    │
    ├── Trusted libraries (PapaParse, XLSX)
    ├── Content validation
    └── Isolated storage
    │
    ↓
Automatic Cleanup
    │
    └── Delete after session
```

---

## 6. Scalability Architecture

### 6.1 Horizontal Scaling Readiness

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                    (Nginx / AWS ALB)                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Instance 1  │    │   Instance 2  │    │   Instance 3  │
│               │    │               │    │               │
│ - Express     │    │ - Express     │    │ - Express     │
│ - Node.js     │    │ - Node.js     │    │ - Node.js     │
└───────────────┘    └───────────────┘    └───────────────┘
                              │
                              ↓
                    ┌───────────────┐
                    │ Shared Storage│
                    │               │
                    │ - S3 / EFS    │
                    │ - Redis Cache │
                    └───────────────┘
```

### 6.2 Stateless Design

```
Current Architecture (Stateless)
    │
    ├── No database
    ├── Session-based storage
    ├── In-memory data
    └── Automatic cleanup
         │
         ↓
Benefits:
    - Easy horizontal scaling
    - No session affinity required
    - Simple deployment
    - Lower infrastructure cost
```

### 6.3 Future Scaling Options

```
Option 1: Add Caching Layer
    │
    ├── Redis for session storage
    ├── CDN for static assets
    └── Response caching

Option 2: Add Database
    │
    ├── PostgreSQL for user data
    ├── MongoDB for analytics data
    └── S3 for file storage

Option 3: Microservices
    │
    ├── Separate AI service
    ├── Separate file processing service
    └── Separate report generation service
```

---

## 7. Performance Architecture

### 7.1 Performance Optimization Strategies

```
Frontend Optimization
    │
    ├── Lazy loading
    ├── Code splitting
    ├── Image optimization
    ├── CDN for libraries
    └── Browser caching

Backend Optimization
    │
    ├── Streaming responses
    ├── Async processing
    ├── Connection pooling
    ├── Compression (gzip)
    └── Response caching

AI Optimization
    │
    ├── Provider fallback
    ├── Context optimization
    ├── Prompt caching
    └── Streaming responses
```

### 7.2 Caching Strategy

```
Current: No persistent caching
    │
    ├── In-memory session storage
    ├── Browser cache for static assets
    └── No API response caching

Future Options:
    │
    ├── Redis for session storage
    ├── CDN for static assets
    └── API response caching (TTL-based)
```

---

## 8. Error Handling Architecture

### 8.1 Error Handling Flow

```
Error Occurs
    │
    ↓
Detection
    │
    ├── Try-Catch blocks
    ├── Promise rejection
    └── Event listeners
    │
    ↓
Classification
    │
    ├── Client errors (4xx)
    ├── Server errors (5xx)
    ├── Network errors
    └── AI provider errors
    │
    ↓
Logging
    │
    ├── Error type
    ├── Stack trace
    ├── Request context
    └── Timestamp
    │
    ↓
Recovery
    │
    ├── Fallback to backup provider
    ├── Retry with exponential backoff
    ├── Graceful degradation
    └── User notification
    │
    ↓
Response
    │
    ├── Sanitized error message
    ├── Recovery suggestions
    └── HTTP status code
```

### 8.2 Error Types

```
Client Errors (4xx)
    │
    ├── 400 Bad Request
    ├── 401 Unauthorized (future)
    ├── 403 Forbidden (future)
    ├── 404 Not Found
    ├── 413 Payload Too Large
    └── 422 Unprocessable Entity

Server Errors (5xx)
    │
    ├── 500 Internal Server Error
    ├── 502 Bad Gateway
    ├── 503 Service Unavailable
    └── 504 Gateway Timeout
```

---

## 9. Deployment Architecture

### 9.1 Container Architecture

```
Docker Containers
    │
        ┌───────────────────┐
        │  Frontend Container│
        │                    │
        │  - Nginx           │
        │  - Static Files    │
        └───────────────────┘
                    │
                    ↓
        ┌───────────────────┐
        │  Backend Container │
        │                    │
        │  - Node.js         │
        │  - Express         │
        │  - AI Providers    │
        └───────────────────┘
                    │
                    ↓
        ┌───────────────────┐
        │  Docker Compose   │
        │                    │
        │  - Orchestration   │
        │  - Networking      │
        │  - Volumes         │
        └───────────────────┘
```

### 9.2 AWS Deployment Architecture

```
AWS App Runner
    │
    ├── Docker Image from ECR
    ├── Environment Variables
    ├── Auto-scaling
    ├── Load balancing
    └── HTTPS (automatic)
         │
         ↓
    Resources
    │
    ├── ECR (Docker registry)
    ├── S3 (Static assets - future)
    ├── CloudWatch (Logging)
    └── CloudFront (CDN - future)
```

---

## 10. Integration Architecture

### 10.1 Third-Party Integrations

```
Frontend Libraries
    │
    ├── Chart.js (Visualizations)
    ├── PapaParse (CSV parsing)
    ├── jsPDF (PDF generation)
    ├── Font Awesome (Icons)
    ├── Google Fonts (Typography)
    └── AOS (Animations)

Backend Libraries
    │
    ├── Express.js (Web framework)
    ├── Multer (File uploads)
    ├── CORS (Cross-origin)
    ├── dotenv (Environment)
    ├── Helmet (Security)
    └── Express Validator (Validation)

AI Providers
    │
    ├── Ollama (Local LLM)
    ├── Groq API (Cloud)
    └── OpenRouter API (Cloud)
```

### 10.2 API Integration Pattern

```
Service Layer
    │
    ├── Abstract provider interface
    ├── Provider-specific implementations
    ├── Unified response format
    └── Error handling wrapper
         │
         ↓
    Easy to add new providers
    ├── Implement base interface
    ├── Add configuration
    └── Register in service
```

---

## 11. Monitoring Architecture

### 11.1 Logging Strategy

```
Application Logs
    │
    ├── Request logs
    ├── Error logs
    ├── AI provider logs
    ├── Performance logs
    └── Security logs
         │
         ↓
    Log Storage
    │
    ├── Local files (development)
    ├── CloudWatch (production)
    └── Log rotation
```

### 11.2 Health Checks

```
Health Check Endpoint: /health
    │
    ├── Server status
    ├── AI provider availability
    ├── Disk space
    ├── Memory usage
    └── Response time
```

---

## 12. Technology Rationale

### 12.1 Frontend Technology Choices

| Technology | Reason |
|------------|--------|
| HTML5/CSS3/Vanilla JS | No build step, simple deployment |
| Chart.js | Powerful, flexible, well-documented |
| PapaParse | Robust CSV parsing, handles edge cases |
| jsPDF | Client-side PDF generation |
| Font Awesome | Comprehensive icon library |
| Google Fonts | Professional typography |
| AOS | Simple scroll animations |

### 12.2 Backend Technology Choices

| Technology | Reason |
|------------|--------|
| Node.js | Fast I/O, JavaScript ecosystem |
| Express.js | Minimal, flexible, well-supported |
| Multer | File upload handling |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |
| Helmet | Security headers |
| Express Validator | Input validation |

### 12.3 AI Provider Choices

| Provider | Reason |
|----------|--------|
| Ollama | Local, no API limits, free |
| Groq | Fast, reliable cloud backup |
| OpenRouter | Access to multiple models, free tier |

---

## 13. Architecture Principles

### 13.1 SOLID Principles

- **S**ingle Responsibility: Each module has one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Providers are interchangeable
- **I**nterface Segregation: Specific interfaces for specific needs
- **D**ependency Inversion: Depend on abstractions, not concretions

### 13.2 Additional Principles

- **DRY** (Don't Repeat Yourself): Reusable components
- **KISS** (Keep It Simple): Simple solutions
- **YAGNI** (You Aren't Gonna Need It): Build what's needed
- **Separation of Concerns**: Clear layer boundaries
- **Loose Coupling**: Minimal dependencies between modules

---

## 14. Conclusion

This architecture provides a solid foundation for AI Data Explainer+. The three-tier architecture with provider-based AI integration ensures reliability, scalability, and maintainability. The design supports current requirements while being flexible enough for future enhancements.

**Next Phase:** Database Decision
