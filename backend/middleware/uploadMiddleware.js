// Upload Middleware - AI Data Explainer+

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const constants = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(env.uploadDir);
        console.log('Upload destination:', uploadPath);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Created upload directory:', uploadPath);
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        console.log('Generated filename:', uniqueName);
        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (constants.ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(constants.ERRORS.INVALID_FILE_TYPE));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: constants.MAX_FILE_SIZE
    }
});

module.exports = upload;
