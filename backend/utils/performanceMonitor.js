// Performance Monitor - AI Data Explainer+

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.alerts = [];
        this.thresholds = {
            responseTime: 5000, // 5 seconds
            memoryUsage: 100 * 1024 * 1024, // 100MB
            errorRate: 0.1 // 10%
        };
    }

    recordRequest(endpoint, duration, success = true) {
        if (!this.metrics.has(endpoint)) {
            this.metrics.set(endpoint, {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                totalDuration: 0,
                minDuration: Infinity,
                maxDuration: 0,
                errors: []
            });
        }

        const metric = this.metrics.get(endpoint);
        metric.totalRequests++;
        metric.totalDuration += duration;
        
        if (success) {
            metric.successfulRequests++;
        } else {
            metric.failedRequests++;
        }

        metric.minDuration = Math.min(metric.minDuration, duration);
        metric.maxDuration = Math.max(metric.maxDuration, duration);

        // Check for performance issues
        if (duration > this.thresholds.responseTime) {
            this.alerts.push({
                type: 'slow_request',
                endpoint,
                duration,
                timestamp: new Date()
            });
        }

        // Check error rate
        const errorRate = metric.failedRequests / metric.totalRequests;
        if (errorRate > this.thresholds.errorRate) {
            this.alerts.push({
                type: 'high_error_rate',
                endpoint,
                errorRate,
                timestamp: new Date()
            });
        }
    }

    getMetrics(endpoint) {
        if (endpoint) {
            const metric = this.metrics.get(endpoint);
            if (!metric) return null;

            return {
                ...metric,
                averageDuration: metric.totalDuration / metric.totalRequests,
                errorRate: metric.failedRequests / metric.totalRequests
            };
        }

        const allMetrics = {};
        this.metrics.forEach((metric, key) => {
            allMetrics[key] = {
                ...metric,
                averageDuration: metric.totalDuration / metric.totalRequests,
                errorRate: metric.failedRequests / metric.totalRequests
            };
        });

        return allMetrics;
    }

    getAlerts(limit = 50) {
        return this.alerts.slice(-limit);
    }

    clearAlerts() {
        this.alerts = [];
    }

    resetMetrics(endpoint) {
        if (endpoint) {
            this.metrics.delete(endpoint);
        } else {
            this.metrics.clear();
        }
    }

    getSystemMetrics() {
        const usage = process.memoryUsage();
        return {
            heapUsed: usage.heapUsed,
            heapTotal: usage.heapTotal,
            external: usage.external,
            rss: usage.rss,
            heapUsedMB: (usage.heapUsed / 1024 / 1024).toFixed(2),
            heapTotalMB: (usage.heapTotal / 1024 / 1024).toFixed(2),
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage()
        };
    }
}

module.exports = new PerformanceMonitor();
