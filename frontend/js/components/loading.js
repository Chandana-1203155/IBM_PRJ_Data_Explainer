// Loading Skeleton Component - AI Data Explainer+

const Loading = {
    show(container, type = 'default') {
        if (!container) return;

        const skeletonHTML = this.getSkeletonHTML(type);
        container.innerHTML = skeletonHTML;
    },

    getSkeletonHTML(type) {
        switch (type) {
            case 'card':
                return `
                    <div class="card skeleton">
                        <div class="card-icon"></div>
                        <div class="card-content">
                            <div class="card-value skeleton-text"></div>
                            <div class="card-label skeleton-text"></div>
                        </div>
                    </div>
                `;
            case 'table':
                return `
                    <div class="preview-table skeleton">
                        <table>
                            <thead>
                                <tr><th class="skeleton-text"></th><th class="skeleton-text"></th><th class="skeleton-text"></th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="skeleton-text"></td><td class="skeleton-text"></td><td class="skeleton-text"></td></tr>
                                <tr><td class="skeleton-text"></td><td class="skeleton-text"></td><td class="skeleton-text"></td></tr>
                                <tr><td class="skeleton-text"></td><td class="skeleton-text"></td><td class="skeleton-text"></td></tr>
                            </tbody>
                        </table>
                    </div>
                `;
            case 'text':
                return `
                    <div class="skeleton-text long"></div>
                    <div class="skeleton-text long"></div>
                    <div class="skeleton-text medium"></div>
                `;
            default:
                return `
                    <div class="spinner"></div>
                `;
        }
    },

    hide(container, content) {
        if (!container) return;
        if (content) {
            container.innerHTML = content;
        } else {
            container.innerHTML = '';
        }
    }
};
