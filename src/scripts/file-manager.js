// File management functionality for theme configurations
import themeManager from './theme-manager.js';

const fileManager = {
  uploadInput: null,
  uploadButton: null,
  downloadButton: null,

  init() {
    this.uploadInput = document.getElementById('config-upload');
    this.uploadButton = document.getElementById('upload-config');
    this.downloadButton = document.getElementById('download-config');

    this.bindEvents();
  },

  bindEvents() {
    if (this.uploadInput) {
      this.uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }
    
    if (this.uploadButton) {
      this.uploadButton.addEventListener('click', () => {
        this.uploadInput.click();
      });
    }
    
    if (this.downloadButton) {
      this.downloadButton.addEventListener('click', () => this.downloadConfig());
    }
  },

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        if (import.meta.env.DEV) {
          console.log('Uploaded config:', config);
        }
        
        if (this.isValidConfig(config)) {
          themeManager.colorValues = config;
          themeManager.updateCSSVariables();
          themeManager.updateColorValues();
          
          this.showNotification('Configuration loaded successfully!', 'success');
        } else {
          this.showNotification('Invalid configuration file format', 'error');
        }
      } catch (error) {
        console.error('Error parsing config file:', error);
        this.showNotification('Error parsing configuration file', 'error');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  },

  isValidConfig(config) {
    // Basic validation to ensure the config has the expected structure
    if (!config || typeof config !== 'object') return false;
    
    const themes = ['light', 'dark'];
    const requiredColors = [
      'bg', 'surface', 'body', 'subtle', 'primary', 'secondary', 
      'success', 'danger', 'warning', 'info', 'light', 'dark'
    ];
    
    for (const theme of themes) {
      if (!config[theme] || typeof config[theme] !== 'object') return false;
      
      for (const color of requiredColors) {
        if (!config[theme][color] || typeof config[theme][color] !== 'string') return false;
        // Basic hex color validation
        if (!/^#[0-9A-F]{6}$/i.test(config[theme][color])) return false;
      }
    }
    
    return true;
  },

  downloadConfig() {
    try {
      const config = JSON.stringify(themeManager.colorValues, null, 2);
      const blob = new Blob([config], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'theme-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showNotification('Configuration downloaded!', 'success');
      if (import.meta.env.DEV) {
        console.log('Downloaded config:', themeManager.colorValues);
      }
    } catch (error) {
      console.error('Error downloading config:', error);
      this.showNotification('Error downloading configuration', 'error');
    }
  },

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const backgroundColor = type === 'success' ? '#10b981' : 
                          type === 'error' ? '#ef4444' : 
                          '#3b82f6';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
};

export default fileManager;