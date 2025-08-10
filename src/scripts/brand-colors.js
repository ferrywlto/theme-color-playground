// Brand colors functionality
import { hexToRgb, rgbToHex } from '../helper/color-exchange.js';

const brandColors = {
  brandData: [],
  brandSelector: null,
  brandPalette: null,
  brandColorsContainer: null,
  moodCard: null,
  moodText: null,
  reasonCard: null,
  reasonText: null,

  async init() {
    console.log('Initializing brand colors...');

    this.brandSelector = document.getElementById('brand-selector');
    this.brandPalette = document.getElementById('brand-palette');
    this.brandColorsContainer = document.querySelector('.brand-colors');
    this.moodCard = document.getElementById('mood-card');
    this.moodText = document.getElementById('mood-text');
    this.reasonCard = document.getElementById('reason-card');
    this.reasonText = document.getElementById('reason-text');

    console.log('Brand selector found:', !!this.brandSelector);
    console.log('Brand palette found:', !!this.brandPalette);
    console.log('Brand colors container found:', !!this.brandColorsContainer);

    if (!this.brandSelector) {
      console.warn('Brand selector not found');
      return;
    }

    await this.loadBrandData();
    this.populateDropdown();
    this.bindEvents();

    console.log('Brand colors initialization complete');
  },

  async loadBrandData() {
    try {
      // Use the correct base path for the application
      const url = '/theme-color-playground/brand-colors.json';

      console.log('Attempting to fetch brand colors from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.brandData = await response.json();
      console.log('Brand data loaded:', this.brandData);
      this.populateDropdown();
    } catch (error) {
      console.error('Failed to load brand colors:', error);
      this.brandData = [];
    }
  },

  populateDropdown() {
    if (!this.brandData.length) {
      console.log('No brand data available for dropdown');
      return;
    }

    console.log('Populating dropdown with', this.brandData.length, 'brands');

    // Clear existing options except the first one
    while (this.brandSelector.children.length > 1) {
      this.brandSelector.removeChild(this.brandSelector.lastChild);
    }

    this.brandData.forEach((brand, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `[${brand.category}] ${brand.name} (${brand.theme})`;
      this.brandSelector.appendChild(option);
    });

    console.log('Dropdown populated with options:', this.brandSelector.children.length);
  },

  bindEvents() {
    if (this.brandSelector) {
      this.brandSelector.addEventListener('change', (e) => {
        const selectedIndex = e.target.value;
        if (selectedIndex === '') {
          this.hideBrandElements();
        } else {
          this.loadBrandConfig(parseInt(selectedIndex));
        }
      });
    }
  },

  loadBrandConfig(index) {
    const brand = this.brandData[index];
    if (!brand) return;

    console.log('Loading brand config:', brand);

    // Show brand elements
    this.showBrandElements();

    // Update brand color palette
    this.updateBrandPalette(brand.palette);

    // Switch theme based on brand.theme
    this.switchTheme(brand.theme);

    // Update color palette with brand colors
    this.updateColorPalette(brand.colors);

    // Update mood and reason
    this.updateMoodAndReason(brand.mood, brand.reason);
  },

  showBrandElements() {
    if (this.brandPalette) this.brandPalette.style.display = 'block';
    if (this.moodCard) this.moodCard.style.display = 'block';
    if (this.reasonCard) this.reasonCard.style.display = 'block';
  },

  hideBrandElements() {
    if (this.brandPalette) this.brandPalette.style.display = 'none';
    if (this.moodCard) this.moodCard.style.display = 'none';
    if (this.reasonCard) this.reasonCard.style.display = 'none';
  },

  updateBrandPalette(palette) {
    if (!this.brandColorsContainer || !palette) return;

    this.brandColorsContainer.innerHTML = '';

    palette.forEach((color, index) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'brand-color-item';
      colorDiv.style.backgroundColor = color;

      const colorLabel = document.createElement('span');
      colorLabel.className = 'brand-color-label';
      colorLabel.textContent = color.toUpperCase();

      colorDiv.appendChild(colorLabel);
      this.brandColorsContainer.appendChild(colorDiv);
    });
  },

  switchTheme(theme) {
    if (!window.themeManager) {
      console.warn('Theme manager not available');
      return;
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    if (theme !== currentTheme) {
      // Use the existing theme manager to switch themes
      window.themeManager.toggleTheme();
    }
  },

  updateColorPalette(colors) {
    if (!colors) return;

    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(colors).forEach(([colorName, colorValue]) => {
      root.style.setProperty(`--${colorName}`, colorValue);
    });

    // Update color swatch displays
    Object.entries(colors).forEach(([colorName, colorValue]) => {
      const hexDisplay = document.querySelector(`[data-color="${colorName}"] .color-hex`);
      const rgbDisplay = document.querySelector(`[data-color="${colorName}"] .color-rgb`);

      if (hexDisplay) {
        hexDisplay.textContent = colorValue;
      }

      if (rgbDisplay) {
        try {
          const rgb = hexToRgb(colorValue);
          rgbDisplay.textContent = `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        } catch (error) {
          console.warn(`Failed to convert ${colorValue} to RGB:`, error);
          rgbDisplay.textContent = 'Invalid';
        }
      }
    });

    // Trigger any necessary updates in other modules
    if (window.buttonControls && window.buttonControls.updateButtonColors) {
      window.buttonControls.updateButtonColors();
    }
  },

  updateMoodAndReason(mood, reason) {
    if (this.moodText && mood) {
      this.moodText.textContent = mood;
    }
    if (this.reasonText && reason) {
      this.reasonText.textContent = reason;
    }
  }
};

export default brandColors;
