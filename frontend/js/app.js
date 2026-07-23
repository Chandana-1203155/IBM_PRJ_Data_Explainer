// Application Initialization - AI Data Explainer+

const App = {
    state: {
        currentView: 'landing',
        theme: 'light',
        dataset: null,
        sessionId: null
    },

    init() {
        this.initializeTheme();
        this.initializeNavigation();
        this.initializeEventListeners();
    },

    initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.classList.remove(currentTheme + '-theme');
        body.classList.add(newTheme + '-theme');
        localStorage.setItem('theme', newTheme);
        
        this.state.theme = newTheme;
        
        // Update theme icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    },

    initializeNavigation() {
        // Navigation between landing and dashboard
        window.showDashboard = () => {
            document.getElementById('landing-page').classList.add('hidden');
            document.getElementById('dashboard-page').classList.remove('hidden');
            this.state.currentView = 'dashboard';
            window.scrollTo(0, 0);
        };

        window.showLanding = () => {
            document.getElementById('dashboard-page').classList.add('hidden');
            document.getElementById('landing-page').classList.remove('hidden');
            this.state.currentView = 'landing';
            window.scrollTo(0, 0);
        };

        window.scrollToSection = (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ block: 'start' });
            }
        };

        window.resetDashboard = () => {
            if (confirm('Are you sure you want to start a new analysis? This will clear the current dataset.')) {
                this.state.dataset = null;
                this.state.sessionId = null;
                this.resetDashboardUI();
                this.navigateToSection('upload');
            }
        };
    },

    initializeEventListeners() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
        }

        // Mobile sidebar toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }
    },

    navigateToSection(sectionId) {
        // Update sidebar navigation
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

    resetDashboardUI() {
        // Reset upload area
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Drag & Drop your file here</h3>
                    <p>or</p>
                    <button class="btn-primary" onclick="document.getElementById('file-input').click()">
                        <i class="fas fa-folder-open"></i>
                        Browse Files
                    </button>
                    <input type="file" id="file-input" accept=".csv,.xlsx" hidden>
                    <p class="upload-info">Supported formats: CSV, Excel (.xlsx) | Max size: 10MB</p>
                </div>
            `;
        }

        // Reset overview section
        const overviewCards = document.getElementById('overview-cards');
        if (overviewCards) {
            overviewCards.innerHTML = `
                <div class="card skeleton">
                    <div class="card-icon"><i class="fas fa-table"></i></div>
                    <div class="card-content">
                        <div class="card-value skeleton-text"></div>
                        <div class="card-label skeleton-text"></div>
                    </div>
                </div>
            `;
        }

        // Reset other sections to placeholders
        this.resetSectionToPlaceholder('charts-container', 'chart-placeholder', 'fa-chart-bar', 'Upload a dataset to generate charts');
        this.resetSectionToPlaceholder('insights-container', 'insight-placeholder', 'fa-brain', 'Upload a dataset to generate AI insights');
        this.resetSectionToPlaceholder('recommendations-container', 'recommendation-placeholder', 'fa-lightbulb', 'Upload a dataset to get recommendations');
        this.resetChatSection();
        this.resetReportSection();
    },

    resetSectionToPlaceholder(containerId, placeholderClass, iconClass, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="${placeholderClass}">
                    <i class="fas ${iconClass}"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    },

    resetChatSection() {
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Upload a dataset to start chatting</p>
                </div>
            `;
        }

        if (chatInput) chatInput.disabled = true;
        if (chatSend) chatSend.disabled = true;
    },

    resetReportSection() {
        const generateReport = document.getElementById('generate-report');
        if (generateReport) {
            generateReport.disabled = true;
        }
    }
};
