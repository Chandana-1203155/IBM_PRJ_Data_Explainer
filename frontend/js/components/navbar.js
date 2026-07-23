// Navigation Component - AI Data Explainer+

const Navbar = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.style.display = 'none';
                }
            });
        }
    },

    setupSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ block: 'start' });
                        // Close mobile menu
                        const navMenu = document.querySelector('.nav-menu');
                        if (navMenu) {
                            navMenu.style.display = 'none';
                        }
                    }
                }
            });
        });
    }
};

// Initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Navbar.init();
});
