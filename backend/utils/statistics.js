// Statistics Utility - AI Data Explainer+

class Statistics {
    /**
     * Calculate the mean (average) of an array of numbers
     */
    mean(values) {
        if (!values || values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    /**
     * Calculate the median of an array of numbers
     */
    median(values) {
        if (!values || values.length === 0) return 0;
        
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        }
        return sorted[mid];
    }

    /**
     * Calculate the mode (most frequent value) of an array
     */
    mode(values) {
        if (!values || values.length === 0) return null;
        
        const frequency = {};
        let maxFreq = 0;
        let modes = [];
        
        values.forEach(val => {
            const key = String(val);
            frequency[key] = (frequency[key] || 0) + 1;
            if (frequency[key] > maxFreq) {
                maxFreq = frequency[key];
            }
        });
        
        Object.keys(frequency).forEach(key => {
            if (frequency[key] === maxFreq) {
                modes.push(key);
            }
        });
        
        // Return single mode or array of modes
        if (modes.length === 1) {
            return modes[0];
        }
        return modes;
    }

    /**
     * Calculate standard deviation
     */
    standardDeviation(values) {
        if (!values || values.length === 0) return 0;
        if (values.length === 1) return 0;
        
        const mean = this.mean(values);
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const avgSquaredDiff = this.mean(squaredDiffs);
        
        return Math.sqrt(avgSquaredDiff);
    }

    /**
     * Calculate variance
     */
    variance(values) {
        if (!values || values.length === 0) return 0;
        const stdDev = this.standardDeviation(values);
        return stdDev * stdDev;
    }

    /**
     * Calculate minimum value
     */
    min(values) {
        if (!values || values.length === 0) return 0;
        return Math.min(...values);
    }

    /**
     * Calculate maximum value
     */
    max(values) {
        if (!values || values.length === 0) return 0;
        return Math.max(...values);
    }

    /**
     * Calculate range (max - min)
     */
    range(values) {
        return this.max(values) - this.min(values);
    }

    /**
     * Calculate sum
     */
    sum(values) {
        if (!values || values.length === 0) return 0;
        return values.reduce((acc, val) => acc + val, 0);
    }

    /**
     * Calculate quartiles
     */
    quartiles(values) {
        if (!values || values.length === 0) return { q1: 0, q2: 0, q3: 0 };
        
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = this.percentile(sorted, 25);
        const q2 = this.percentile(sorted, 50);
        const q3 = this.percentile(sorted, 75);
        
        return { q1, q2, q3 };
    }

    /**
     * Calculate percentile
     */
    percentile(sortedValues, percentile) {
        if (!sortedValues || sortedValues.length === 0) return 0;
        
        const index = (percentile / 100) * (sortedValues.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        
        if (upper >= sortedValues.length) {
            return sortedValues[sortedValues.length - 1];
        }
        
        return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
    }

    /**
     * Calculate interquartile range (IQR)
     */
    iqr(values) {
        const { q1, q3 } = this.quartiles(values);
        return q3 - q1;
    }

    /**
     * Detect outliers using IQR method
     */
    detectOutliers(values) {
        if (!values || values.length === 0) return [];
        
        const { q1, q3 } = this.quartiles(values);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        return values.filter(val => val < lowerBound || val > upperBound);
    }

    /**
     * Calculate correlation coefficient between two arrays
     */
    correlation(x, y) {
        if (!x || !y || x.length !== y.length || x.length === 0) return 0;
        
        const n = x.length;
        const sumX = this.sum(x);
        const sumY = this.sum(y);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
        const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        if (denominator === 0) return 0;
        
        return numerator / denominator;
    }
}

module.exports = new Statistics();