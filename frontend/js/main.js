// Main JavaScript Entry Point - AI Data Explainer+

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-theme';

    // Initialize application
    if (typeof App !== 'undefined') {
        App.init();
    }

    console.log('AI Data Explainer+ initialized');
});
