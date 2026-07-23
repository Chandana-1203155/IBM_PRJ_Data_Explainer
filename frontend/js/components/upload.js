// Upload Component - AI Data Explainer+

const Upload = {
    init() {
        this.setupDragAndDrop();
        this.setupFileInput();
    },

    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        
        if (!uploadArea) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            });
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    },

    setupFileInput() {
        const fileInput = document.getElementById('file-input');
        
        if (!fileInput) return;

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    },

    async handleFile(file) {
        // Validate file
        const validation = Validators.validateFile(file);
        if (!validation.valid) {
            validation.errors.forEach(error => {
                Toast.show(error, 'error');
            });
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            console.log('Starting file upload:', file.name, file.size);
            
            // Upload file to backend
            const response = await API.upload(file);
            
            console.log('Upload response:', response);
            
            if (response.success) {
                // Store session data
                App.state.dataset = response.data;
                App.state.sessionId = response.data.sessionId;

                console.log('State updated:', {
                    dataset: App.state.dataset,
                    sessionId: App.state.sessionId
                });

                // Show success message
                Toast.show('File uploaded successfully!', 'success');

                // Update UI with dataset info
                this.updateDatasetOverview(response.data);

                // Hide upload area after successful upload
                this.hideUploadArea();

                // Navigate to overview section
                App.navigateToSection('overview');

                // Trigger analysis
                await this.triggerAnalysis(response.data.sessionId);
            } else {
                throw new Error(response.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (error.message.includes('Failed to fetch')) {
                Toast.show('Cannot connect to server. Please ensure backend is running on port 3000.', 'error');
            } else {
                Toast.show(`Upload failed: ${error.message}`, 'error');
            }
            this.resetUploadArea();
        }
    },

    showLoading() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-content">
                    <div class="spinner"></div>
                    <h3>Uploading and analyzing...</h3>
                    <p>Please wait while we process your file</p>
                </div>
            `;
        }
    },

    resetUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Drag & Drop your file here</h3>
                    <p>or</p>
                    <button class="btn-primary" onclick="document.getElementById('file-input').click()">
                        <i class="fas fa-folder-open"></i>
                        Browse Files
                    </button>
                    <input type="file" id="file-input" accept=".csv,.xlsx" hidden>
                    <p class="upload-info">Supported formats: CSV, Excel (.xlsx) | Max size: 10MB</p>
                </div>
            `;
            this.setupDragAndDrop();
            this.setupFileInput();
        }
    },

    hideUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.style.display = 'none';
        }
    },

    updateDatasetOverview(data) {
        const overviewCards = document.getElementById('overview-cards');
        if (overviewCards && data.metadata) {
            const meta = data.metadata;
            overviewCards.innerHTML = `
                <div class="card">
                    <div class="card-icon"><i class="fas fa-table"></i></div>
                    <div class="card-content">
                        <div class="card-value">${Formatters.formatNumber(meta.rows)}</div>
                        <div class="card-label">Total Rows</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon"><i class="fas fa-columns"></i></div>
                    <div class="card-content">
                        <div class="card-value">${Formatters.formatNumber(meta.columns)}</div>
                        <div class="card-label">Total Columns</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon"><i class="fas fa-database"></i></div>
                    <div class="card-content">
                        <div class="card-value">${Formatters.formatBytes(meta.fileSize)}</div>
                        <div class="card-label">File Size</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="card-content">
                        <div class="card-value">${meta.columnNames.length}</div>
                        <div class="card-label">Columns</div>
                    </div>
                </div>
            `;
        }

        // Update data preview
        const dataPreview = document.getElementById('data-preview');
        if (dataPreview && data.preview) {
            const headers = data.preview[0] ? Object.keys(data.preview[0]) : [];
            const rows = data.preview.slice(0, 5);
            
            dataPreview.innerHTML = `
                <div class="preview-table">
                    <table>
                        <thead>
                            <tr>
                                ${headers.map(h => `<th>${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(row => `
                                <tr>
                                    ${headers.map(h => `<td>${row[h] !== undefined ? row[h] : 'N/A'}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    },

    async triggerAnalysis(sessionId) {
        try {
            console.log('Triggering analysis for session:', sessionId);
            
            const response = await API.analyze(sessionId);
            
            console.log('Analysis response:', response);
            
            if (response.success) {
                console.log('Analysis successful, updating UI');
                
                // Clear placeholder sections
                this.clearPlaceholders();
                
                // Generate charts
                try {
                    ChartService.generateCharts(response.data);
                    console.log('Charts generated successfully');
                } catch (chartError) {
                    console.error('Chart generation error:', chartError);
                    this.displayChartsFallback('Chart generation failed');
                }
                
                // Enable chat
                Chat.enable(sessionId);
                console.log('Chat enabled');
                
                // Enable report generation
                const generateReportBtn = document.getElementById('generate-report');
                if (generateReportBtn) {
                    generateReportBtn.disabled = false;
                }
                
                // Generate insights (non-blocking)
                this.generateInsights(sessionId);
                
                // Generate recommendations (non-blocking)
                this.generateRecommendations(sessionId);
                
                Toast.show('Analysis complete!', 'success');
            } else {
                console.error('Analysis failed:', response.error);
                Toast.show(`Analysis failed: ${response.error}`, 'error');
                this.displayAnalysisFallback(response.error);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            Toast.show('Analysis failed. Please try again.', 'error');
            this.displayAnalysisFallback(error.message);
        }
    },

    displayChartsFallback(message) {
        const chartsContainer = document.getElementById('charts-container');
        if (!chartsContainer) return;

        chartsContainer.innerHTML = `
            <div class="chart-placeholder warning">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    },

    displayAnalysisFallback(error) {
        // Ensure chat is still enabled even if analysis fails
        Chat.enable(App.state.sessionId);
        
        // Show fallback in insights and recommendations
        this.displayInsightsFallback(`Analysis failed: ${error}`);
        this.displayRecommendationsFallback(`Analysis failed: ${error}`);
    },

    clearPlaceholders() {
        // Clear charts placeholder
        const chartsContainer = document.getElementById('charts-container');
        if (chartsContainer) {
            chartsContainer.innerHTML = '';
        }

        // Clear insights placeholder
        const insightsContainer = document.getElementById('insights-container');
        if (insightsContainer) {
            insightsContainer.innerHTML = '';
        }

        // Clear recommendations placeholder
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '';
        }
    },

    async generateInsights(sessionId) {
        try {
            console.log('Generating insights for session:', sessionId);
            const response = await API.getInsights(sessionId);
            
            if (!response?.body?.getReader) {
                this.displayInsightsFallback('AI insights generation failed. Please check your AI provider configuration.');
                return;
            }

            await this.handleStreamingInsights(response);
        } catch (error) {
            console.error('Insights generation error:', error);
            this.displayInsightsFallback('Unable to generate AI insights. The AI provider may be unavailable.');
        }
    },

    async handleStreamingInsights(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const container = document.getElementById('insights-container');
        if (!container) return;

        // Show streaming state with loading indicator
        container.innerHTML = `
            <div class="insights-content">
                <div class="insight-card streaming-card">
                    <h3><i class="fas fa-brain"></i> AI is analyzing your data...</h3>
                    <div class="streaming-indicator"><div class="spinner"></div></div>
                    <pre class="streaming-text" style="white-space:pre-wrap;font-family:inherit;margin:12px 0 0;max-height:400px;overflow-y:auto;font-size:0.95em;line-height:1.6;color:var(--text-secondary,#555);"></pre>
                </div>
            </div>
        `;
        const streamingText = container.querySelector('.streaming-text');

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const payload = line.slice(6);
                    if (!payload) continue;

                    try {
                        const data = JSON.parse(payload);
                        if (data.type === 'chunk' && streamingText) {
                            streamingText.textContent += data.content || '';
                            streamingText.scrollTop = streamingText.scrollHeight;
                        } else if (data.type === 'done' && data.data) {
                            console.log('Insights streaming complete:', data.data);
                            this.displayInsights(data.data);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE payload:', e);
                    }
                }
            }

            if (buffer.startsWith('data: ')) {
                const payload = buffer.slice(6);
                if (payload) {
                    try {
                        const data = JSON.parse(payload);
                        if (data.type === 'done' && data.data) {
                            console.log('Insights streaming complete:', data.data);
                            this.displayInsights(data.data);
                        }
                    } catch (e) {
                        console.warn('Failed to parse final insights SSE buffer:', e, buffer);
                    }
                }
            }
        } catch (error) {
            console.error('Insights streaming error:', error);
            this.displayInsightsFallback('Streaming interrupted. Please try again.');
        }
    },

    displayInsights(insights) {
        const insightsContainer = document.getElementById('insights-container');
        if (!insightsContainer) return;

        const keyFindings = Array.isArray(insights.keyFindings) 
            ? insights.keyFindings.join('<br>• ') 
            : insights.keyFindings || 'Analysis complete';

        insightsContainer.innerHTML = `
            <div class="insights-content">
                <div class="insight-card">
                    <h3><i class="fas fa-chart-line"></i> Key Findings</h3>
                    <p>• ${keyFindings}</p>
                </div>
                <div class="insight-card">
                    <h3><i class="fas fa-lightbulb"></i> Patterns</h3>
                    <p>• ${Array.isArray(insights.patterns) ? insights.patterns.join('<br>• ') : insights.patterns || 'Patterns detected'}</p>
                </div>
                <div class="insight-card">
                    <h3><i class="fas fa-trending-up"></i> Trends</h3>
                    <p>• ${Array.isArray(insights.trends) ? insights.trends.join('<br>• ') : insights.trends || 'Trends analyzed'}</p>
                </div>
            </div>
        `;
    },

    displayInsightsFallback(message) {
        const insightsContainer = document.getElementById('insights-container');
        if (!insightsContainer) return;

        insightsContainer.innerHTML = `
            <div class="insights-content">
                <div class="insight-card warning">
                    <h3><i class="fas fa-exclamation-triangle"></i> AI Insights Unavailable</h3>
                    <p>${message}</p>
                    <p class="note">Note: Configure a valid AI provider (Groq or OpenRouter) in your .env file to enable AI-powered insights.</p>
                </div>
            </div>
        `;
    },

    async generateRecommendations(sessionId) {
        try {
            console.log('Generating recommendations for session:', sessionId);
            const response = await API.getRecommendations(sessionId);
            
            if (!response?.body?.getReader) {
                this.generateFallbackRecommendations();
                return;
            }

            await this.handleStreamingRecommendations(response);
        } catch (error) {
            console.error('Recommendations generation error:', error);
            this.generateFallbackRecommendations();
        }
    },

    async handleStreamingRecommendations(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        // Show streaming state with loading indicator
        container.innerHTML = `
            <div class="recommendations-content">
                <div class="recommendation-card streaming-card">
                    <h3><i class="fas fa-lightbulb"></i> AI is generating recommendations...</h3>
                    <div class="streaming-indicator"><div class="spinner"></div></div>
                    <pre class="streaming-text" style="white-space:pre-wrap;font-family:inherit;margin:12px 0 0;max-height:400px;overflow-y:auto;font-size:0.95em;line-height:1.6;color:var(--text-secondary,#555);"></pre>
                </div>
            </div>
        `;
        const streamingText = container.querySelector('.streaming-text');

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const payload = line.slice(6);
                    if (!payload) continue;

                    try {
                        const data = JSON.parse(payload);
                        if (data.type === 'chunk' && streamingText) {
                            streamingText.textContent += data.content || '';
                            streamingText.scrollTop = streamingText.scrollHeight;
                        } else if (data.type === 'done' && data.data) {
                            console.log('Recommendations streaming complete:', data.data);
                            this.displayRecommendations(data.data);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE payload:', e);
                    }
                }
            }

            if (buffer.startsWith('data: ')) {
                const payload = buffer.slice(6);
                if (payload) {
                    try {
                        const data = JSON.parse(payload);
                        if (data.type === 'done' && data.data) {
                            console.log('Recommendations streaming complete:', data.data);
                            this.displayRecommendations(data.data);
                        }
                    } catch (e) {
                        console.warn('Failed to parse final recommendations SSE buffer:', e, buffer);
                    }
                }
            }
        } catch (error) {
            console.error('Recommendations streaming error:', error);
            this.generateFallbackRecommendations();
        }
    },

    generateFallbackRecommendations() {
        console.log('Generating fallback recommendations from dataset');
        const dataset = App.state.dataset;
        
        if (!dataset || !dataset.metadata) {
            this.displayRecommendationsFallback('No dataset available for recommendations.');
            return;
        }

        const metadata = dataset.metadata;
        
        const recommendations = {
            recommendations: [
                {
                    recommendation: 'Continue Data Collection',
                    reason: `With ${metadata.rows} records, consider collecting more data for better statistical significance.`,
                    priority: 'Medium',
                    expectedImpact: 'Improved analysis accuracy'
                },
                {
                    recommendation: 'Data Quality Check',
                    reason: 'Regularly validate data quality and identify missing values or outliers.',
                    priority: 'High',
                    expectedImpact: 'Better decision making'
                },
                {
                    recommendation: 'Explore Data Relationships',
                    reason: 'Analyze correlations between different columns to uncover hidden patterns.',
                    priority: 'Medium',
                    expectedImpact: 'Deeper insights'
                },
                {
                    recommendation: 'Visualize Key Metrics',
                    reason: 'Create visualizations for better understanding of data distribution and trends.',
                    priority: 'High',
                    expectedImpact: 'Improved communication'
                },
                {
                    recommendation: 'Set Up Monitoring',
                    reason: 'Monitor key metrics over time to track performance and identify trends.',
                    priority: 'Medium',
                    expectedImpact: 'Proactive management'
                }
            ]
        };

        this.displayRecommendations(recommendations);
    },

    displayRecommendations(recommendations) {
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (!recommendationsContainer) return;

        const recs = recommendations.recommendations || [];
        
        if (recs.length === 0) {
            this.displayRecommendationsFallback('No recommendations generated.');
            return;
        }
        
        recommendationsContainer.innerHTML = `
            <div class="recommendations-content">
                ${recs.map(rec => `
                    <div class="recommendation-card priority-${rec.priority?.toLowerCase() || 'medium'}">
                        <h3><i class="fas fa-check-circle"></i> ${rec.recommendation || rec.title || 'Recommendation'}</h3>
                        <p><strong>Reason:</strong> ${rec.reason || 'Based on data analysis'}</p>
                        <p><strong>Priority:</strong> ${rec.priority || 'Medium'}</p>
                        <p><strong>Expected Impact:</strong> ${rec.expectedImpact || 'Improved decision making'}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    displayRecommendationsFallback(message) {
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (!recommendationsContainer) return;

        recommendationsContainer.innerHTML = `
            <div class="recommendations-content">
                <div class="recommendation-card warning">
                    <h3><i class="fas fa-exclamation-triangle"></i> AI Recommendations Unavailable</h3>
                    <p>${message}</p>
                    <p class="note">Note: Configure a valid AI provider (Groq or OpenRouter) in your .env file to enable AI-powered recommendations.</p>
                </div>
            </div>
        `;
    }
};

// Initialize upload component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Upload.init();
});
