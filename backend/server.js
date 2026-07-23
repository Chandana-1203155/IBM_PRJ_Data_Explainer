// Server Entry Point - AI Data Explainer+

const app = require('./app');
const env = require('./config/env');
const fs = require('fs');
const path = require('path');

// Create necessary directories
const createDirectories = () => {
    const directories = [
        env.uploadDir,
        env.reportDir,
        './backend/logs'
    ];

    directories.forEach(dir => {
        const fullPath = path.resolve(dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created directory: ${fullPath}`);
        } else {
            console.log(`Directory exists: ${fullPath}`);
        }
    });
};

// Start server
const startServer = () => {
    const PORT = env.port;
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║          AI Data Explainer+ Backend Server                    ║
║                                                              ║
║          Server running on port ${PORT}                             ║
║          Environment: ${env.nodeEnv}                                 ║
║          AI Provider: ${env.aiProvider}                              ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
};

// Initialize
createDirectories();
startServer();
