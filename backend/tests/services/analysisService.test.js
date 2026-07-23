// Analysis Service Tests - AI Data Explainer+

const analysisService = require('../../services/analysisService');

describe('AnalysisService', () => {
    test('should analyze a dataset and return statistics', () => {
        const dataset = {
            data: [
                { age: 10, city: 'A' },
                { age: 20, city: 'B' },
                { age: 30, city: 'A' }
            ],
            metadata: {
                columnTypes: {
                    age: 'numeric',
                    city: 'categorical'
                },
                uniqueValues: {
                    age: 3,
                    city: 2
                }
            }
        };

        const result = analysisService.analyzeDataset(dataset);

        expect(result.statistics.numeric.age.mean).toBe(20);
        expect(result.statistics.categorical.city.mode).toBe('A');
        expect(result.duplicateRows).toBe(0);
        expect(result.uniqueValues.age).toBe(3);
    });
});
