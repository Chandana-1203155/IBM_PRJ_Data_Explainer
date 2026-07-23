// Dataset Service - AI Data Explainer+

const DatasetService = {
    currentDataset: null,
    sessionId: null,

    async upload(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await API.upload(file);
            if (response.success) {
                this.currentDataset = response.data;
                this.sessionId = response.sessionId;
                return response.data;
            }
            throw new Error(response.error || 'Upload failed');
        } catch (error) {
            console.error('Dataset upload error:', error);
            throw error;
        }
    },

    async analyze() {
        if (!this.sessionId) {
            throw new Error('No active session');
        }

        try {
            const response = await API.analyze(this.sessionId);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.error || 'Analysis failed');
        } catch (error) {
            console.error('Dataset analysis error:', error);
            throw error;
        }
    },

    async getInsights() {
        if (!this.sessionId) {
            throw new Error('No active session');
        }

        try {
            const response = await API.getInsights(this.sessionId);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.error || 'Insights generation failed');
        } catch (error) {
            console.error('Insights generation error:', error);
            throw error;
        }
    },

    getSessionId() {
        return this.sessionId;
    },

    getDataset() {
        return this.currentDataset;
    },

    clear() {
        this.currentDataset = null;
        this.sessionId = null;
    }
};
