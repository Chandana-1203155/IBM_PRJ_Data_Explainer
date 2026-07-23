// Chart Service - AI Data Explainer+

const ChartService = {
    charts: {},
    resizeObservers: {},
    visibilityObservers: {},
    resizeHandlerRegistered: false,

    init() {
        if (this.resizeHandlerRegistered) {
            return;
        }

        window.addEventListener('resize', () => {
            this.refreshAllCharts();
        });
        this.resizeHandlerRegistered = true;
    },

    generateCharts(analysisData) {
        console.log('ChartService.generateCharts called with:', analysisData);

        this.init();

        const container = document.getElementById('charts-container');
        if (!container) {
            console.error('Charts container not found');
            return;
        }

        this.destroyCharts();
        container.innerHTML = '';

        if (!analysisData) {
            console.error('No analysis data provided');
            container.innerHTML = `
                <div class="chart-placeholder">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No analysis data available</p>
                </div>
            `;
            return;
        }

        try {
            let charts = analysisData.charts;

            if (!Array.isArray(charts) || charts.length === 0) {
                charts = this.buildFallbackCharts(analysisData);
            }

            if (!Array.isArray(charts) || charts.length === 0) {
                container.innerHTML = `
                    <div class="chart-placeholder">
                        <i class="fas fa-chart-bar"></i>
                        <p>No charts could be generated for this dataset</p>
                    </div>
                `;
                return;
            }

            charts.forEach((chart, index) => this.renderChart(container, chart, index));
            requestAnimationFrame(() => this.refreshAllCharts());

            console.log('Charts generated successfully');
        } catch (error) {
            console.error('Error generating charts:', error);
            container.innerHTML = `
                <div class="chart-placeholder warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error generating charts: ${error.message}</p>
                </div>
            `;
        }
    },

    buildFallbackCharts(analysisData) {
        const charts = [];

        if (analysisData && analysisData.statistics && analysisData.statistics.numeric) {
            const numericStats = analysisData.statistics.numeric;
            const columns = Object.keys(numericStats).slice(0, 8);

            charts.push({
                id: 'chart-numeric-summary',
                type: 'bar',
                title: 'Numeric Column Summary',
                data: {
                    labels: columns,
                    datasets: [{
                        label: 'Mean',
                        data: columns.map(col => numericStats[col].mean || 0),
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Numeric Column Summary' },
                        legend: { display: false }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Column' } },
                        y: { title: { display: true, text: 'Mean' }, beginAtZero: true }
                    }
                }
            });
        }

        if (analysisData && analysisData.statistics && analysisData.statistics.categorical) {
            const categoricalStats = analysisData.statistics.categorical;
            const columns = Object.keys(categoricalStats).slice(0, 8);

            charts.push({
                id: 'chart-categorical-summary',
                type: 'bar',
                title: 'Unique Values by Categorical Column',
                data: {
                    labels: columns,
                    datasets: [{
                        label: 'Unique Count',
                        data: columns.map(col => categoricalStats[col].unique || 0),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Unique Values by Categorical Column' },
                        legend: { display: false }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Column' } },
                        y: { title: { display: true, text: 'Unique Count' }, beginAtZero: true }
                    }
                }
            });
        }

        return charts;
    },

    renderChart(container, chartConfig, index) {
        if (!chartConfig || !chartConfig.data || !chartConfig.type) {
            console.error('Invalid chart configuration:', chartConfig);
            return;
        }

        const chartId = chartConfig.id || `chart-${index}-${Date.now()}`;
        const title = chartConfig.title || chartConfig.options?.plugins?.title?.text || 'Chart';
        const icon = this.getChartIcon(chartConfig.type);

        const chartCard = document.createElement('div');
        chartCard.className = 'chart-card';
        chartCard.innerHTML = `
            <div class="chart-card-header">
                <h3><i class="fas ${icon}"></i> ${this.escapeHtml(title)}</h3>
            </div>
            <div class="chart-canvas-wrap">
                <canvas id="${chartId}"></canvas>
            </div>
        `;
        container.appendChild(chartCard);

        const canvas = chartCard.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const defaultOptions = this.getDefaultOptions(chartConfig.type);
        const mergedOptions = {
            ...defaultOptions,
            ...(chartConfig.options || {}),
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                ...(defaultOptions.plugins || {}),
                ...((chartConfig.options && chartConfig.options.plugins) || {})
            },
            scales: {
                ...(defaultOptions.scales || {}),
                ...((chartConfig.options && chartConfig.options.scales) || {})
            }
        };

        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }

        this.charts[chartId] = new Chart(ctx, {
            type: chartConfig.type === 'histogram' ? 'bar' : chartConfig.type,
            data: chartConfig.data,
            options: mergedOptions
        });

        this.bindResizeObserver(chartCard, chartId);
        this.bindVisibilityObserver(chartCard, chartId);

        requestAnimationFrame(() => {
            if (this.charts[chartId]) {
                this.charts[chartId].resize();
            }
        });

        window.setTimeout(() => {
            if (this.charts[chartId]) {
                this.charts[chartId].resize();
            }
        }, 180);
    },

    getChartIcon(type) {
        switch (type) {
            case 'pie':
            case 'doughnut':
                return 'fa-chart-pie';
            case 'line':
                return 'fa-chart-line';
            case 'scatter':
                return 'fa-chart-scatter';
            case 'bar':
            case 'histogram':
            default:
                return 'fa-chart-bar';
        }
    },

    getDefaultOptions(type) {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: type === 'pie' || type === 'doughnut'
                }
            }
        };

        if (type !== 'pie' && type !== 'doughnut') {
            options.scales = {
                x: {
                    title: {
                        display: true,
                        text: 'Category'
                    },
                    ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    beginAtZero: true
                }
            };
        }

        return options;
    },

    bindResizeObserver(chartCard, chartId) {
        if (!chartCard || !window.ResizeObserver) {
            return;
        }

        const observer = new ResizeObserver(() => {
            const chart = this.charts[chartId];
            if (chart) {
                chart.resize();
            }
        });

        observer.observe(chartCard);
        this.resizeObservers[chartId] = observer;
    },

    bindVisibilityObserver(chartCard, chartId) {
        if (!chartCard || !('IntersectionObserver' in window)) {
            const chart = this.charts[chartId];
            if (chart) {
                chart.resize();
            }
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const chart = this.charts[chartId];
                    if (chart) {
                        chart.resize();
                    }
                    observer.disconnect();
                    delete this.visibilityObservers[chartId];
                }
            });
        }, { threshold: 0.1 });

        observer.observe(chartCard);
        this.visibilityObservers[chartId] = observer;
    },

    refreshAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
                chart.update('none');
            }
        });
    },

    exportChartImages(maxWidth = 1000, quality = 0.8) {
        const images = [];

        Object.entries(this.charts).forEach(([chartId, chart]) => {
            if (!chart || !chart.canvas) return;

            const title = chart.options?.plugins?.title?.text || chartId || 'Chart';
            let dataUrl;

            try {
                dataUrl = chart.canvas.toDataURL('image/jpeg', quality);
            } catch (error) {
                console.warn(`Failed to export chart image for ${chartId}:`, error);
                return;
            }

            if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
                return;
            }

            images.push({ title, image: dataUrl });
        });

        return images;
    },

    async waitForAllChartsRendered(timeoutMs = 5000) {
        const start = Date.now();

        const chartIds = Object.keys(this.charts);
        if (chartIds.length === 0) return;

        const check = () => {
            for (const id of chartIds) {
                try {
                    const canvas = document.getElementById(id);
                    if (!canvas) return false;
                    if (canvas.width < 20 || canvas.height < 20) return false;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return false;
                    // sample center pixel to ensure something has been drawn
                    const x = Math.floor(canvas.width / 2);
                    const y = Math.floor(canvas.height / 2);
                    const data = ctx.getImageData(x, y, 1, 1).data;
                    // alpha channel > 0 indicates drawing present
                    if (!data || data[3] === 0) return false;
                } catch (err) {
                    // if getImageData throws (very unlikely for same-origin), treat as not ready
                    return false;
                }
            }
            return true;
        };

        return new Promise(resolve => {
            const tick = () => {
                if (check()) return resolve();
                if (Date.now() - start > timeoutMs) return resolve();
                window.setTimeout(tick, 150);
            };
            tick();
        });
    },

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });

        Object.values(this.resizeObservers).forEach(observer => {
            if (observer) {
                observer.disconnect();
            }
        });

        Object.values(this.visibilityObservers).forEach(observer => {
            if (observer) {
                observer.disconnect();
            }
        });

        this.charts = {};
        this.resizeObservers = {};
        this.visibilityObservers = {};
    }
};
