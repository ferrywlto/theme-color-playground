// Theme management functionality
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
    this.bindEvents();
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme(theme) {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.setAttribute('title', 'Toggle between light and dark theme');
    toggle.innerHTML = this.getToggleIcon();
    
    document.body.appendChild(toggle);
    this.toggleButton = toggle;
  }

  getToggleIcon() {
    return this.currentTheme === 'light' ? '🌙' : '☀️';
  }

  updateToggleButton() {
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.getToggleIcon();
      this.toggleButton.setAttribute('title', 
        `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`
      );
    }
  }

  bindEvents() {
    // Listen for toggle button clicks
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
}

// Initialize theme manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}

// Export for use in other modules
window.ThemeManager = ThemeManager;
