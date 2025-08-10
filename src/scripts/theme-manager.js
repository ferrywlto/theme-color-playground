// Main theme functionality
import { hexToRgb } from '../helper/color-exchange.js';

// Theme manager object
const themeManager = {
  colorValues: {
    light: {
      background: "#FAFAFA",
      surface: "#E4E4E4",
      body: "#4D4D4D",
      subtle: "#656565",
      primary: "#006564",
      secondary: "#D9A0B6",
      success: "#007047",
      danger: "#8A1C33",
      warning: "#7C6100",
      info: "#2F6DB8",
      light: "#EFEFEF",
      dark: "#262626",
    },
    dark: {
      background: "#242424",
      surface: "#4D4D4D",
      body: "#E4E4E4",
      subtle: "#6B7280",
      primary: "#00D9A8",
      secondary: "#FFC0CB",
      success: "#006564",
      danger: "#FFA0BC",
      warning: "#FFD700",
      info: "#4DA3FF",
      light: "#606060",
      dark: "#000000",
    },
  },

  originalColorValues: null,

  init() {
    this.originalColorValues = {
      light: { ...this.colorValues.light },
      dark: { ...this.colorValues.dark },
    };

    this.loadColorValuesFromLocalStorage();
    
    const savedTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(savedTheme);
    
    // Set up event listeners
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Theme toggle button
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
    
    // Keyboard shortcut for theme toggle (Ctrl+T)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  },

  applyTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.querySelector(".theme-icon");

    html.setAttribute("data-theme", theme);
    html.classList.remove("theme-light", "theme-dark");
    html.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);

    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    this.updateColorValues();
    this.updateCSSVariables();
    this.saveColorValuesToLocalStorage();

    // Update button text colors based on new theme
    if (window.buttonControls) {
      window.buttonControls.setTextColorBasedOnTheme();
    }
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  },

  // Helper function to calculate color brightness (luminance)
  getColorBrightness(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const toLinear = (value) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Helper function to check if a color is dark
  isColorDark(hex) {
    const luminance = this.getColorBrightness(hex);
    return luminance < 0.5;
  },

  // Calculate contrast ratio between two colors
  calculateContrastRatio(color1, color2) {
    const luminance1 = this.getColorBrightness(color1);
    const luminance2 = this.getColorBrightness(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Get contrast rating
  getContrastRating(ratio) {
    if (ratio >= 7) {
      return { rating: "AAA", className: "excellent" };
    } else if (ratio >= 4.5) {
      return { rating: "AA", className: "good" };
    } else if (ratio >= 3) {
      return { rating: "AA Large", className: "poor" };
    } else {
      return { rating: "Fail", className: "fail" };
    }
  },

  // Update color values in the palette
  updateColorValues() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const colors = this.colorValues[currentTheme];

    Object.keys(colors).forEach((colorName) => {
      const hex = colors[colorName];
      const rgb = hexToRgb(hex);

      const hexElements = document.querySelectorAll(
        `[data-color="${colorName}"].color-hex`,
      );
      const rgbElements = document.querySelectorAll(
        `[data-color="${colorName}"].color-rgb`,
      );
      
      const swatchElement = document.querySelector(
        `.color-swatch[data-color="${colorName}"]`
      );

      hexElements.forEach((el) => (el.textContent = hex));
      if (rgb) {
        rgbElements.forEach(
          (el) => (el.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`),
        );
      }

      if (swatchElement) {
        const textColor = this.isColorDark(hex) ? 'var(--light)' : 'var(--dark)';
        swatchElement.style.color = textColor;
      }
    });
  },

  updateCSSVariables() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const colors = this.colorValues[currentTheme];

    Object.keys(colors).forEach((colorName) => {
      const colorValue = colors[colorName];
      document.documentElement.style.setProperty(
        `--${colorName}`,
        colorValue,
      );
    });
  },

  saveColorValuesToLocalStorage() {
    localStorage.setItem('colorValues', JSON.stringify(this.colorValues));
  },

  loadColorValuesFromLocalStorage() {
    const savedColors = localStorage.getItem('colorValues');
    if (savedColors) {
      this.colorValues = JSON.parse(savedColors);
    }
  }
};

export default themeManager;