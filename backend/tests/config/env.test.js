const path = require('path');

describe('environment path resolution', () => {
    const originalCwd = process.cwd();
    const originalReportDir = process.env.REPORT_DIR;
    const originalUploadDir = process.env.UPLOAD_DIR;

    beforeEach(() => {
        delete process.env.REPORT_DIR;
        delete process.env.UPLOAD_DIR;
        jest.resetModules();
    });

    afterEach(() => {
        process.chdir(originalCwd);
        if (originalReportDir === undefined) {
            delete process.env.REPORT_DIR;
        } else {
            process.env.REPORT_DIR = originalReportDir;
        }

        if (originalUploadDir === undefined) {
            delete process.env.UPLOAD_DIR;
        } else {
            process.env.UPLOAD_DIR = originalUploadDir;
        }
    });

    test('resolves report and upload directories from the backend root by default', () => {
        const workspaceRoot = path.resolve(__dirname, '..', '..');
        process.chdir(workspaceRoot);

        const env = require('../../config/env');

        expect(env.reportDir).toBe(path.resolve(workspaceRoot, 'reports'));
        expect(env.uploadDir).toBe(path.resolve(workspaceRoot, 'uploads'));
    });
});
