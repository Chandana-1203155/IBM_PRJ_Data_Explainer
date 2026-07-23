# Folder Structure
## AI Data Explainer+ - Project Organization

---

## 1. Root Directory Structure

```
AI-Data-Explainer-Plus/
├── frontend/                    # Frontend application
├── backend/                     # Backend application
├── docs/                        # Documentation
├── docker/                      # Docker configurations
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment variables template
├── docker-compose.yml           # Docker compose configuration
├── Dockerfile                   # Docker image configuration
├── README.md                    # Project documentation
└── LICENSE                      # License file
```

---

## 2. Frontend Directory Structure

```
frontend/
├── index.html                   # Main HTML entry point
├── assets/                      # Static assets
│   ├── images/                  # Images and logos
│   │   ├── logo.png
│   │   ├── hero-bg.jpg
│   │   └── favicon.ico
│   ├── fonts/                   # Custom fonts (if any)
│   └── icons/                   # Custom icons (if any)
├── css/                         # Stylesheets
│   ├── main.css                 # Main stylesheet
│   ├── landing.css              # Landing page styles
│   ├── dashboard.css            # Dashboard styles
│   ├── components.css           # Reusable component styles
│   ├── theme.css                # Dark/Light theme styles
│   └── animations.css           # Animation styles
├── js/                          # JavaScript files
│   ├── main.js                  # Main JavaScript entry point
│   ├── app.js                   # Application initialization
│   ├── utils/                   # Utility functions
│   │   ├── api.js               # API communication
│   │   ├── validators.js        # Input validators
│   │   ├── formatters.js        # Data formatters
│   │   └── helpers.js           # Helper functions
│   ├── components/              # Reusable components
│   │   ├── navbar.js            # Navigation component
│   │   ├── sidebar.js           # Sidebar component
│   │   ├── upload.js            # File upload component
│   │   ├── charts.js            # Chart component
│   │   ├── chat.js              # Chat interface component
│   │   ├── theme-toggle.js      # Theme toggle component
│   │   ├── toast.js             # Toast notification component
│   │   └── loading.js           # Loading skeleton component
│   ├── pages/                   # Page-specific logic
│   │   ├── landing.js           # Landing page logic
│   │   └── dashboard.js         # Dashboard page logic
│   └── services/                # Frontend services
│       ├── dataset-service.js   # Dataset management
│       ├── chart-service.js     # Chart generation
│       └── report-service.js    # PDF generation
└── lib/                         # External libraries
    ├── chart.js                 # Chart.js library
    ├── papaparse.js             # PapaParse library
    ├── jspdf.js                 # jsPDF library
    ├── jspdf-autotable.js       # jsPDF autoTable plugin
    └── aos.js                   # AOS animations library
```

---

## 3. Backend Directory Structure

```
backend/
├── server.js                    # Express server entry point
├── app.js                       # Express app configuration
├── config/                      # Configuration files
│   ├── env.js                   # Environment configuration
│   ├── ai-providers.js          # AI provider configuration
│   └── constants.js             # Application constants
├── routes/                      # API route definitions
│   ├── index.js                 # Route aggregator
│   ├── upload.js                # File upload routes
│   ├── analyze.js               # Dataset analysis routes
│   ├── insights.js              # AI insights routes
│   ├── chat.js                  # Chat with data routes
│   ├── recommendations.js       # Recommendations routes
│   └── report.js                # PDF report routes
├── controllers/                 # Request handlers
│   ├── uploadController.js      # File upload controller
│   ├── analyzeController.js     # Dataset analysis controller
│   ├── insightsController.js    # AI insights controller
│   ├── chatController.js        # Chat controller
│   ├── recommendationsController.js  # Recommendations controller
│   └── reportController.js      # PDF report controller
├── services/                    # Business logic
│   ├── fileService.js           # File processing service
│   ├── analysisService.js       # Data analysis service
│   ├── visualizationService.js  # Chart data preparation service
│   ├── aiService.js             # AI orchestration service
│   └── reportService.js         # PDF generation service
├── providers/                   # AI provider implementations
│   ├── baseProvider.js          # Base provider interface
│   ├── ollamaProvider.js        # Ollama provider
│   ├── groqProvider.js          # Groq provider
│   └── openRouterProvider.js    # OpenRouter provider
├── middleware/                  # Express middleware
│   ├── errorHandler.js          # Global error handler
│   ├── uploadMiddleware.js      # File upload middleware
│   ├── validationMiddleware.js  # Request validation middleware
│   ├── securityMiddleware.js    # Security middleware
│   └── logger.js                # Logging middleware
├── utils/                       # Utility functions
│   ├── fileParser.js            # File parsing utilities
│   ├── dataAnalyzer.js          # Data analysis utilities
│   ├── statistics.js            # Statistical calculations
│   ├── promptBuilder.js         # AI prompt building
│   ├── responseFormatter.js     # Response formatting
│   └── cleanup.js               # Cleanup utilities
├── prompts/                     # AI prompt templates
│   ├── insightsPrompt.js        # Insights generation prompt
│   ├── chatPrompt.js            # Chat with data prompt
│   └── recommendationsPrompt.js # Recommendations prompt
├── uploads/                     # Temporary file storage
│   └── .gitkeep                 # Keep directory in git
├── reports/                     # Temporary report storage
│   └── .gitkeep                 # Keep directory in git
└── logs/                        # Application logs
    └── .gitkeep                 # Keep directory in git
```

