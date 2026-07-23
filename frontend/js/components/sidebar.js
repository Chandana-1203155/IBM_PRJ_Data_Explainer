// Sidebar Component - AI Data Explainer+

const Sidebar = {
    init() {
        this.setupNavigation();
        this.setupMobileToggle();
    },

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.dataset.section;
                
                if (sectionId) {
                    this.navigateToSection(sectionId);
                }
            });
        });
    },

    setupMobileToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navToggle = document.querySelector('.nav-toggle');
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');

        // Debug: log elements so we can verify they exist and listeners attach
        try {
            console.debug('Sidebar.setupMobileToggle: menuToggle=', menuToggle, 'sidebar=', sidebar, 'sidebarToggle=', sidebarToggle);
        } catch (e) {
            // ignore console issues in older browsers
        }

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                console.debug('menuToggle clicked - toggling sidebar.open');
                sidebar.classList.toggle('open');
            });
            console.debug('Attached click handler to .menu-toggle');
        } else {
            console.warn('Sidebar.setupMobileToggle: .menu-toggle or .sidebar not found');
        }

        // Fallback: if there's a top-nav hamburger (nav-toggle), attach to it as well
        if (navToggle && sidebar) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                console.debug('navToggle clicked - toggling sidebar.open (fallback)');
                sidebar.classList.toggle('open');
            });
            console.debug('Attached click handler to .nav-toggle (fallback)');
        }

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                console.debug('sidebarToggle clicked - removing sidebar.open');
                sidebar.classList.remove('open');
            });
            console.debug('Attached click handler to .sidebar-toggle');
        }

        // Close sidebar when clicking outside on mobile (safe checks)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                const clickedOutsideSidebar = sidebar && !sidebar.contains(e.target);
                const clickedOutsideMenuToggle = !menuToggle || (menuToggle && !menuToggle.contains(e.target));
                if (clickedOutsideSidebar && clickedOutsideMenuToggle) {
                    console.debug('Clicked outside sidebar and menu toggle - closing sidebar');
                    sidebar.classList.remove('open');
                }
            }
        });
    },

    navigateToSection(sectionId) {
        // Update active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // Show corresponding section
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'section-' + sectionId) {
                section.classList.add('active');
            }
        });

        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    },

    setActiveSection(sectionId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }
};

// Robust initialization: call init immediately if DOM is ready, otherwise wait
function ensureSidebarInit() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                console.log('Sidebar: DOMContentLoaded event — initializing');
                Sidebar.init();
            } catch (e) {
                console.error('Sidebar.init error:', e);
            }
        });
    } else {
        try {
            console.log('Sidebar: document already ready — initializing');
            Sidebar.init();
        } catch (e) {
            console.error('Sidebar.init error:', e);
        }
    }
}

// Event delegation fallback so clicks toggle sidebar even if listeners weren't attached
document.addEventListener('click', (e) => {
    try {
        const menuToggle = e.target.closest && e.target.closest('.menu-toggle');
        const navToggle = e.target.closest && e.target.closest('.nav-toggle');
        const sidebarToggle = e.target.closest && e.target.closest('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');

        if ((menuToggle || navToggle) && sidebar) {
            e.stopPropagation();
            console.log('Sidebar (delegated) toggle clicked');
            sidebar.classList.toggle('open');
            return;
        }

        if (sidebarToggle && sidebar) {
            e.stopPropagation();
            console.log('Sidebar (delegated) close clicked');
            sidebar.classList.remove('open');
            return;
        }
    } catch (err) {
        // ignore delegation errors
    }
});

ensureSidebarInit();
