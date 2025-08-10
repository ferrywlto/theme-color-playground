// Color picker functionality
import themeManager from './theme-manager.js';
import { hexToRgb } from '../helper/color-exchange.js';

const colorPicker = {
  modal: null,
  title: null,
  input: null,
  hexDisplay: null,
  rgbDisplay: null,
  previewCurrent: null,
  previewNew: null,
  closeBtn: null,
  overlay: null,
  applyBtn: null,
  resetBtn: null,
  cancelBtn: null,
  copyHexBtn: null,
  copyRgbBtn: null,
  currentEditingColor: "",

  init() {
    this.modal = document.getElementById("color-picker-modal");
    this.title = document.getElementById("color-picker-title");
    this.input = document.getElementById("color-picker-input");
    this.hexDisplay = document.getElementById("color-hex-display");
    this.rgbDisplay = document.getElementById("color-rgb-display");
    this.previewCurrent = document.getElementById("color-preview-current");
    this.previewNew = document.getElementById("color-preview-new");
    this.closeBtn = document.getElementById("color-picker-close");
    this.overlay = document.querySelector(".color-picker-overlay");
    this.applyBtn = document.getElementById("color-picker-apply");
    this.resetBtn = document.getElementById("color-picker-reset");
    this.cancelBtn = document.getElementById("color-picker-cancel");
    this.copyHexBtn = document.getElementById("copy-hex-btn");
    this.copyRgbBtn = document.getElementById("copy-rgb-btn");

    this.bindEvents();
    this.addColorSwatchListeners();
  },

  bindEvents() {
    if (this.input) {
      this.input.addEventListener("input", () => this.updateColorPreview());
    }

    if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());
    if (this.overlay) this.overlay.addEventListener("click", () => this.close());
    if (this.applyBtn) this.applyBtn.addEventListener("click", () => this.applyColorChange());
    if (this.resetBtn) this.resetBtn.addEventListener("click", () => this.resetColorToOriginal());
    if (this.cancelBtn) this.cancelBtn.addEventListener("click", () => this.close());

    // Direct event listener binding for copy buttons to ensure they work
    const copyHexBtn = document.getElementById("copy-hex-btn");
    const copyRgbBtn = document.getElementById("copy-rgb-btn");

    if (copyHexBtn) {
      copyHexBtn.addEventListener("click", () => this.copyHexValue());
    }

    if (copyRgbBtn) {
      copyRgbBtn.addEventListener("click", () => this.copyRgbValue());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal && this.modal.classList.contains("active")) {
        this.close();
      }
    });
  },

  addColorSwatchListeners() {
    document.querySelectorAll(".color-swatch[data-color]").forEach((swatch) => {
      swatch.addEventListener("click", (e) => {
        e.preventDefault();
        const colorName = swatch.getAttribute("data-color");
        if (colorName) {
          console.log("Opening color picker for:", colorName);
          this.open(colorName);
        }
      });
    });
  },

  open(colorName) {
    if (!this.modal || !this.title || !this.input || !this.hexDisplay ||
      !this.rgbDisplay || !this.previewCurrent || !this.previewNew) {
      console.error("Color picker elements not found");
      return;
    }

    this.currentEditingColor = colorName;
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const currentColor = themeManager.colorValues[currentTheme][colorName];

    console.log("Opening color picker for:", colorName, "Current color:", currentColor);

    this.title.textContent = `Edit ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Color`;
    this.input.value = currentColor;

    this.hexDisplay.textContent = currentColor;
    const rgb = hexToRgb(currentColor);
    if (rgb) {
      this.rgbDisplay.textContent = `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    this.previewCurrent.style.backgroundColor = currentColor;
    this.previewNew.style.backgroundColor = currentColor;

    this.updateContrastRatios(currentColor, currentColor);

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
    this.currentEditingColor = "";
  },

  updateColorPreview() {
    if (!this.input || !this.hexDisplay || !this.rgbDisplay || !this.previewNew) return;
    const newColor = this.input.value;

    this.hexDisplay.textContent = newColor;

    const rgb = hexToRgb(newColor);
    if (rgb) {
      this.rgbDisplay.textContent = `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    this.previewNew.style.backgroundColor = newColor;

    if (this.currentEditingColor && this.previewCurrent) {
      const html = document.documentElement;
      const currentTheme = html.getAttribute("data-theme") || "light";
      const originalColor = themeManager.colorValues[currentTheme][this.currentEditingColor];
      this.updateContrastRatios(originalColor, newColor);
    }
  },

  updateContrastRatios(currentColor, newColor) {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const bgColor = themeManager.colorValues[currentTheme].background;
    const surfaceColor = themeManager.colorValues[currentTheme].surface;

    const currentBgRatio = themeManager.calculateContrastRatio(currentColor, bgColor);
    const currentSurfaceRatio = themeManager.calculateContrastRatio(currentColor, surfaceColor);
    const newBgRatio = themeManager.calculateContrastRatio(newColor, bgColor);
    const newSurfaceRatio = themeManager.calculateContrastRatio(newColor, surfaceColor);

    const currentBgRating = themeManager.getContrastRating(currentBgRatio);
    const currentSurfaceRating = themeManager.getContrastRating(currentSurfaceRatio);
    const newBgRating = themeManager.getContrastRating(newBgRatio);
    const newSurfaceRating = themeManager.getContrastRating(newSurfaceRatio);

    this.updateContrastDisplay("current-bg-contrast", currentBgRatio.toFixed(2));
    this.updateContrastDisplay("current-bg-rating", currentBgRating.rating, currentBgRating.className);
    this.updateContrastDisplay("current-surface-contrast", currentSurfaceRatio.toFixed(2));
    this.updateContrastDisplay("current-surface-rating", currentSurfaceRating.rating, currentSurfaceRating.className);

    this.updateContrastDisplay("new-bg-contrast", newBgRatio.toFixed(2));
    this.updateContrastDisplay("new-bg-rating", newBgRating.rating, newBgRating.className);
    this.updateContrastDisplay("new-surface-contrast", newSurfaceRatio.toFixed(2));
    this.updateContrastDisplay("new-surface-rating", newSurfaceRating.rating, newSurfaceRating.className);
  },

  updateContrastDisplay(elementId, text, className = null) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
      if (className && element.classList.contains('contrast-rating')) {
        element.className = `contrast-rating ${className}`;
      }
    }
  },

  applyColorChange() {
    if (!this.currentEditingColor || !this.input) return;

    const newColor = this.input.value;
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";

    console.log("Applying color change:", this.currentEditingColor, newColor);

    themeManager.colorValues[currentTheme][this.currentEditingColor] = newColor;
    themeManager.updateCSSVariables();
    themeManager.updateColorValues();

    this.close();
  },

  resetColorToOriginal() {
    if (!this.currentEditingColor) return;

    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const originalColor = themeManager.originalColorValues[currentTheme][this.currentEditingColor];

    // Reset color values back to original
    themeManager.colorValues[currentTheme][this.currentEditingColor] = originalColor;
    themeManager.updateCSSVariables();
    themeManager.updateColorValues();

    // Update the color picker UI to show the original color
    if (this.input) {
      this.input.value = originalColor;
    }

    if (this.hexDisplay) {
      this.hexDisplay.textContent = originalColor;
    }

    const rgb = hexToRgb(originalColor);
    if (rgb && this.rgbDisplay) {
      this.rgbDisplay.textContent = `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    if (this.previewNew) {
      this.previewNew.style.backgroundColor = originalColor;
    }

    // Update contrast ratios with the original color
    this.updateContrastRatios(originalColor, originalColor);

    // Don't close the modal - keep it open for further editing
  },

  async copyToClipboard(text, format) {
    try {
      await navigator.clipboard.writeText(text);
      this.showCopyNotification(`${format} copied!`);

    } catch (err) {
      console.error('Failed to copy to clipboard using navigator.clipboard:', err);
    }
  },

  showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = '1';
    });

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 200);
    }, 1500);
  },

  copyHexValue() {
    if (this.hexDisplay && this.hexDisplay.textContent) {
      this.copyToClipboard(this.hexDisplay.textContent, 'HEX');
    }
  },

  copyRgbValue() {
    if (this.rgbDisplay && this.rgbDisplay.textContent) {
      const rgbText = this.rgbDisplay.textContent.replace(/^\(([^)]+)\)$/, 'rgb($1)');
      this.copyToClipboard(rgbText, 'RGB');
    }
  }
};

export default colorPicker;
