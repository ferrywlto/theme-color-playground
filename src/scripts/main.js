// Main application initialization
import themeManager from './theme-manager.js';
import colorPicker from './color-picker.js';
import gradientCompanion from './gradient-companion.js';
import fileManager from './file-manager.js';
import buttonControls from './button-controls.js';
import brandColors from './brand-colors.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing theme color playground...');

  themeManager.init();
  colorPicker.init();
  gradientCompanion.init();
  fileManager.init();
  buttonControls.init();
  brandColors.init();

  // Make modules globally accessible for cross-module communication
  window.colorPicker = colorPicker;
  window.buttonControls = buttonControls;
  window.themeManager = themeManager;
  window.brandColors = brandColors;

  console.log('All modules initialized successfully');
});

// Export modules for potential external access
export {
  themeManager,
  colorPicker,
  gradientCompanion,
  fileManager,
  buttonControls,
  brandColors
};
