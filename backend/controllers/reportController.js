// Report Controller - AI Data Explainer+

const reportService = require('../services/reportService');
const sessionManager = require('../utils/sessionManager');
const constants = require('../config/constants');

class ReportController {
    async generate(req, res) {
        try {
            const { sessionId, chartImages } = req.body;

            // Get session data
            const session = sessionManager.getSession(sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: constants.ERRORS.SESSION_NOT_FOUND
                });
            }

            // Generate PDF report
            const report = await reportService.generateReport(session, chartImages || []);

            // Return a relative report URL so the browser uses the current page protocol
            const reportUrl = report.reportUrl;

            res.json({
                success: true,
                data: {
                    reportUrl,
                    filename: report.filename
                }
            });
        } catch (error) {
            console.error('Report generation error:', error);
            res.status(500).json({
                success: false,
                error: error.message || constants.ERRORS.REPORT_GENERATION_FAILED
            });
        }
    }
}

module.exports = new ReportController();
