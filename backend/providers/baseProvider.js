// Base AI Provider Interface - AI Data Explainer+

class BaseProvider {
    constructor(config) {
        this.config = config;
        this.name = config.name;
        this.type = config.type;
        this.priority = config.priority;
    }

    async generateResponse(prompt) {
        throw new Error('generateResponse must be implemented by subclass');
    }

    async streamResponse(prompt, onChunk) {
        throw new Error('streamResponse must be implemented by subclass');
    }

    async isAvailable() {
        throw new Error('isAvailable must be implemented by subclass');
    }

    validateConfig() {
        throw new Error('validateConfig must be implemented by subclass');
    }
}

module.exports = BaseProvider;
