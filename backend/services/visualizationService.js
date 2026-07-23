// Visualization Service - AI Data Explainer+

const constants = require('../config/constants');
const statistics = require('../utils/statistics');

const COLORS = [
    'rgba(99, 102, 241, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(20, 184, 166, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(16, 185, 129, 0.8)'
];

const BORDER_COLORS = COLORS.map(color => color.replace('0.8', '1'));

class VisualizationService {
    generateChartConfigurations(dataset) {
        const { data, metadata } = dataset;
        const charts = [];
        const columnTypes = metadata && metadata.columnTypes ? metadata.columnTypes : {};
        const columns = Object.keys(columnTypes);

        if (!data || data.length === 0 || columns.length === 0) {
            return charts;
        }

        let chartIndex = 0;

        const categoricalColumns = columns.filter(col => columnTypes[col] === constants.DATA_TYPES.CATEGORICAL);
        const numericColumns = columns.filter(col => columnTypes[col] === constants.DATA_TYPES.NUMERIC);
        const dateColumns = columns.filter(col => columnTypes[col] === constants.DATA_TYPES.DATE);

        // Categorical column charts
        categoricalColumns.slice(0, 6).forEach(col => {
            const frequency = this.getFrequency(data, col);
            const keys = Object.keys(frequency);
            if (keys.length === 0) return;

            if (keys.length <= 10) {
                charts.push(this.createPieChartConfig(col, frequency, chartIndex++));
            } else {
                charts.push(this.createBarChartConfig(col, frequency, chartIndex++, 'Distribution'));
            }
        });

        // Numeric column charts
        numericColumns.slice(0, 6).forEach(col => {
            const values = data.map(row => row[col]).filter(v => typeof v === 'number' && !isNaN(v));
            if (values.length === 0) return;

            const uniqueCount = new Set(values).size;
            if (uniqueCount <= 15) {
                const frequency = this.getNumericFrequency(values);
                charts.push(this.createBarChartConfig(col, frequency, chartIndex++, 'Value Distribution', 'key'));
            } else {
                charts.push(this.createHistogramConfig(col, values, chartIndex++));
            }
        });

        // Date-based line chart with the first numeric column
        if (dateColumns.length > 0 && numericColumns.length > 0) {
            const dateChart = this.createDateLineChart(data, dateColumns[0], numericColumns[0], chartIndex++);
            if (dateChart) {
                charts.push(dateChart);
            }
        }

        // Correlation chart for numeric columns
        if (numericColumns.length >= 2) {
            const correlationChart = this.createCorrelationChart(data, numericColumns, chartIndex++);
            if (correlationChart) {
                charts.push(correlationChart);
            }
        }

        return charts;
    }

    getFrequency(data, column) {
        const frequency = {};
        data.forEach(row => {
            const value = row[column];
            if (value === null || value === undefined || value === '') {
                return;
            }
            const key = String(value);
            frequency[key] = (frequency[key] || 0) + 1;
        });
        return frequency;
    }

    getNumericFrequency(values) {
        const frequency = {};
        values.forEach(value => {
            const key = String(value);
            frequency[key] = (frequency[key] || 0) + 1;
        });
        return frequency;
    }

    sortEntries(entries, sortBy = 'value') {
        if (sortBy === 'key') {
            entries.sort((a, b) => {
                const numA = Number(a[0]);
                const numB = Number(b[0]);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return String(a[0]).localeCompare(String(b[0]));
            });
        } else {
            entries.sort((a, b) => b[1] - a[1]);
        }
        return entries;
    }

