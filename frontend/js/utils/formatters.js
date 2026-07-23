// Data Formatters - AI Data Explainer+

const Formatters = {
    formatNumber(num, decimals = 2) {
        if (num === null || num === undefined) {
            return 'N/A';
        }
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    formatPercentage(value, decimals = 1) {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        return (value * 100).toFixed(decimals) + '%';
    },

    formatDate(date) {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatDateTime(date) {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatCurrency(value, currency = 'USD') {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(value);
    },

    truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    formatColumnValue(value, type) {
        if (value === null || value === undefined) {
            return 'N/A';
        }

        switch (type) {
            case 'number':
                return this.formatNumber(value);
            case 'currency':
                return this.formatCurrency(value);
            case 'percentage':
                return this.formatPercentage(value);
            case 'date':
                return this.formatDate(value);
            default:
                return String(value);
        }
    }
};
