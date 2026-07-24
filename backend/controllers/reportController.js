// Report Controller - AI Data Explainer+

const reportService = require('../services/reportService');
const sessionManager = require('../utils/sessionManager');
const constants = require('../config/constants');

class ReportController {
    async generate(req, res) {
        try {
            const { sessionId, chartImages } = req.body;
            const firstChart = Array.isArray(chartImages) ? chartImages[0] : null;
            console.log('Report request received', {
                sessionId,
                chartCount: Array.isArray(chartImages) ? chartImages.length : 0,
                firstChartTitle: firstChart?.title || null,
                firstChartImageType: typeof firstChart?.image,
                firstChartImagePrefix: typeof firstChart?.image === 'string' ? firstChart.image.slice(0, 100) : '',
                firstChartImageLength: typeof firstChart?.image === 'string' ? firstChart.image.length : 0,
                firstChartMimeType: typeof firstChart?.image === 'string'
                    ? (firstChart.image.match(/^data:([^;,]+)(;[^;,]+)*;base64,/i)?.[1] || 'unknown')
                    : 'unknown',
                firstChartRegexMatched: typeof firstChart?.image === 'string'
                    ? /^data:([^;,]+)(;[^;,]+)*;base64,(.+)$/i.test(firstChart.image)
                    : false
            });

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
            console.log('Report generated:', report.filename);

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
