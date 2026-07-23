// Application Constants - AI Data Explainer+

const constants = {
    // File validation
    ALLOWED_FILE_EXTENSIONS: ['.csv', '.xlsx'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    
    // Session management
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    
    // AI settings
    DEFAULT_TEMPERATURE: 0.7,
    MAX_TOKENS: 4096,
    
    // Response status
    STATUS: {
        SUCCESS: 'success',
        ERROR: 'error'
    },
    
    // HTTP status codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        PAYLOAD_TOO_LARGE: 413,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    },
    
    // Error messages
    ERRORS: {
        INVALID_FILE_TYPE: 'Invalid file type. Only CSV and Excel files are allowed.',
        FILE_TOO_LARGE: 'File size exceeds 10MB limit.',
        FILE_EMPTY: 'File is empty.',
        FILE_CORRUPTED: 'Unable to parse file. Please check if it is corrupted.',
        NO_FILE_UPLOADED: 'No file uploaded.',
        SESSION_NOT_FOUND: 'Session not found or expired.',
        AI_PROVIDER_UNAVAILABLE: 'AI services are currently unavailable.',
        ANALYSIS_FAILED: 'Analysis failed. Please try again.',
        REPORT_GENERATION_FAILED: 'Report generation failed. Please try again.'
    },
    
    // Data types
    DATA_TYPES: {
        NUMERIC: 'numeric',
        CATEGORICAL: 'categorical',
        DATE: 'date',
        BOOLEAN: 'boolean',
        TEXT: 'text'
    },
    
    // Chart types
    CHART_TYPES: {
        BAR: 'bar',
        PIE: 'pie',
        LINE: 'line',
        SCATTER: 'scatter',
        HISTOGRAM: 'histogram',
        BOX_PLOT: 'boxplot',
        HEATMAP: 'heatmap'
    },
    
    // Recommendation priorities
    PRIORITIES: {
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low'
    }
};

module.exports = constants;
