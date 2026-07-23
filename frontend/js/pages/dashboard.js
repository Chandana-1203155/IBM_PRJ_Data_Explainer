// Dashboard Page Logic - AI Data Explainer+

const Dashboard = {
    init() {
        this.setupNavigation();
        this.setupReportGeneration();
    },

    setupNavigation() {
        // Navigation is handled by Sidebar component
        // This is a placeholder for any additional dashboard logic
    },

    setupReportGeneration() {
        const generateReportBtn = document.getElementById('generate-report');
        
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', async () => {
                if (!App.state.sessionId) {
                    Toast.show('Please upload a dataset first', 'warning');
                    return;
                }

                generateReportBtn.disabled = true;
                generateReportBtn.innerHTML = '<i class="fas fa-spinner spin"></i> Generating...';

                try {
                    const chartImages = await this.captureChartImages();
                    const response = await API.generateReport(App.state.sessionId, chartImages);
                    
                    if (response.success) {
                        // Download the report as a file
                        const reportUrl = response.data.reportUrl;
                        const filename = response.data.filename;
                        
                        await ReportService.download(reportUrl, filename);

                        Toast.show('Report generated successfully!', 'success');
                    } else {
                        throw new Error(response.error || 'Report generation failed');
                    }
                } catch (error) {
                    console.error('Report generation error:', error);
                    Toast.show('Failed to generate report. Please try again.', 'error');
                } finally {
                    generateReportBtn.disabled = false;
                    generateReportBtn.innerHTML = '<i class="fas fa-download"></i> Generate PDF Report';
                }
            });
        }
    },

    captureChartImages() {
        return new Promise(async (resolve) => {
            const chartImages = [];

            ChartService.refreshAllCharts();

            try {
                await ChartService.waitForAllChartsRendered(3000);
            } catch (err) {
                console.warn('waitForAllChartsRendered failed or timed out:', err);
            }

            const charts = ChartService.exportChartImages(1000, 0.8);
            if (charts.length > 0) {
                charts.forEach(chart => {
                    chartImages.push({ title: chart.title, image: chart.image });
                });
                resolve(chartImages);
                return;
            }

            const chartCards = document.querySelectorAll('#charts-container .chart-card');
            for (const card of chartCards) {
                const style = window.getComputedStyle(card);
                if (style.display === 'none' || style.visibility === 'hidden') continue;

                const titleEl = card.querySelector('.chart-card-header h3') || card.querySelector('h3');
                const title = titleEl ? titleEl.textContent.trim() : 'Chart';

                try {
                    const captured = await html2canvas(card, {
                        scale: 1,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        allowTaint: false,
                        logging: false
                    });
                    const dataUrl = captured.toDataURL('image/jpeg', 0.75);
                    chartImages.push({ title, image: dataUrl });
                } catch (err) {
                    console.error('html2canvas fallback capture failed for card:', err);
                }
            }

            resolve(chartImages);
        });
    },

    reset() {
        // Reset dashboard to initial state
        App.resetDashboardUI();
        Chat.reset();
        ChartService.destroyCharts();
    }
};

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
