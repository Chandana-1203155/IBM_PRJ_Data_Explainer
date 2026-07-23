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
            const previousStyles = {};
            if (chartsSection && !chartsSection.classList.contains('active')) {
                wasHidden = true;
                // Keep charts rendered but offscreen and invisible to user — avoid visibility:hidden which can prevent rendering
                previousStyles.display = chartsSection.style.display;
                previousStyles.position = chartsSection.style.position;
                previousStyles.left = chartsSection.style.left;
                previousStyles.opacity = chartsSection.style.opacity;
                previousStyles.pointerEvents = chartsSection.style.pointerEvents;

                chartsSection.style.display = 'block';
                chartsSection.style.position = 'absolute';
                chartsSection.style.left = '-9999px';
                chartsSection.style.opacity = '0';
                chartsSection.style.pointerEvents = 'none';
            }

            ChartService.refreshAllCharts();

            window.requestAnimationFrame(async () => {
                // Wait for ChartService to report that charts have rendered and stabilized
                try {
                    await ChartService.waitForAllChartsRendered(5000);
                } catch (err) {
                    console.warn('waitForAllChartsRendered failed or timed out:', err);
                }

                const chartCards = document.querySelectorAll('#charts-container .chart-card');
                const MAX_IMAGE_WIDTH = 1000;

                for (const card of chartCards) {
                    try {
                        const style = window.getComputedStyle(card);
                        if (style.display === 'none' || style.visibility === 'hidden') continue;

                        const titleEl = card.querySelector('.chart-card-header h3') || card.querySelector('h3');
                        const title = titleEl ? titleEl.textContent.trim() : 'Chart';

                        card.style.opacity = '1';

                        const elementWidth = card.scrollWidth || card.offsetWidth;
                        const captureScale = Math.min(2, MAX_IMAGE_WIDTH / Math.max(1, elementWidth));
                        const options = {
                            scale: captureScale,
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            allowTaint: false,
                            logging: false,
                            width: Math.ceil(card.scrollWidth),
                            height: Math.ceil(card.scrollHeight)
                        };

                        const captured = await html2canvas(card, options);
                        let finalCanvas = captured;

                        if (captured.width > MAX_IMAGE_WIDTH) {
                            const ratio = MAX_IMAGE_WIDTH / captured.width;
                            const smallCanvas = document.createElement('canvas');
                            smallCanvas.width = MAX_IMAGE_WIDTH;
                            smallCanvas.height = Math.max(1, Math.floor(captured.height * ratio));

                            const ctx = smallCanvas.getContext('2d');
                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = 'high';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
                            ctx.drawImage(captured, 0, 0, smallCanvas.width, smallCanvas.height);
                            finalCanvas = smallCanvas;
                        }

                        const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.75);
                        chartImages.push({ title, image: dataUrl });
                    } catch (err) {
                        console.error('html2canvas capture failed for card:', err);
                        const canvas = card.querySelector('canvas');
                        if (canvas) {
                            try {
                                const fallbackCanvas = document.createElement('canvas');
                                const fallbackWidth = Math.min(1000, canvas.width);
                                const fallbackRatio = fallbackWidth / canvas.width;
                                fallbackCanvas.width = fallbackWidth;
                                fallbackCanvas.height = Math.max(1, Math.floor(canvas.height * fallbackRatio));
                                const ctx = fallbackCanvas.getContext('2d');
                                ctx.imageSmoothingEnabled = true;
                                ctx.imageSmoothingQuality = 'high';
                                ctx.fillStyle = '#ffffff';
                                ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
                                ctx.drawImage(canvas, 0, 0, fallbackCanvas.width, fallbackCanvas.height);
                                const dataUrl = fallbackCanvas.toDataURL('image/jpeg', 0.75);
                                const title = (card.querySelector('h3')?.textContent || 'Chart').trim();
                                chartImages.push({ title, image: dataUrl });
                            } catch (e) {
                                console.error('Fallback canvas toDataURL failed:', e);
                            }
                        }
                    }
                }

                // Restore charts section styles
                if (wasHidden && chartsSection) {
                    chartsSection.style.display = previousStyles.display || '';
                    chartsSection.style.position = previousStyles.position || '';
                    chartsSection.style.left = previousStyles.left || '';
                    chartsSection.style.opacity = previousStyles.opacity || '';
                    chartsSection.style.pointerEvents = previousStyles.pointerEvents || '';
                }

                resolve(chartImages);
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
