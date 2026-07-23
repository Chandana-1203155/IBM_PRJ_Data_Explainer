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
                    console.log('Sending report with chartImages count:', chartImages.length);
                    if (chartImages.length > 0) {
                        console.log('First chart image sample:', {
                            title: chartImages[0].title,
                            prefix: String(chartImages[0].image).slice(0, 60),
                            length: chartImages[0].image.length
                        });
                    }
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
                charts.forEach(chart => chartImages.push({ title: chart.title, image: chart.image }));
            }

            if (chartImages.length === 0) {
                const chartCards = document.querySelectorAll('#charts-container .chart-card');
                for (const card of chartCards) {
                    const style = window.getComputedStyle(card);
                    if (style.display === 'none' || style.visibility === 'hidden') continue;

                    const titleEl = card.querySelector('.chart-card-header h3') || card.querySelector('h3');
                    const title = titleEl ? titleEl.textContent.trim() : 'Chart';
                    const canvas = card.querySelector('canvas');

                    if (canvas && canvas.width > 0 && canvas.height > 0) {
                        try {
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            chartImages.push({ title, image: dataUrl });
                            continue;
                        } catch (err) {
                            console.error('Canvas fallback capture failed for chart:', err);
                        }
                    }

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
            }

            console.log('Report chart images count:', chartImages.length, chartImages.map((c) => c.title));
            if (chartImages.length > 0) {
                const first = chartImages[0];
                console.log('First captured chart image preview:', {
                    title: first.title,
                    prefix: first.image?.slice?.(0, 60),
                    length: first.image?.length
                });
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
