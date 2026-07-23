// Input Validators - AI Data Explainer+

const Validators = {
    validateFile(file) {
        const errors = [];

        // Check if file exists
        if (!file) {
            errors.push('No file selected');
            return { valid: false, errors };
        }

        // Check file extension
        const validExtensions = ['.csv', '.xlsx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            errors.push('Invalid file type. Only CSV and Excel files are allowed.');
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            errors.push('File size exceeds 10MB limit.');
        }

        // Check if file is empty
        if (file.size === 0) {
            errors.push('File is empty.');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validateRequired(value) {
        return value !== null && value !== undefined && value !== '';
    },

    validateNumber(value, min = null, max = null) {
        const num = Number(value);
        if (isNaN(num)) {
            return false;
        }
        if (min !== null && num < min) {
            return false;
        }
        if (max !== null && num > max) {
            return false;
        }
        return true;
    },

    validateStringLength(value, min = null, max = null) {
        const length = value.length;
        if (min !== null && length < min) {
            return false;
        }
        if (max !== null && length > max) {
            return false;
        }
        return true;
    },

    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .trim();
    }
};
