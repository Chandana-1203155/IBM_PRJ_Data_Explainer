// Global Error Handler - AI Data Explainer+

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            error: 'File size exceeds 10MB limit'
        });
    }

    // Multer file type error
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            error: 'Unexpected file field'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;
