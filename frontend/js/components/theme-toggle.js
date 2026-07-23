// Theme Toggle Component - AI Data Explainer+

const ThemeToggle = {
    init() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Set initial icon based on saved theme
        this.updateIcon();

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    },

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.classList.remove(currentTheme + '-theme');
        body.classList.add(newTheme + '-theme');
        localStorage.setItem('theme', newTheme);
        
        App.state.theme = newTheme;
        
        this.updateIcon();
    },

    updateIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        
        if (icon) {
            icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
};

// Initialize theme toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeToggle.init();
});
