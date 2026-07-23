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
        return new Promise((resolve) => {
            const chartImages = [];
            const chartsSection = document.getElementById('section-charts');
            const canvases = document.querySelectorAll('#charts-container canvas');

            // Temporarily show charts section so canvases render at full size
            let wasHidden = false;
            if (chartsSection && !chartsSection.classList.contains('active')) {
                wasHidden = true;
                chartsSection.style.display = 'block';
                chartsSection.style.position = 'absolute';
                chartsSection.style.left = '-9999px';
                chartsSection.style.visibility = 'hidden';
            }

            ChartService.refreshAllCharts();

            window.requestAnimationFrame(() => {
                window.setTimeout(() => {
                    canvases.forEach(canvas => {
                        try {
                            const chartInstance = ChartService.charts[canvas.id];
                            if (!chartInstance) {
                                return;
                            }

                            chartInstance.resize();
                            chartInstance.update('none');

                            const title = chartInstance?.options?.plugins?.title?.text || 'Chart';
                            chartImages.push({
                                title,
                                image: canvas.toDataURL('image/png')
                            });
                        } catch (error) {
                            console.error('Error capturing chart image:', error);
                        }
                    });

                    // Restore charts section visibility
                    if (wasHidden && chartsSection) {
                        chartsSection.style.display = '';
                        chartsSection.style.position = '';
                        chartsSection.style.left = '';
                        chartsSection.style.visibility = '';
                    }

                    resolve(chartImages);
                }, 300);
            });
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
