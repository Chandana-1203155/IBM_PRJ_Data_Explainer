// AI Provider Service - AI Data Explainer+

const env = require('../config/env');
const { getProviderConfig, getAllProviders } = require('../config/ai-providers');
const OllamaProvider = require('../providers/ollamaProvider');
const GroqProvider = require('../providers/groqProvider');
const OpenRouterProvider = require('../providers/openRouterProvider');

class AIProviderService {
    constructor() {
        this.providers = [];
        this.currentProviderIndex = 0;
        this.healthCheckInterval = null;
        this.initializeProviders();
        this.startHealthChecks();
    }

    initializeProviders() {
        // Initialize all available providers
        const allProviders = getAllProviders();
        
        allProviders.forEach(config => {
            let provider;
            
            switch (config.name.toLowerCase()) {
                case 'ollama':
                    provider = new OllamaProvider(config);
                    break;
                case 'groq':
                    provider = new GroqProvider(config);
                    break;
                case 'openrouter':
                    provider = new OpenRouterProvider(config);
                    break;
                default:
                    console.warn(`Unknown provider: ${config.name}`);
                    return;
            }

            // Validate and add provider
            try {
                provider.validateConfig();
                this.providers.push(provider);
                console.log(`Initialized provider: ${config.name} (Priority: ${config.priority})`);
            } catch (error) {
                console.warn(`Failed to initialize ${config.name}:`, error.message);
            }
        });

        // Sort providers by priority
        this.providers.sort((a, b) => a.priority - b.priority);

        // Set initial provider based on environment
        this.setPrimaryProvider();
    }

    setPrimaryProvider() {
        const primaryName = env.aiProvider.toLowerCase();
        const primaryIndex = this.providers.findIndex(p => p.name.toLowerCase() === primaryName);
        
        if (primaryIndex !== -1) {
            this.currentProviderIndex = primaryIndex;
            console.log(`Primary provider set to: ${this.providers[primaryIndex].name}`);
        } else {
            console.warn(`Provider ${env.aiProvider} not available, using first available`);
            this.currentProviderIndex = 0;
        }
    }

    async generateResponse(prompt, options = {}) {
        const maxRetries = this.providers.length;
        let lastError = null;
        const startTime = Date.now();

        for (let i = 0; i < maxRetries; i++) {
            const provider = this.providers[this.currentProviderIndex];
            
            try {
                console.log(`[${new Date().toISOString()}] Attempting to use provider: ${provider.name} (Attempt ${i + 1}/${maxRetries})`);
                const response = await provider.generateResponse(prompt, options);
                const duration = Date.now() - startTime;
                console.log(`[${new Date().toISOString()}] Successfully used provider: ${provider.name} (${duration}ms)`);
                return {
                    response,
                    provider: provider.name,
                    duration
                };
            } catch (error) {
                console.error(`[${new Date().toISOString()}] Provider ${provider.name} failed:`, error.message);
                lastError = error;
                this.switchToNextProvider();
                // Add delay before retry
                await this.delay(1000 * (i + 1));
            }
        }

        throw new Error(`All AI providers are unavailable. Last error: ${lastError?.message}`);
    }

    async streamResponse(prompt, onChunk, options = {}) {
        const maxRetries = this.providers.length;
        let lastError = null;
        const startTime = Date.now();

        for (let i = 0; i < maxRetries; i++) {
            const provider = this.providers[this.currentProviderIndex];
            
            try {
                console.log(`[${new Date().toISOString()}] Attempting to use provider for streaming: ${provider.name} (Attempt ${i + 1}/${maxRetries})`);
                await provider.streamResponse(prompt, onChunk, options);
                const duration = Date.now() - startTime;
                console.log(`[${new Date().toISOString()}] Successfully used provider for streaming: ${provider.name} (${duration}ms)`);
                return {
                    provider: provider.name,
                    duration
                };
            } catch (error) {
                console.error(`[${new Date().toISOString()}] Provider ${provider.name} failed for streaming:`, error.message);
                lastError = error;
                this.switchToNextProvider();
                // Add delay before retry
                await this.delay(1000 * (i + 1));
            }
        }

        throw new Error(`All AI providers are unavailable for streaming. Last error: ${lastError?.message}`);
    }

    switchToNextProvider() {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
        console.log(`[${new Date().toISOString()}] Switched to provider: ${this.providers[this.currentProviderIndex].name}`);
    }

    getCurrentProvider() {
        return this.providers[this.currentProviderIndex];
    }

    async checkProviderHealth() {
        const healthStatus = {};
        const results = await Promise.allSettled(
            this.providers.map(async provider => {
                const isAvailable = await provider.isAvailable();
                return { name: provider.name, available: isAvailable };
            })
        );

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                healthStatus[result.value.name] = result.value.available;
            }
        });

        return healthStatus;
    }

    async startHealthChecks() {
        // Run health checks every 5 minutes
        this.healthCheckInterval = setInterval(async () => {
            try {
                const health = await this.checkProviderHealth();
                console.log(`[${new Date().toISOString()}] Provider health check:`, health);
                
                // If current provider is unhealthy, switch to next available
                const currentProvider = this.getCurrentProvider();
                if (!health[currentProvider.name]) {
                    console.warn(`Current provider ${currentProvider.name} is unhealthy, switching...`);
                    this.switchToNextProvider();
                }
            } catch (error) {
                console.error('Health check failed:', error);
            }
        }, 5 * 60 * 1000);
    }

    stopHealthChecks() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getProviderStats() {
        return {
            totalProviders: this.providers.length,
            currentIndex: this.currentProviderIndex,
            currentProvider: this.getCurrentProvider()?.name,
            allProviders: this.providers.map(p => p.name)
        };
    }
}

// Singleton instance
const aiProviderService = new AIProviderService();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down AI Provider Service...');
    aiProviderService.stopHealthChecks();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Shutting down AI Provider Service...');
    aiProviderService.stopHealthChecks();
    process.exit(0);
});

module.exports = aiProviderService;
