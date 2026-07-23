// API Communication Utility - AI Data Explainer+

const API = {
    get baseURL() {
        const localHosts = ['localhost', '127.0.0.1', '::1'];
        if (localHosts.includes(window.location.hostname)) {
            return 'http://localhost:3000/api';
        }
        return '/api';
    },

    async upload(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
                // Don't set Content-Type header for FormData - browser sets it automatically with boundary
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Upload error:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            throw error;
        }
    },

    async analyze(sessionId) {
        try {
            console.log('API.analyze called with sessionId:', sessionId);
            
            const response = await fetch(`${this.baseURL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Analysis API error:', errorData);
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();
            console.log('Analysis API response:', data);
            return data;
        } catch (error) {
            console.error('Analysis error:', error);
            throw error;
        }
    },

    async getInsights(sessionId) {
        try {
            console.log('API.getInsights called with sessionId:', sessionId);
            
            const response = await fetch(`${this.baseURL}/insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId })
            });

            if (!response.ok) {
                throw new Error('Insights generation failed');
            }

            return response;
        } catch (error) {
            console.error('Insights error:', error);
            throw error;
        }
    },

    async chat(sessionId, question) {
        try {
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId, question })
            });

            if (!response.ok) {
                throw new Error('Chat failed');
            }

            return response;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },

    async getChatHistory(sessionId) {
        try {
            const response = await fetch(`${this.baseURL}/chat/history/${sessionId}`);
            if (!response.ok) {
                throw new Error('Failed to load chat history');
            }
            return response.json();
        } catch (error) {
            console.error('Chat history error:', error);
            throw error;
        }
    },

    async clearChatHistory(sessionId) {
        try {
            const response = await fetch(`${this.baseURL}/chat/history/${sessionId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to clear chat history');
            }
            return response.json();
        } catch (error) {
            console.error('Clear chat history error:', error);
            throw error;
        }
    },

    async getRecommendations(sessionId) {
        try {
            console.log('API.getRecommendations called with sessionId:', sessionId);
            
            const response = await fetch(`${this.baseURL}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId })
            });

            if (!response.ok) {
                throw new Error('Recommendations generation failed');
            }

            return response;
        } catch (error) {
            console.error('Recommendations error:', error);
            throw error;
        }
    },

    async generateReport(sessionId, chartImages = []) {
        try {
            const response = await fetch(`${this.baseURL}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId, chartImages })
            });

            if (!response.ok) {
                throw new Error('Report generation failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Report error:', error);
            throw error;
        }
    },

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            if (!response.ok) {
                throw new Error('Health check failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }
};
