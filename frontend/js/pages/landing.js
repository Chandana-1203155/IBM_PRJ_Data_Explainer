// Landing Page Logic - AI Data Explainer+

const LandingPage = {
    init() {
        this.setupScrollAnimations();
        this.setupCTAButtons();
    },

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    },

    setupCTAButtons() {
        // CTA buttons are handled by App.showDashboard()
        // This is a placeholder for any additional landing page logic
    }
};

// Initialize landing page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LandingPage.init();
});
