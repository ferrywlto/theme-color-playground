// Theme management functionality
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    console.log('ThemeManager initializing with theme:', this.currentTheme);
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
    this.bindEvents();
    console.log('ThemeManager initialization complete');
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
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    // Add the new theme class
    document.documentElement.classList.add(`theme-${theme}`);
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateToggleButton();
    
    // Debug logging
    console.log(`Applied theme: ${theme}`, document.documentElement.className);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    console.log(`Toggling from ${this.currentTheme} to ${newTheme}`);
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
    console.log('Theme toggle button created and added to DOM');
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
      this.toggleButton.addEventListener('click', (e) => {
        console.log('Theme toggle clicked');
        e.preventDefault();
        this.toggleTheme();
      });
    } else {
      console.error('Theme toggle button not found');
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
        console.log('Keyboard shortcut triggered');
        this.toggleTheme();
      }
    });
  }
}

// Initialize theme manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing theme manager');
    window.themeManager = new ThemeManager();
  });
} else {
  console.log('DOM already loaded, initializing theme manager');
  window.themeManager = new ThemeManager();
}

// Export for use in other modules
window.ThemeManager = ThemeManager;
