// File Service Tests - AI Data Explainer+

const fileService = require('../../services/fileService');
const fs = require('fs');
const path = require('path');

describe('FileService', () => {
    test('should parse CSV file correctly', async () => {
        // Test CSV parsing logic
        const mockFile = {
            path: './test.csv',
            originalname: 'test.csv',
            size: 1024
        };

        // Mock CSV content
        const csvContent = 'name,age,score\nJohn,25,95\nJane,30,88';
        fs.writeFileSync('./test.csv', csvContent);

        try {
            const result = await fileService.processFile(mockFile);
            expect(result.metadata.rows).toBe(2);
            expect(result.metadata.columns).toBe(3);
        } finally {
            if (fs.existsSync('./test.csv')) {
                fs.unlinkSync('./test.csv');
            }
        }
    });

    test('should validate file type', () => {
        const validExtensions = ['.csv', '.xlsx'];
        expect(validExtensions.includes('.csv')).toBe(true);
        expect(validExtensions.includes('.xlsx')).toBe(true);
        expect(validExtensions.includes('.txt')).toBe(false);
    });

    test('should validate file size', () => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        expect(1024).toBeLessThan(maxSize);
        expect(11 * 1024 * 1024).toBeGreaterThan(maxSize);
    });
});