---

## 4. Documentation Directory Structure

```
docs/
├── 01_REQUIREMENT_ANALYSIS.md   # Requirements document
├── 02_FEATURE_PLANNING.md       # Feature specification
├── 03_WORKFLOW_APPLICATION_FLOW.md  # Workflow documentation
├── 04_FOLDER_STRUCTURE.md       # Folder structure (this file)
├── 05_ARCHITECTURE.md           # System architecture
├── 06_DATABASE_DECISION.md      # Database decision
├── 07_UI_WIREFRAME.md           # UI wireframes
├── 08_PROMPT_STRATEGY.md        # Prompt engineering strategy
├── 09_API_DOCUMENTATION.md      # API documentation
├── 10_INSTALLATION_GUIDE.md     # Installation guide
├── 11_DEPLOYMENT_GUIDE.md       # Deployment guide
├── 12_TESTING_GUIDE.md          # Testing guide
└── 13_FUTURE_ENHANCEMENTS.md    # Future enhancements
```

---

## 5. Docker Directory Structure

```
docker/
├── Dockerfile.backend           # Backend Dockerfile
├── Dockerfile.frontend          # Frontend Dockerfile
├── nginx.conf                   # Nginx configuration
└── docker-compose.prod.yml      # Production docker-compose
```

---

## 6. File Naming Conventions

### 6.1 JavaScript Files
- **CamelCase:** `fileName.js`
- **Components:** `componentName.js`
- **Services:** `serviceName.js`
- **Controllers:** `controllerName.js`
- **Utilities:** `utilityName.js`

### 6.2 CSS Files
- **kebab-case:** `file-name.css`
- **Components:** `component-name.css`
- **Pages:** `page-name.css`

### 6.3 Documentation Files
- **SCREAMING_SNAKE_CASE:** `01_DOCUMENT_NAME.md`
- Numbered for ordering

### 6.4 Configuration Files
- **kebab-case:** `file-name.json` or `file-name.yml`

---

## 7. File Responsibilities

### 7.1 Frontend Files

#### Entry Points
- `index.html`: Main HTML structure
- `js/main.js`: Application entry point
- `css/main.css`: Global styles

#### Components
- `js/components/*.js`: Reusable UI components
- `css/components.css`: Component styles

#### Pages
- `js/pages/*.js`: Page-specific logic
- `css/landing.css`: Landing page styles
- `css/dashboard.css`: Dashboard styles

#### Services
- `js/services/*.js`: Frontend business logic
- `js/utils/*.js`: Utility functions

#### Libraries
- `frontend/lib/`: Third-party libraries (not in npm)

### 7.2 Backend Files

#### Entry Points
- `server.js`: Server startup
- `app.js`: Express app configuration

#### Configuration
- `config/*.js`: All configuration settings

#### Routes
- `routes/*.js`: API endpoint definitions
- `routes/index.js`: Route aggregation

#### Controllers
- `controllers/*.js`: Request handling logic

#### Services
- `services/*.js`: Business logic implementation

#### Providers
- `providers/*.js`: AI provider implementations
- `providers/baseProvider.js`: Provider interface

#### Middleware
- `middleware/*.js`: Express middleware

#### Utilities
- `utils/*.js`: Helper functions

#### Prompts
- `prompts/*.js`: AI prompt templates

### 7.3 Documentation Files

Each documentation file covers a specific aspect of the project:
- Requirements, features, workflow
- Architecture, database, UI
- Prompts, API, installation
- Deployment, testing, enhancements

---

## 8. File Dependencies

### 8.1 Frontend Dependencies

