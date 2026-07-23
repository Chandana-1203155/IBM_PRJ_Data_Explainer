// Groq Provider - AI Data Explainer+

const BaseProvider = require('./baseProvider');
const axios = require('axios');

class GroqProvider extends BaseProvider {
    constructor(config) {
        super(config);
        this.apiKey = config.apiKey;
        this.url = config.url;
        this.models = config.models;
        this.requestCount = 0;
        this.errorCount = 0;
    }

    async generateResponse(prompt, options = {}) {
        this.requestCount++;
        
        try {
            const response = await axios.post(this.url, {
                model: options.model || this.models[0],
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 4096,
                top_p: options.topP || 1
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: options.timeout || 120000
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            this.errorCount++;
            console.error('Groq API error:', error.message);
            
            if (error.response?.status === 401) {
                throw new Error('Invalid Groq API key. Please check your credentials.');
            } else if (error.response?.status === 429) {
                throw new Error('Groq API rate limit exceeded. Please try again later.');
            } else if (error.response?.status === 500) {
                throw new Error('Groq API internal error. Please try again later.');
            }
            
            throw new Error(`Groq provider unavailable: ${error.message}`);
        }
    }

    async streamResponse(prompt, onChunk, options = {}) {
        this.requestCount++;
        
        try {
            const response = await axios.post(this.url, {
                model: options.model || this.models[0],
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 4096,
                top_p: options.topP || 1,
                stream: true
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream',
                timeout: options.timeout || 120000
            });

            response.data.on('data', (chunk) => {
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            onChunk(null); // Signal end of stream
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                onChunk(parsed.choices[0].delta.content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                });
            });

            return new Promise((resolve, reject) => {
                response.data.on('end', resolve);
                response.data.on('error', reject);
            });
        } catch (error) {
            this.errorCount++;
            console.error('Groq streaming error:', error.message);
            
            if (error.response?.status === 401) {
                throw new Error('Invalid Groq API key. Please check your credentials.');
            } else if (error.response?.status === 429) {
                throw new Error('Groq API rate limit exceeded. Please try again later.');
            } else if (error.response?.status === 500) {
                throw new Error('Groq API internal error. Please try again later.');
            }
            
            throw new Error(`Groq provider unavailable: ${error.message}`);
        }
    }

    async isAvailable() {
        if (!this.apiKey) {
            return false;
        }
        try {
            const response = await axios.post(this.url, {
                model: this.models[0],
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 10
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    validateConfig() {
        if (!this.apiKey) {
            throw new Error('Groq API key is required');
        }
        if (!this.url) {
            throw new Error('Groq API URL is required');
        }
        if (!this.models || this.models.length === 0) {
            throw new Error('Groq models list is required');
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

module.exports = GroqProvider;