    createBarChartConfig(column, frequency, chartIndex, titlePrefix = 'Distribution of', sortBy = 'value') {
        let entries = this.sortEntries(Object.entries(frequency), sortBy);
        let labels = entries.map(entry => entry[0]);
        let values = entries.map(entry => entry[1]);

        // Group lower-frequency categories for readability
        if (sortBy === 'value' && labels.length > 10) {
            const top = entries.slice(0, 9);
            const other = entries.slice(9).reduce((sum, entry) => sum + entry[1], 0);
            labels = top.map(entry => entry[0]).concat(['Other']);
            values = top.map(entry => entry[1]).concat([other]);
        }

        return {
            id: `chart-bar-${this.safeId(column)}-${chartIndex}`,
            type: 'bar',
            title: `${titlePrefix} ${column}`,
            data: {
                labels,
                datasets: [{
                    label: 'Count',
                    data: values,
                    backgroundColor: COLORS,
                    borderColor: BORDER_COLORS,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${titlePrefix} ${column}`
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: column
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
                            text: 'Count'
                        },
                        beginAtZero: true
                    }
                }
            }
        };
    }

    createPieChartConfig(column, frequency, chartIndex) {
        const entries = this.sortEntries(Object.entries(frequency), 'value');
        const labels = entries.map(entry => entry[0]);
        const values = entries.map(entry => entry[1]);

        return {
            id: `chart-pie-${this.safeId(column)}-${chartIndex}`,
            type: 'pie',
            title: `Composition of ${column}`,
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: COLORS,
                    borderColor: BORDER_COLORS,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Composition of ${column}`
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        };
    }

    createHistogramConfig(column, values, chartIndex) {
        const sorted = [...values].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const binCount = Math.min(10, values.length);

        let labels = [];
        let bins = [];

        if (min === max || binCount <= 1) {
            labels = [String(min)];
            bins = [values.length];
        } else {
            const binSize = (max - min) / binCount;
            bins = new Array(binCount).fill(0);

            for (let i = 0; i < binCount; i++) {
                const start = min + i * binSize;
                const end = min + (i + 1) * binSize;
                labels.push(`${start.toFixed(2)} - ${end.toFixed(2)}`);
            }

            values.forEach(value => {
                const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
                bins[binIndex]++;
            });
        }

        return {
            id: `chart-histogram-${this.safeId(column)}-${chartIndex}`,
            type: 'bar',
            title: `Distribution of ${column}`,
            data: {
                labels,
                datasets: [{
                    label: 'Frequency',
                    data: bins,
                    backgroundColor: COLORS[0],
                    borderColor: BORDER_COLORS[0],
                    borderWidth: 1,
                    barPercentage: 1,
                    categoryPercentage: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Distribution of ${column}`
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: column
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
                            text: 'Frequency'
                        },
                        beginAtZero: true
                    }
                }
            }
        };
    }

    createDateLineChart(data, dateColumn, valueColumn, chartIndex) {
        const rows = data.map(row => {
            const dateValue = row[dateColumn];
            const numericValue = row[valueColumn];

            if (dateValue === null || dateValue === undefined || dateValue === '') {
                return null;
            }
            if (typeof numericValue !== 'number' || isNaN(numericValue)) {
                return null;
            }

            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            if (isNaN(date.getTime())) {
                return null;
            }

            return {
                date,
                label: this.formatDate(dateValue),
                value: numericValue
            };
        }).filter(row => row !== null);

        if (rows.length === 0) {
            return null;
        }

        rows.sort((a, b) => a.date - b.date);

        let sample = rows;
        if (rows.length > 100) {
            const step = Math.ceil(rows.length / 100);
            sample = rows.filter((_, index) => index % step === 0);
        }

        return {
            id: `chart-line-${this.safeId(dateColumn)}-${chartIndex}`,
            type: 'line',
            title: `${valueColumn} over ${dateColumn}`,
            data: {
                labels: sample.map(row => row.label),
                datasets: [{
                    label: valueColumn,
                    data: sample.map(row => row.value),
                    fill: false,
                    borderColor: COLORS[0],
                    backgroundColor: COLORS[0],
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${valueColumn} over ${dateColumn}`
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: dateColumn
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
                            text: valueColumn
                        },
                        beginAtZero: true
                    }
                }
            }
        };
    }

    createCorrelationChart(data, columns, chartIndex) {
        const pairs = [];

        for (let i = 0; i < columns.length; i++) {
            for (let j = i + 1; j < columns.length; j++) {
                const col1 = columns[i];
                const col2 = columns[j];
                const pairedRows = data.filter(row => {
                    const v1 = row[col1];
                    const v2 = row[col2];
                    return typeof v1 === 'number' && !isNaN(v1) && typeof v2 === 'number' && !isNaN(v2);
                });

                if (pairedRows.length === 0) {
                    continue;
                }

                const values1 = pairedRows.map(row => row[col1]);
                const values2 = pairedRows.map(row => row[col2]);

                const correlation = statistics.correlation(values1, values2);
                if (!isNaN(correlation)) {
                    pairs.push({ label: `${col1} vs ${col2}`, value: correlation });
                }
            }
        }

        if (pairs.length === 0) {
            return null;
        }

        pairs.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
        const topPairs = pairs.slice(0, 10);
        const labels = topPairs.map(pair => pair.label);
        const values = topPairs.map(pair => Number(pair.value.toFixed(2)));

        const colors = values.map(value =>
            value >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        );
        const borderColors = colors.map(color => color.replace('0.8', '1'));

        return {
            id: `chart-correlation-${chartIndex}`,
            type: 'bar',
            title: 'Strongest Numeric Correlations',
            data: {
                labels,
                datasets: [{
                    label: 'Correlation',
                    data: values,
                    backgroundColor: colors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Strongest Numeric Correlations'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Column Pair'
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        min: -1,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Correlation Coefficient'
                        },
                        beginAtZero: false
                    }
                }
            }
        };
    }

    safeId(value) {
        return String(value).replace(/[^a-zA-Z0-9]/g, '-');
    }

    formatDate(value) {
        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        return String(value);
    }
}

module.exports = new VisualizationService();