```
index.html
    ├── css/main.css
    ├── css/landing.css
    ├── css/dashboard.css
    ├── css/components.css
    ├── css/theme.css
    ├── css/animations.css
    ├── js/main.js
    ├── js/app.js
    ├── js/pages/landing.js
    ├── js/pages/dashboard.js
    ├── js/components/*.js
    ├── js/utils/*.js
    ├── js/services/*.js
    └── lib/*.js
```

### 8.2 Backend Dependencies

```
server.js
    ├── app.js
    │   ├── config/*.js
    │   ├── routes/*.js
    │   │   ├── controllers/*.js
    │   │   │   ├── services/*.js
    │   │   │   │   ├── providers/*.js
    │   │   │   │   └── utils/*.js
    │   │   │   └── middleware/*.js
    │   │   └── middleware/*.js
    │   └── middleware/*.js
    └── config/*.js
```

---

## 9. Temporary Directories

### 9.1 Uploads Directory
- **Purpose:** Temporary storage for uploaded files
- **Cleanup:** Automatic cleanup after session
- **Git:** Ignored (in .gitignore)
- **Location:** `backend/uploads/`

### 9.2 Reports Directory
- **Purpose:** Temporary storage for generated PDFs
- **Cleanup:** Automatic cleanup after download
- **Git:** Ignored (in .gitignore)
- **Location:** `backend/reports/`

### 9.3 Logs Directory
- **Purpose:** Application logs
- **Rotation:** Log rotation configured
- **Git:** Ignored (in .gitignore)
- **Location:** `backend/logs/`

---

## 10. Environment Files

### 10.1 .env.example
Template for environment variables (committed to git)

### 10.2 .env
Actual environment variables (not committed to git)

### 10.3 Environment Variables
```
# Server
PORT=3000
NODE_ENV=development

# AI Provider
AI_PROVIDER=ollama

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Groq
GROQ_API_KEY=your_groq_api_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./backend/uploads

# Report
REPORT_DIR=./backend/reports
```

---

## 11. Git Structure

### 11.1 .gitignore
```
# Dependencies
node_modules/
package-lock.json

# Environment
.env

# Temporary files
backend/uploads/*
backend/reports/*
backend/logs/*
!backend/uploads/.gitkeep
!backend/reports/.gitkeep
!backend/logs/.gitkeep

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 11.2 Repository Structure
```
main branch
    ├── Initial commit (folder structure)
    ├── Phase 2 (Landing page & UI)
    ├── Phase 3 (Backend)
    ├── Phase 4 (Upload module)
    ├── Phase 5 (Charts & statistics)
    ├── Phase 6 (AI integration)
    ├── Phase 7 (Chat with data)
    ├── Phase 8 (PDF generator)
    ├── Phase 9 (Testing & optimization)
    └── Phase 10 (Docker & deployment)
```

---

## 12. Module Organization Principles

### 12.1 Separation of Concerns
- **Routes:** Define endpoints only
- **Controllers:** Handle requests and responses
- **Services:** Implement business logic
- **Providers:** Implement AI provider specifics
- **Utils:** Reusable helper functions

### 12.2 Reusability
- **Components:** Reusable UI components
- **Services:** Reusable business logic
- **Utils:** Reusable utilities
- **Prompts:** Reusable prompt templates

### 12.3 Scalability
- **Modular structure:** Easy to add new features
- **Provider pattern:** Easy to add new AI providers
- **Service layer:** Easy to modify business logic
- **Configuration:** Centralized configuration

---

## 13. File Size Guidelines

### 13.1 JavaScript Files
- **Maximum:** 500 lines per file
- **Preferred:** 200-300 lines
- **Split:** If larger, split into smaller modules

### 13.2 CSS Files
- **Maximum:** 1000 lines per file
- **Preferred:** 300-500 lines
- **Split:** If larger, split by component/feature

### 13.3 Documentation Files
- **No strict limit**
- **Organized by sections**
- **Use headers for navigation**

---

## 14. Import/Export Patterns

### 14.1 Frontend ES6 Modules
```javascript
// Named exports
export const functionName = () => {};
export const variableName = value;

// Default export
export default class ClassName {};

// Import
import { functionName, variableName } from './file.js';
import ClassName from './file.js';
```

### 14.2 Backend CommonJS
```javascript
// Named exports
exports.functionName = () => {};
exports.variableName = value;

// Default export
module.exports = ClassName;

// Import
const { functionName, variableName } = require('./file');
const ClassName = require('./file');
```

---

## 15. Conclusion

This folder structure provides a clean, modular, and scalable organization for AI Data Explainer+. The separation of concerns, clear naming conventions, and logical grouping ensure maintainability and ease of development. The structure supports both current requirements and future enhancements.

**Next Phase:** Architecture Diagram
