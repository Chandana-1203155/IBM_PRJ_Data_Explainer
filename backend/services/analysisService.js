// Analysis Service - AI Data Explainer+

const statistics = require('../utils/statistics');
const visualizationService = require('../services/visualizationService');

class AnalysisService {
    analyzeDataset(dataset) {
        const { data, metadata } = dataset;
        
        const numericStats = this.calculateNumericStatistics(data, metadata);
        const duplicateRows = this.countDuplicates(data);
        
        return {
            statistics: {
                numeric: numericStats,
                categorical: this.calculateCategoricalStatistics(data, metadata)
            },
            duplicateRows,
            uniqueValues: metadata.uniqueValues,
            charts: visualizationService.generateChartConfigurations({ data, metadata })
        };
    }

    calculateNumericStatistics(data, metadata) {
        const stats = {};
        const numericColumns = Object.keys(metadata.columnTypes).filter(
            col => metadata.columnTypes[col] === 'numeric'
        );

        numericColumns.forEach(col => {
            const values = data.map(row => row[col]).filter(v => typeof v === 'number' && !isNaN(v));
            
            if (values.length > 0) {
                stats[col] = {
                    mean: statistics.mean(values),
                    median: statistics.median(values),
                    mode: statistics.mode(values),
                    min: Math.min(...values),
                    max: Math.max(...values),
                    std: statistics.standardDeviation(values)
                };
            }
        });

        return stats;
    }

    calculateCategoricalStatistics(data, metadata) {
        const stats = {};
        const categoricalColumns = Object.keys(metadata.columnTypes).filter(
            col => metadata.columnTypes[col] === 'categorical'
        );

        categoricalColumns.forEach(col => {
            const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined);
            const mode = statistics.mode(values);
            
            stats[col] = {
                mode: mode,
                unique: metadata.uniqueValues[col]
            };
        });

        return stats;
    }

    countDuplicates(data) {
        const seen = new Set();
        let duplicates = 0;

        data.forEach(row => {
            const key = JSON.stringify(row);
            if (seen.has(key)) {
                duplicates++;
            } else {
                seen.add(key);
            }
        });

        return duplicates;
    }
}

module.exports = new AnalysisService();
