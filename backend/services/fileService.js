// File Service - AI Data Explainer+

const Papa = require('papaparse');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sessionManager = require('../utils/sessionManager');
const constants = require('../config/constants');

class FileService {
    async processFile(file) {
        const ext = path.extname(file.originalname).toLowerCase();
        let data;

        try {
            // Parse file based on extension
            if (ext === '.csv') {
                data = await this.parseCSV(file.path);
            } else if (ext === '.xlsx') {
                data = await this.parseExcel(file.path);
            } else {
                throw new Error(constants.ERRORS.INVALID_FILE_TYPE);
            }

            // Validate parsed data
            if (!data || data.length === 0) {
                throw new Error(constants.ERRORS.FILE_EMPTY);
            }

            // Create session
            const sessionId = uuidv4();
            const metadata = this.generateMetadata(data, file);
            const preview = this.generatePreview(data);

            const session = {
                sessionId,
                filepath: file.path,
                filename: file.originalname,
                data,
                metadata,
                preview,
                createdAt: new Date(),
                lastAccessed: new Date()
            };

            // Store session
            sessionManager.createSession(sessionId, session);

            // Schedule cleanup
            this.scheduleCleanup(sessionId);

            return {
                filename: file.originalname,
                filepath: file.path,
                metadata,
                preview,
                sessionId
            };
        } catch (error) {
            // Clean up file on error
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    async parseCSV(filepath) {
        console.log('Parsing CSV file:', filepath);
        
        // Check if file exists
        if (!fs.existsSync(filepath)) {
            console.error('File does not exist:', filepath);
            throw new Error('File not found after upload');
        }

        try {
            const csvContent = await fs.promises.readFile(filepath, 'utf8');

            return new Promise((resolve, reject) => {
                Papa.parse(csvContent, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        console.log('CSV parse complete, rows:', results.data.length);
                        if (results.errors && results.errors.length > 0) {
                            console.error('CSV parse errors:', results.errors);
                            reject(new Error(constants.ERRORS.FILE_CORRUPTED));
                        } else {
                            resolve(results.data);
                        }
                    },
                    error: (error) => {
                        console.error('CSV parse error:', error);
                        reject(new Error(constants.ERRORS.FILE_CORRUPTED));
                    }
                });
            });
        } catch (error) {
            console.error('CSV read error:', error);
            throw new Error(constants.ERRORS.FILE_CORRUPTED);
        }
    }

    async parseExcel(filepath) {
        console.log('Parsing Excel file:', filepath);
        
        // Check if file exists
        if (!fs.existsSync(filepath)) {
            console.error('File does not exist:', filepath);
            throw new Error('File not found after upload');
        }

        try {
            const workbook = XLSX.readFile(filepath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            console.log('Excel parse complete, rows:', data.length);
            return data;
        } catch (error) {
            console.error('Excel parse error:', error);
            throw new Error(constants.ERRORS.FILE_CORRUPTED);
        }
    }

    generateMetadata(data, file) {
        const columnNames = Object.keys(data[0]);
        const rowCount = data.length;
        const columnCount = columnNames.length;
        
        // Detect column types
        const columnTypes = {};
        const missingValues = {};
        const uniqueValues = {};

        columnNames.forEach(col => {
            const values = data.map(row => row[col]);
            const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
            
            // Detect type
            const numericCount = nonNullValues.filter(v => typeof v === 'number').length;
            const dateCount = nonNullValues.filter(v => !isNaN(Date.parse(v))).length;
            
            if (numericCount / nonNullValues.length > 0.8) {
                columnTypes[col] = constants.DATA_TYPES.NUMERIC;
            } else if (dateCount / nonNullValues.length > 0.8) {
                columnTypes[col] = constants.DATA_TYPES.DATE;
            } else {
                columnTypes[col] = constants.DATA_TYPES.CATEGORICAL;
            }

            // Count missing values
            missingValues[col] = values.length - nonNullValues.length;

            // Count unique values
            uniqueValues[col] = new Set(nonNullValues).size;
        });

        return {
            rows: rowCount,
            columns: columnCount,
            columnNames,
            columnTypes,
            missingValues,
            uniqueValues,
            fileSize: file.size,
            memoryUsage: JSON.stringify(data).length
        };
    }

    generatePreview(data) {
        return data.slice(0, 10);
    }

    scheduleCleanup(sessionId) {
        setTimeout(() => {
            sessionManager.deleteSession(sessionId);
        }, constants.SESSION_TIMEOUT);
    }
}

module.exports = new FileService();
