// Report Service - AI Data Explainer+

const ReportService = {
    async generate(sessionId) {
        if (!sessionId) {
            throw new Error('No active session');
        }

        try {
            const response = await API.generateReport(sessionId);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.error || 'Report generation failed');
        } catch (error) {
            console.error('Report generation error:', error);
            throw error;
        }
    },

    async download(reportUrl, filename) {
        const response = await fetch(reportUrl);
        if (!response.ok) {
            throw new Error('Failed to download report');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
    }
};
