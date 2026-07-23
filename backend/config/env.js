// Environment Configuration - AI Data Explainer+

const path = require('path');
const dotenv = require('dotenv');

const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath, override: true });

const workspaceRoot = path.resolve(__dirname, '..', '..');
const resolveWorkspacePath = (value, fallbackRelativePath) => {
    if (!value) {
        return path.resolve(workspaceRoot, fallbackRelativePath);
    }

    if (path.isAbsolute(value)) {
        return value;
    }

    return path.resolve(workspaceRoot, value);
};

const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_URL || 'http://localhost:11434';

const env = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // AI Provider
    aiProvider: process.env.AI_PROVIDER || 'ollama',

    // Ollama
    ollamaBaseUrl,
    ollamaUrl: ollamaBaseUrl,
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',

    // Groq
    groqApiKey: process.env.GROQ_API_KEY,

    // OpenRouter
    openRouterApiKey: process.env.OPENROUTER_API_KEY,

    // File Upload
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    uploadDir: resolveWorkspacePath(process.env.UPLOAD_DIR, 'backend/uploads'),

    // Report
    reportDir: resolveWorkspacePath(process.env.REPORT_DIR, 'backend/reports'),

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || '*'
};

// Validate required environment variables
const validateEnv = () => {
    const required = [];
    
    if (!env.port) required.push('PORT');
    if (!env.aiProvider) required.push('AI_PROVIDER');
    
    if (env.aiProvider === 'groq' && !env.groqApiKey) {
        console.warn('Warning: GROQ_API_KEY not set when AI_PROVIDER is groq');
    }
    
    if (env.aiProvider === 'openrouter' && !env.openRouterApiKey) {
        console.warn('Warning: OPENROUTER_API_KEY not set when AI_PROVIDER is openrouter');
    }

    if (required.length > 0) {
        console.error('Missing required environment variables:', required.join(', '));
        process.exit(1);
    }
};

validateEnv();

module.exports = env;
