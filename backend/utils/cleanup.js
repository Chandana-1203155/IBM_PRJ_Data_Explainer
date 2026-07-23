// Cleanup Utilities - AI Data Explainer+

const fs = require('fs');
const path = require('path');
const env = require('../config/env');

class Cleanup {
    static cleanupExpiredFiles(directory, maxAge = 3600000) {
        try {
            if (!fs.existsSync(directory)) {
                return;
            }

            const files = fs.readdirSync(directory);
            const now = Date.now();
            let cleanedCount = 0;

            files.forEach(file => {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);
                const age = now - stats.mtimeMs;

                if (age > maxAge) {
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                }
            });

            console.log(`Cleaned up ${cleanedCount} expired files in ${directory}`);
        } catch (error) {
            console.error('Error cleaning up files:', error);
        }
    }

    static cleanupAllExpired() {
        // Clean up uploads (older than 1 hour)
        this.cleanupExpiredFiles(env.uploadDir, 3600000);

        // Clean up reports (older than 1 hour)
        this.cleanupExpiredFiles(env.reportDir, 3600000);

        // Clean up logs (older than 7 days)
        this.cleanupExpiredFiles('./backend/logs', 7 * 24 * 3600000);
    }

    static clearDirectory(directory) {
        try {
            if (!fs.existsSync(directory)) {
                return;
            }

            const files = fs.readdirSync(directory);
            files.forEach(file => {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    this.clearDirectory(filePath);
                    fs.rmdirSync(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            });

            console.log(`Cleared directory: ${directory}`);
        } catch (error) {
            console.error('Error clearing directory:', error);
        }
    }
}

// Run cleanup every hour
setInterval(() => {
    Cleanup.cleanupAllExpired();
}, 3600000);

module.exports = Cleanup;
