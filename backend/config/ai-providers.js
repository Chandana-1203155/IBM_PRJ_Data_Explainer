// AI Provider Configuration - AI Data Explainer+

const env = require('./env');

const aiProviders = {
    ollama: {
        name: 'Ollama',
        url: env.ollamaBaseUrl,
        model: env.ollamaModel,
        type: 'local',
        priority: 1
    },
    groq: {
        name: 'Groq',
        apiKey: env.groqApiKey,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        type: 'cloud',
        priority: 2,
        models: ['llama3-70b-8192', 'mixtral-8x7b-32768']
    },
    openrouter: {
        name: 'OpenRouter',
        apiKey: env.openRouterApiKey,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        type: 'cloud',
        priority: 3,
        models: ['meta-llama/llama-3-8b-instruct:free', 'mistralai/mistral-7b-instruct:free']
    }
};

const getProviderConfig = (providerName) => {
    return aiProviders[providerName];
};

const getAllProviders = () => {
    return Object.values(aiProviders).sort((a, b) => a.priority - b.priority);
};

const getProviderPriority = (providerName) => {
    const provider = aiProviders[providerName];
    return provider ? provider.priority : Infinity;
};

module.exports = {
    aiProviders,
    getProviderConfig,
    getAllProviders,
    getProviderPriority
};
