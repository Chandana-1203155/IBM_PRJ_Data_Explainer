// Report Service - AI Data Explainer+

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const { v4: uuidv4 } = require('uuid');

class ReportService {
    constructor() {
        this.pageWidth = 595.28; // A4 width
        this.pageHeight = 841.89; // A4 height
        this.margin = 50;
        this.contentWidth = this.pageWidth - 2 * this.margin;
    }

    async generateReport(session, chartImages = []) {
        try {
            if (!fs.existsSync(env.reportDir)) {
                fs.mkdirSync(env.reportDir, { recursive: true });
            }

            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            let page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addCoverPage(page, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addTableOfContents(page, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addDatasetOverview(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addColumnDetails(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addDataQuality(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addDataPreview(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addStatistics(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addInsights(page, pdfDoc, session, font, boldFont);

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addRecommendations(page, pdfDoc, session, font, boldFont);

            if (Array.isArray(chartImages) && chartImages.length > 0) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                page = await this.addCharts(page, pdfDoc, session, chartImages, font, boldFont);
            }

            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            page = await this.addConclusion(page, pdfDoc, session, font, boldFont);

            await this.addPageNumbers(pdfDoc, font);

            const filename = `report-${uuidv4()}.pdf`;
            const filepath = path.resolve(env.reportDir, filename);
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(filepath, pdfBytes);

            return {
                reportUrl: `/reports/${filename}`,
                filename
            };
        } catch (error) {
            console.error('Report generation error:', error);
            throw error;
        }
    }

    async addCoverPage(page, session, font, boldFont) {
        const { width, height } = page.getSize();

        // Background
        page.drawRectangle({
            x: 0,
            y: 0,
            width: width,
            height: height,
            color: rgb(0.97, 0.97, 0.99)
        });

        // Header accent
        page.drawRectangle({
            x: 0,
            y: height - 160,
            width: width,
            height: 160,
            color: rgb(0.13, 0.2, 0.55)
        });

        const title = 'AI Data Explainer+';
        const titleWidth = boldFont.widthOfTextAtSize(title, 36);
        page.drawText(title, {
            x: (width - titleWidth) / 2,
            y: height - 95,
            size: 36,
            font: boldFont,
            color: rgb(1, 1, 1)
        });

        const subtitle = 'Data Analysis Report';
        const subtitleWidth = font.widthOfTextAtSize(subtitle, 18);
        page.drawText(subtitle, {
            x: (width - subtitleWidth) / 2,
            y: height - 130,
            size: 18,
            font: font,
            color: rgb(0.9, 0.9, 0.9)
        });

        // Info box
        const infoY = height - 300;
        page.drawRectangle({
            x: this.margin,
            y: infoY - 130,
            width: this.contentWidth,
            height: 130,
            color: rgb(1, 1, 1),
            borderColor: rgb(0.8, 0.8, 0.85),
            borderWidth: 1
        });

        page.drawText('Dataset Information', {
            x: this.margin + 20,
            y: infoY - 30,
            size: 16,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        const filename = session?.filename || 'Unknown';
        const project = 'AI Data Explainer+';
        page.drawText(`Project: ${project}`, {
            x: this.margin + 20,
            y: infoY - 60,
            size: 13,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
        });

        page.drawText(`Dataset: ${filename}`, {
            x: this.margin + 20,
            y: infoY - 85,
            size: 13,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
        });

        page.drawText(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, {
            x: this.margin + 20,
            y: infoY - 110,
            size: 13,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
        });

        // Footer
        const footer = 'Generated by AI Data Explainer+ | Confidential Report';
        const footerWidth = font.widthOfTextAtSize(footer, 10);
        page.drawText(footer, {
            x: (width - footerWidth) / 2,
            y: 50,
            size: 10,
            font: font,
            color: rgb(0.6, 0.6, 0.6)
        });

        return page;
    }

    async addTableOfContents(page, font, boldFont) {
        const { width, height } = page.getSize();
        let y = height - 80;

        page.drawText('Table of Contents', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const contents = [
            'Dataset Overview',
            'Column Details',
            'Data Quality Summary',
            'Data Preview',
            'Statistical Analysis',
            'AI-Generated Insights',
            'Actionable Recommendations',
            'Charts',
            'Conclusion'
        ];

        contents.forEach((item, index) => {
            page.drawText(`${index + 1}. ${item}`, {
                x: this.margin + 20,
                y: y,
                size: 14,
                font: font,
                color: rgb(0.2, 0.2, 0.2)
            });
            y -= 30;
        });

        return page;
    }

    async addDatasetOverview(page, pdfDoc, session, font, boldFont) {
        const { width, height } = page.getSize();
        let y = height - 80;

        page.drawText('Dataset Overview', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const metadata = session?.metadata || {};
        const infoItems = [
            { label: 'Total Rows', value: (metadata.rows || 0).toLocaleString() },
            { label: 'Total Columns', value: metadata.columns || 0 },
            { label: 'File Size', value: `${((metadata.fileSize || 0) / 1024).toFixed(2)} KB` },
            { label: 'Memory Usage', value: `${((metadata.memoryUsage || 0) / 1024).toFixed(2)} KB` }
        ];

        let x = this.margin;
        infoItems.forEach((item, index) => {
            if (index % 2 === 0 && index > 0) {
                x = this.margin;
                y -= 80;
            }

            page.drawRectangle({
                x: x,
                y: y - 70,
                width: (this.contentWidth / 2) - 10,
                height: 70,
                color: rgb(0.97, 0.97, 1),
                borderColor: rgb(0.8, 0.8, 0.9),
                borderWidth: 1
            });

            page.drawText(item.label, {
                x: x + 10,
                y: y - 20,
                size: 11,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });

            page.drawText(String(item.value), {
                x: x + 10,
                y: y - 45,
                size: 18,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            x += (this.contentWidth / 2) + 10;
        });

        y -= 100;

        if (y < 150) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        page.drawText('Dataset Name', {
            x: this.margin,
            y: y,
            size: 16,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 25;
        page.drawText(session?.filename || 'Unknown', {
            x: this.margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
        });

        y -= 35;

        if (y < 150) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        page.drawText('Column Names', {
            x: this.margin,
            y: y,
            size: 16,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 25;
        const columnNames = (metadata.columnNames || []).join(', ');
        const wrappedNames = this.wrapText(columnNames, this.contentWidth, font, 11);
        wrappedNames.forEach(line => {
            if (y < 60) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = this.pageHeight - 80;
            }
            page.drawText(line, {
                x: this.margin,
                y: y,
                size: 11,
                font: font,
                color: rgb(0.3, 0.3, 0.3)
            });
            y -= 16;
        });

        return page;
    }

    async addColumnDetails(page, pdfDoc, session, font, boldFont) {
        const { height } = page.getSize();
        let y = height - 80;

        page.drawText('Column Details', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const metadata = session?.metadata || {};
        const columnNames = metadata.columnNames || [];
        const columnTypes = metadata.columnTypes || {};
        const missingValues = metadata.missingValues || {};
        const uniqueValues = metadata.uniqueValues || {};

        if (columnNames.length === 0) {
            page.drawText('No column details available', {
                x: this.margin,
                y: y,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
            return page;
        }

        const rows = columnNames.map(col => [
            col,
            columnTypes[col] || 'N/A',
            String(missingValues[col] || 0),
            String(uniqueValues[col] || 0)
        ]);

        const colWidths = [
            this.contentWidth * 0.35,
            this.contentWidth * 0.25,
            this.contentWidth * 0.2,
            this.contentWidth * 0.2
        ];

        const result = this.drawTable(page, pdfDoc, ['Column Name', 'Type', 'Missing Values', 'Unique Values'], rows, colWidths, this.margin, y, font, boldFont, { fontSize: 10 });
        return result.page;
    }

    async addDataQuality(page, pdfDoc, session, font, boldFont) {
        const { height } = page.getSize();
        let y = height - 80;

        page.drawText('Data Quality Summary', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const metadata = session?.metadata || {};
        const analysis = session?.analysis || {};
        const totalRows = metadata.rows || 0;
        const totalColumns = metadata.columns || 0;
        const totalCells = totalRows * totalColumns;
        const missingValues = metadata.missingValues || {};
        const totalMissing = Object.values(missingValues).reduce((sum, val) => sum + (val || 0), 0);
        const duplicateRows = analysis.duplicateRows || 0;
        const completeness = totalCells > 0 ? (((totalCells - totalMissing) / totalCells) * 100).toFixed(2) : '100.00';

        const infoItems = [
            { label: 'Total Rows', value: totalRows.toLocaleString() },
            { label: 'Total Columns', value: totalColumns },
            { label: 'Missing Values', value: totalMissing.toLocaleString() },
            { label: 'Duplicate Rows', value: duplicateRows.toLocaleString() }
        ];

        let x = this.margin;
        infoItems.forEach((item, index) => {
            if (index % 2 === 0 && index > 0) {
                x = this.margin;
                y -= 80;
            }

            page.drawRectangle({
                x: x,
                y: y - 70,
                width: (this.contentWidth / 2) - 10,
                height: 70,
                color: rgb(0.97, 0.97, 1),
                borderColor: rgb(0.8, 0.8, 0.9),
                borderWidth: 1
            });

            page.drawText(item.label, {
                x: x + 10,
                y: y - 20,
                size: 11,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });

            page.drawText(String(item.value), {
                x: x + 10,
                y: y - 45,
                size: 18,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            x += (this.contentWidth / 2) + 10;
        });

        y -= 100;

        if (y < 150) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        page.drawText(`Data Completeness: ${completeness}%`, {
            x: this.margin,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.8)
        });

        y -= 40;

        if (y < 150) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        page.drawText('Missing Values by Column', {
            x: this.margin,
            y: y,
            size: 16,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 35;

        const rows = Object.keys(missingValues).map(col => [col, String(missingValues[col])]);
        const colWidths = [this.contentWidth * 0.7, this.contentWidth * 0.3];

        const result = this.drawTable(page, pdfDoc, ['Column', 'Missing Values'], rows, colWidths, this.margin, y, font, boldFont, { fontSize: 10 });
        return result.page;
    }

    async addDataPreview(page, pdfDoc, session, font, boldFont) {
        const { height } = page.getSize();
        let y = height - 80;

        page.drawText('Data Preview (First 5 Rows)', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const preview = (session?.preview || []).slice(0, 5);
        const columns = session?.metadata?.columnNames || [];

        if (preview.length === 0 || columns.length === 0) {
            page.drawText('No data available for preview', {
                x: this.margin,
                y: y,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
            return page;
        }

        const colWidth = this.contentWidth / columns.length;
        const fontSize = Math.min(9, Math.max(7, Math.floor(colWidth / 8)));
        const rows = preview.map(row => columns.map(col => {
            const val = row[col];
            return val === null || val === undefined ? '' : String(val);
        }));
        const colWidths = columns.map(() => colWidth);

        const result = this.drawTable(page, pdfDoc, columns, rows, colWidths, this.margin, y, font, boldFont, { fontSize });
        return result.page;
    }

    async addStatistics(page, pdfDoc, session, font, boldFont) {
        const { width, height } = page.getSize();
        let y = height - 80;

        page.drawText('Statistical Analysis', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const analysis = session?.analysis;

        if (!analysis || !analysis.statistics) {
            page.drawText('No statistical analysis available', {
                x: this.margin,
                y: y,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
            return page;
        }

        const numericStats = analysis.statistics.numeric || {};
        const categoricalStats = analysis.statistics.categorical || {};

        // Numeric statistics
        if (Object.keys(numericStats).length > 0) {
            page.drawText('Numeric Columns', {
                x: this.margin,
                y: y,
                size: 18,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            y -= 30;

            Object.entries(numericStats).forEach(([col, stats]) => {
                if (y < 180) {
                    page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                    y = this.pageHeight - 80;
                }

                page.drawRectangle({
                    x: this.margin,
                    y: y - 85,
                    width: this.contentWidth,
                    height: 85,
                    color: rgb(0.98, 0.98, 1),
                    borderColor: rgb(0.85, 0.85, 0.95),
                    borderWidth: 1
                });

                page.drawText(col, {
                    x: this.margin + 10,
                    y: y - 20,
                    size: 14,
                    font: boldFont,
                    color: rgb(0, 0, 0)
                });

                const statsData = [
                    { label: 'Mean', value: stats.mean !== undefined ? stats.mean.toFixed(2) : 'N/A' },
                    { label: 'Median', value: stats.median !== undefined ? stats.median.toFixed(2) : 'N/A' },
                    { label: 'Min', value: stats.min !== undefined ? stats.min.toFixed(2) : 'N/A' },
                    { label: 'Max', value: stats.max !== undefined ? stats.max.toFixed(2) : 'N/A' },
                    { label: 'Std Dev', value: stats.std !== undefined ? stats.std.toFixed(2) : 'N/A' }
                ];

                let statX = this.margin + 10;
                statsData.forEach(stat => {
                    page.drawText(`${stat.label}:`, {
                        x: statX,
                        y: y - 45,
                        size: 10,
                        font: font,
                        color: rgb(0.5, 0.5, 0.5)
                    });

                    page.drawText(String(stat.value), {
                        x: statX,
                        y: y - 60,
                        size: 12,
                        font: boldFont,
                        color: rgb(0.13, 0.2, 0.55)
                    });

                    statX += this.contentWidth / 5;
                });

                y -= 100;
            });
        }

        // Categorical statistics
        if (Object.keys(categoricalStats).length > 0) {
            if (y < 150) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = this.pageHeight - 80;
            }

            page.drawText('Categorical Columns', {
                x: this.margin,
                y: y,
                size: 18,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            y -= 30;

            Object.entries(categoricalStats).forEach(([col, stats]) => {
                if (y < 80) {
                    page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                    y = this.pageHeight - 80;
                }

                page.drawText(col, {
                    x: this.margin + 10,
                    y: y,
                    size: 14,
                    font: boldFont,
                    color: rgb(0, 0, 0)
                });

                page.drawText(`Mode: ${stats.mode !== undefined ? stats.mode : 'N/A'}`, {
                    x: this.margin + 20,
                    y: y - 20,
                    size: 11,
                    font: font,
                    color: rgb(0.3, 0.3, 0.3)
                });

                page.drawText(`Unique Values: ${stats.unique !== undefined ? stats.unique : 'N/A'}`, {
                    x: this.margin + 20,
                    y: y - 38,
                    size: 11,
                    font: font,
                    color: rgb(0.3, 0.3, 0.3)
                });

                y -= 55;
            });
        }

        return page;
    }

    async addInsights(page, pdfDoc, session, font, boldFont) {
        const { width, height } = page.getSize();
        let y = height - 80;

        page.drawText('AI-Generated Insights', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const insights = session?.insights;

        if (!insights) {
            page.drawText('No insights available. Generate insights to see AI-powered analysis.', {
                x: this.margin,
                y: y,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
            return page;
        }

        const sections = [
            { title: 'Executive Summary', key: 'executiveSummary', type: 'string' },
            { title: 'Business Summary', key: 'businessSummary', type: 'string' },
            { title: 'Key Findings', key: 'keyFindings', type: 'array' },
            { title: 'Identified Patterns', key: 'patterns', type: 'array' },
            { title: 'Trends', key: 'trends', type: 'array' },
            { title: 'Outliers', key: 'outliers', type: 'array' },
            { title: 'Customer Behavior', key: 'customerBehavior', type: 'array' },
            { title: 'Sales Insights', key: 'salesInsights', type: 'array' },
            { title: 'Growth Opportunities', key: 'growthOpportunities', type: 'array' },
            { title: 'Risk Analysis', key: 'riskAnalysis', type: 'array' },
            { title: 'Recommendations', key: 'recommendations', type: 'array' },
            { title: 'Future Scope', key: 'futureScope', type: 'array' }
        ];

        sections.forEach(section => {
            let value = insights[section.key];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                return;
            }

            if (section.type === 'array' && !Array.isArray(value)) {
                value = [String(value)];
            }

            if (y < 150) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = this.pageHeight - 80;
            }

            page.drawText(section.title, {
                x: this.margin,
                y: y,
                size: 16,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            y -= 28;

            if (section.type === 'string') {
                const wrapped = this.wrapText(String(value), this.contentWidth, font, 11);
                wrapped.forEach(line => {
                    if (y < 60) {
                        page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                        y = this.pageHeight - 80;
                    }
                    page.drawText(line, {
                        x: this.margin,
                        y: y,
                        size: 11,
                        font: font,
                        color: rgb(0.3, 0.3, 0.3)
                    });
                    y -= 16;
                });
            } else {
                value.forEach((item, index) => {
                    if (y < 60) {
                        page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                        y = this.pageHeight - 80;
                    }
                    const wrapped = this.wrapText(String(item), this.contentWidth - 20, font, 10);
                    wrapped.forEach((line, lineIndex) => {
                        if (y < 60) {
                            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                            y = this.pageHeight - 80;
                        }
                        page.drawText(lineIndex === 0 ? `• ${line}` : `  ${line}`, {
                            x: this.margin + 10,
                            y: y,
                            size: 10,
                            font: font,
                            color: rgb(0, 0, 0)
                        });
                        y -= 14;
                    });
                    y -= 4;
                });
            }

            y -= 15;
        });

        return page;
    }

    async addRecommendations(page, pdfDoc, session, font, boldFont) {
        const { width, height } = page.getSize();
        let y = height - 80;

        page.drawText('Actionable Recommendations', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const recommendations = session?.recommendations;

        if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
            page.drawText('No recommendations available. Generate recommendations to see AI-powered suggestions.', {
                x: this.margin,
                y: y,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
            return page;
        }

        recommendations.recommendations.forEach((rec, index) => {
            const wrappedRec = this.wrapText(rec.recommendation || '', width - 2 * this.margin - 140, font, 12);
            const wrappedReason = this.wrapText(rec.reason || '', width - 2 * this.margin - 100, font, 10);
            const wrappedImpact = this.wrapText(rec.expectedImpact || '', width - 2 * this.margin - 100, font, 10);

            // Calculate card height with proper spacing:
            // 60 (base) + rec text + 14 (Reason label) + reason text + 15 (spacing) + 14 (Impact label) + impact text + 15 (bottom margin)
            const cardHeight = 60 + (wrappedRec.length * 16) + 14 + (wrappedReason.length * 13) + 15 + 14 + (wrappedImpact.length * 13) + 15;

            if (y - cardHeight < 80) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = this.pageHeight - 80;
            }

            let priorityColor = rgb(0.5, 0.5, 0.5);
            if (rec.priority === 'High') priorityColor = rgb(0.8, 0.2, 0.2);
            else if (rec.priority === 'Medium') priorityColor = rgb(0.8, 0.6, 0.2);
            else if (rec.priority === 'Low') priorityColor = rgb(0.2, 0.8, 0.2);

            page.drawRectangle({
                x: this.margin,
                y: y - cardHeight,
                width: this.contentWidth,
                height: cardHeight,
                color: rgb(0.98, 0.98, 1),
                borderColor: rgb(0.85, 0.85, 0.95),
                borderWidth: 1
            });

            page.drawRectangle({
                x: width - this.margin - 80,
                y: y - 30,
                width: 70,
                height: 25,
                color: priorityColor
            });

            page.drawText(rec.priority || 'Medium', {
                x: width - this.margin - 70,
                y: y - 20,
                size: 11,
                font: boldFont,
                color: rgb(1, 1, 1)
            });

            page.drawText(`${index + 1}.`, {
                x: this.margin + 10,
                y: y - 20,
                size: 16,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });

            wrappedRec.forEach((line, lineIndex) => {
                page.drawText(line, {
                    x: this.margin + 45,
                    y: y - 20 - (lineIndex * 16),
                    size: 12,
                    font: boldFont,
                    color: rgb(0, 0, 0)
                });
            });

            let recY = y - 30 - (wrappedRec.length * 16);

            page.drawText('Reason:', {
                x: this.margin + 10,
                y: recY,
                size: 10,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });

            recY -= 14;
            wrappedReason.forEach((line, lineIndex) => {
                page.drawText(line, {
                    x: this.margin + 10,
                    y: recY - (lineIndex * 13),
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0)
                });
            });

            recY -= (wrappedReason.length * 13) + 15;

            page.drawText('Expected Impact:', {
                x: this.margin + 10,
                y: recY,
                size: 10,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });

            recY -= 14;
            wrappedImpact.forEach((line, lineIndex) => {
                page.drawText(line, {
                    x: this.margin + 10,
                    y: recY - (lineIndex * 13),
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0)
                });
            });

            y -= cardHeight + 20;
        });

        return page;
    }

    async addCharts(page, pdfDoc, session, chartImages, font, boldFont) {
        const pageHeight = page.getSize().height;
        const pageWidth = page.getSize().width;
        const headerY = pageHeight - 80;
        const maxChartWidth = this.contentWidth;
        const maxChartHeight = pageHeight - this.margin - 120;
        let y = headerY;

        const renderPageHeader = (pageToDraw) => {
            pageToDraw.drawText('Charts', {
                x: this.margin,
                y: headerY,
                size: 24,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });
            return headerY - 50;
        };

        y = renderPageHeader(page);

        console.log('Embedding chart images into PDF:', chartImages.length);
        chartImages.forEach((item, idx) => {
            const imageValue = typeof item?.image === 'string' ? item.image : '';
            const imageType = typeof item?.image;
            console.log(`Chart[${idx}] title=${item?.title} type=${imageType} prefix=${imageValue.slice(0, 100)} length=${imageValue.length} mimeType=${imageValue.match(/^data:([^;,]+)(;[^;,]+)*;base64,/i)?.[1] || 'unknown'} regexMatched=${/^data:([^;,]+)(;[^;,]+)*;base64,(.+)$/i.test(imageValue)}`);
        });

        for (let index = 0; index < chartImages.length; index++) {
            const chartImage = chartImages[index];
            const title = chartImage?.title || `Chart ${index + 1}`;

            if (!chartImage || !chartImage.image) {
                const message = `Chart ${index + 1} failed: missing image payload`;
                console.error(message, chartImage);
                page.drawText(message, {
                    x: this.margin,
                    y: y,
                    size: 12,
                    font: font,
                    color: rgb(1, 0, 0)
                });
                y -= 30;
                continue;
            }

            let image;
            try {
                image = await this.embedChartImage(pdfDoc, chartImage.image);
                console.log(`Embedded chart ${index + 1} dimensions:`, {
                    width: image.width,
                    height: image.height
                });
            } catch (error) {
                const message = `Chart ${index + 1} failed to embed: ${title}`;
                console.error(message, error);
                page.drawText(message, {
                    x: this.margin,
                    y: y,
                    size: 12,
                    font: font,
                    color: rgb(1, 0, 0)
                });
                y -= 30;
                continue;
            }

            let imgWidth = image.width;
            let imgHeight = image.height;
            const scale = Math.min(maxChartWidth / imgWidth, maxChartHeight / imgHeight, 1);
            imgWidth = Math.round(imgWidth * scale);
            imgHeight = Math.round(imgHeight * scale);
            const imgX = this.margin + ((maxChartWidth - imgWidth) / 2);

            if (y - imgHeight < this.margin + 60) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = renderPageHeader(page);
            }

            page.drawText(`${index + 1}. ${title}`, {
                x: this.margin,
                y: y,
                size: 14,
                font: boldFont,
                color: rgb(0.13, 0.2, 0.55)
            });
            y -= 30;

            page.drawImage(image, {
                x: imgX,
                y: y - imgHeight,
                width: imgWidth,
                height: imgHeight
            });

            y -= imgHeight + 40;
            chartImages[index].image = null;
        }

        return page;
    }

    async addConclusion(page, pdfDoc, session, font, boldFont) {
        const { height } = page.getSize();
        let y = height - 80;

        page.drawText('Conclusion', {
            x: this.margin,
            y: y,
            size: 24,
            font: boldFont,
            color: rgb(0.13, 0.2, 0.55)
        });

        y -= 50;

        const metadata = session?.metadata || {};
        const insights = session?.insights;
        const recommendations = session?.recommendations;

        const keyFindings = insights?.keyFindings || [];
        const recs = recommendations?.recommendations || [];

        const conclusionText = [
            `This report analyzed the dataset "${session?.filename || 'Unknown'}" containing ${(metadata.rows || 0).toLocaleString()} rows and ${metadata.columns || 0} columns.`,
            `The analysis identified ${keyFindings.length} key findings and generated ${recs.length} actionable recommendations.`,
            `For continued value, regularly review the data quality, track trends over time, and act on the high-priority recommendations outlined in this report.`
        ];

        conclusionText.forEach(paragraph => {
            const wrapped = this.wrapText(paragraph, this.contentWidth, font, 12);
            wrapped.forEach(line => {
                if (y < 60) {
                    page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                    y = this.pageHeight - 80;
                }
                page.drawText(line, {
                    x: this.margin,
                    y: y,
                    size: 12,
                    font: font,
                    color: rgb(0.3, 0.3, 0.3)
                });
                y -= 18;
            });
            y -= 10;
        });

        y -= 30;

        if (y < 80) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        const generatedText = `Report generated by AI Data Explainer+ on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
        const generatedWidth = font.widthOfTextAtSize(generatedText, 10);
        page.drawText(generatedText, {
            x: (this.pageWidth - generatedWidth) / 2,
            y: y,
            size: 10,
            font: font,
            color: rgb(0.6, 0.6, 0.6)
        });

        return page;
    }

    async addPageNumbers(pdfDoc, font) {
        const pages = pdfDoc.getPages();

        pages.forEach((page, index) => {
            const { width } = page.getSize();

            // Cover footer area to avoid overlap
            page.drawRectangle({
                x: this.margin,
                y: 20,
                width: this.contentWidth,
                height: 20,
                color: rgb(1, 1, 1)
            });

            const text = `Page ${index + 1} of ${pages.length}`;
            const textWidth = font.widthOfTextAtSize(text, 10);
            page.drawText(text, {
                x: (width - textWidth) / 2,
                y: 30,
                size: 10,
                font: font,
                color: rgb(0.5, 0.5, 0.5)
            });
        });
    }

    async embedChartImage(pdfDoc, imageData) {
        const dataUrl = String(imageData || '').trim();
        const preview = dataUrl.slice(0, 100);
        const mimeType = dataUrl.match(/^data:([^;,]+)(;[^;,]+)*;base64,/i)?.[1] || 'unknown';
        const regexMatched = /^data:([^;,]+)(;[^;,]+)*;base64,(.+)$/i.test(dataUrl);

        console.log('[embedChartImage] pre-parse debug:', {
            imageType: typeof imageData,
            preview,
            totalLength: dataUrl.length,
            mimeType,
            regexMatched
        });

        const match = dataUrl.match(/^data:([^;,]+)(;[^;,]+)*;base64,(.+)$/i);
        if (!match) {
            throw new Error('Unsupported chart image format');
        }

        const parsedMimeType = match[1].toLowerCase();
        const base64 = match[3];
        if (!base64 || base64.length < 100) {
            throw new Error('Chart image base64 payload is empty or too short');
        }

        const buffer = Buffer.from(base64, 'base64');
        if (!buffer || buffer.length === 0) {
            throw new Error('Failed to decode chart image data');
        }

        if (parsedMimeType.includes('png')) {
            if (buffer.length < 1000 || !buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
                throw new Error('Invalid PNG image data');
            }
            return await pdfDoc.embedPng(buffer);
        }

        if (parsedMimeType.includes('jpeg') || parsedMimeType.includes('jpg')) {
            if (buffer.length < 1000 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
                throw new Error('Invalid JPEG image data');
            }
            return await pdfDoc.embedJpg(buffer);
        }

        throw new Error(`Unsupported embedded image type: ${parsedMimeType}`);
    }

    drawTable(page, pdfDoc, headers, rows, colWidths, x, y, font, boldFont, options = {}) {
        const fontSize = options.fontSize || 9;
        const lineHeight = fontSize * 1.3;
        const rowPadding = 6;
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);

        const headerLines = headers.map((header, i) => this.wrapText(String(header), colWidths[i] - 10, boldFont, fontSize));
        const headerLineCount = Math.max(1, ...headerLines.map(lines => lines.length));
        const headerHeight = headerLineCount * lineHeight + 10;

        if (y - headerHeight < 60) {
            page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
            y = this.pageHeight - 80;
        }

        // Header background
        page.drawRectangle({
            x: x,
            y: y - headerHeight,
            width: tableWidth,
            height: headerHeight,
            color: rgb(0.13, 0.2, 0.55)
        });

        let colX = x;
        headers.forEach((header, i) => {
            const lines = headerLines[i];
            lines.forEach((line, lineIndex) => {
                page.drawText(line, {
                    x: colX + 5,
                    y: y - headerHeight + 6 + (lines.length - 1 - lineIndex) * lineHeight,
                    size: fontSize,
                    font: boldFont,
                    color: rgb(1, 1, 1)
                });
            });
            colX += colWidths[i];
        });

        y -= headerHeight;

        rows.forEach((row, rowIndex) => {
            const cellLines = row.map((cell, i) => this.wrapText(String(cell), colWidths[i] - 10, font, fontSize));
            const maxLines = Math.max(1, ...cellLines.map(lines => lines.length));
            const rowHeight = maxLines * lineHeight + rowPadding;

            if (y - rowHeight < 60) {
                page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
                y = this.pageHeight - 80;

                // Redraw header on new page
                page.drawRectangle({
                    x: x,
                    y: y - headerHeight,
                    width: tableWidth,
                    height: headerHeight,
                    color: rgb(0.13, 0.2, 0.55)
                });

                colX = x;
                headers.forEach((header, i) => {
                    const lines = headerLines[i];
                    lines.forEach((line, lineIndex) => {
                        page.drawText(line, {
                            x: colX + 5,
                            y: y - headerHeight + 6 + (lines.length - 1 - lineIndex) * lineHeight,
                            size: fontSize,
                            font: boldFont,
                            color: rgb(1, 1, 1)
                        });
                    });
                    colX += colWidths[i];
                });

                y -= headerHeight;
            }

            if (rowIndex % 2 === 0) {
                page.drawRectangle({
                    x: x,
                    y: y - rowHeight,
                    width: tableWidth,
                    height: rowHeight,
                    color: rgb(0.97, 0.97, 1)
                });
            }

            colX = x;
            cellLines.forEach((lines, i) => {
                lines.forEach((line, lineIndex) => {
                    page.drawText(line, {
                        x: colX + 5,
                        y: y - 5 - (lineIndex * lineHeight),
                        size: fontSize,
                        font: font,
                        color: rgb(0, 0, 0)
                    });
                });
                colX += colWidths[i];
            });

            y -= rowHeight;
        });

        return { page, y };
    }

    wrapText(text, maxWidth, font, fontSize) {
        const str = text !== undefined && text !== null ? String(text) : '';
        const words = str.split(/\s+/).filter(w => w.length > 0);
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (lineWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }
}

module.exports = new ReportService();
