// Ollama Provider - AI Data Explainer+

const BaseProvider = require('./baseProvider');
const axios = require('axios');
const env = require('../config/env');

class OllamaProvider extends BaseProvider {
    constructor(config) {
        super(config);
        this.url = config.url;
        this.model = config.model;
        this.requestCount = 0;
        this.errorCount = 0;
    }

    async generateResponse(prompt, options = {}) {
        this.requestCount++;
        
        try {
            const response = await axios.post(`${this.url}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: options.temperature || 0.7,
                    num_predict: options.maxTokens || 4096,
                    top_p: options.topP || 0.9,
                    top_k: options.topK || 40
                }
            }, {
                timeout: options.timeout || 120000
            });

            return response.data.response;
        } catch (error) {
            this.errorCount++;
            console.error('Ollama API error:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama service is not running. Please start Ollama.');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Ollama request timed out');
            } else if (error.response?.status === 404) {
                throw new Error(`Ollama model '${this.model}' not found. Please pull the model first.`);
            }
            
            throw new Error(`Ollama provider unavailable: ${error.message}`);
        }
    }

    async streamResponse(prompt, onChunk, options = {}) {
        this.requestCount++;
        
        try {
            const response = await axios.post(`${this.url}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: true,
                options: {
                    temperature: options.temperature || 0.7,
                    num_predict: options.maxTokens || 4096,
                    top_p: options.topP || 0.9,
                    top_k: options.topK || 40
                }
            }, {
                responseType: 'stream',
                timeout: options.timeout || 120000
            });

            let buffer = '';
            response.data.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            onChunk(data.response);
                        }
                        if (data.done) {
                            onChunk(null); // Signal end of stream
                        }
                    } catch (e) {
                        // Skip invalid JSON until full line is buffered
                    }
                }
            });

            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    if (buffer.trim()) {
                        try {
                            const data = JSON.parse(buffer);
                            if (data.response) {
                                onChunk(data.response);
                            }
                            if (data.done) {
                                onChunk(null);
                            }
                        } catch (e) {
                            // Ignore incomplete final chunk
                        }
                    }
                    resolve();
                });
                response.data.on('error', reject);
            });
        } catch (error) {
            this.errorCount++;
            console.error('Ollama streaming error:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama service is not running. Please start Ollama.');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Ollama request timed out');
            } else if (error.response?.status === 404) {
                throw new Error(`Ollama model '${this.model}' not found. Please pull the model first.`);
            }
            
            throw new Error(`Ollama provider unavailable: ${error.message}`);
        }
    }

    async isAvailable() {
        try {
            const response = await axios.get(`${this.url}/api/tags`, {
                timeout: 5000
            });
            if (response.status === 200) {
                // Check if the specific model is available
                const models = response.data.models || [];
                const modelExists = models.some(m => m.name.includes(this.model));
                return modelExists;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    validateConfig() {
        if (!this.url) {
            throw new Error('Ollama URL is required');
        }
        if (!this.model) {
            throw new Error('Ollama model is required');
        }
        return true;
    }

    getStats() {
        return {
            name: this.name,
            type: this.type,
            priority: this.priority,
            requestCount: this.requestCount,
            errorCount: this.errorCount,
            successRate: this.requestCount > 0 
                ? ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(2) + '%' 
                : 'N/A'
        };
    }
}

module.exports = OllamaProvider;
