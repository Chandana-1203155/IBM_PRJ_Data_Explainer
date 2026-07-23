// Upload Controller - AI Data Explainer+

const fileService = require('../services/fileService');
const constants = require('../config/constants');

class UploadController {
    async upload(req, res) {
        try {
            console.log('Upload request received');
            
            if (!req.file) {
                console.log('No file in request');
                return res.status(400).json({
                    success: false,
                    error: constants.ERRORS.NO_FILE_UPLOADED
                });
            }

            console.log('File received:', {
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            });

            // Process the uploaded file
            const result = await fileService.processFile(req.file);

            console.log('File processed successfully:', result.sessionId);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Upload error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                error: error.message || constants.ERRORS.ANALYSIS_FAILED
            });
        }
    }
}

module.exports = new UploadController();
