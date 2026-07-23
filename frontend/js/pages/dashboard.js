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
                // Wait for ChartService to report that charts have pixels drawn
                try {
                    await ChartService.waitForAllChartsRendered(5000);
                } catch (err) {
                    console.warn('waitForAllChartsRendered failed or timed out:', err);
                }

                // Capture each chart card using html2canvas to preserve layout and ensure high-res capture
                const chartCards = document.querySelectorAll('#charts-container .chart-card');
                const scale = Math.max(2, Math.ceil(window.devicePixelRatio || 1));

                for (const card of chartCards) {
                    try {
                        const style = window.getComputedStyle(card);
                        if (style.display === 'none' || style.visibility === 'hidden') continue;

                        const titleEl = card.querySelector('.chart-card-header h3') || card.querySelector('h3');
                        const title = titleEl ? titleEl.textContent.trim() : 'Chart';

                        // Ensure the card is rendered and measurable
                        card.style.opacity = '1';

                        // html2canvas options: high-res, allow cross-origin images, white background
                        const options = {
                            scale,
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            allowTaint: false,
                            logging: false,
                            width: Math.ceil(card.scrollWidth),
                            height: Math.ceil(card.scrollHeight)
                        };

                        // Capture full card (including offscreen content size)
                        const captured = await html2canvas(card, options);

                        // Convert to JPEG to reduce payload size while keeping quality
                        const dataUrl = captured.toDataURL('image/jpeg', 0.9);

                        chartImages.push({ title, image: dataUrl });
                    } catch (err) {
                        console.error('html2canvas capture failed for card:', err);
                        // fallback to any canvas inside card
                        const canvas = card.querySelector('canvas');
                        if (canvas) {
                            try {
                                const dataUrl = canvas.toDataURL('image/png');
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
