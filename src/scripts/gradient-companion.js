// Gradient companion functionality
import { hexToRgb, rgbToHex, companion } from '../helper/color-exchange.js';

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  gradientText: null,
  gradientButton: null,
  companionItems: null,

  init() {
    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.gradientText = document.getElementById('gradient-text');
    this.gradientButton = document.getElementById('gradient-button');
    this.companionItems = document.querySelectorAll('.companion-item');

    this.bindEvents();
    this.updateGradient();
    this.updateCompanionSuggestions();
  },

  bindEvents() {
    if (this.color1Input) {
      this.color1Input.addEventListener('input', () => {
        this.updateGradient();
        this.updateCompanionSuggestions();
      });
    }
    
    if (this.color2Input) {
      this.color2Input.addEventListener('input', () => {
        this.updateGradient();
        this.updateCompanionSuggestions();
      });
    }
  },

  updateGradient() {
    if (!this.color1Input || !this.color2Input) {
      return;
    }

    const color1 = this.color1Input.value;
    const color2 = this.color2Input.value;
    
    const gradientCSS = `linear-gradient(45deg, ${color1}, ${color2})`;
    
    // Update gradient text
    if (this.gradientText) {
      this.gradientText.style.background = gradientCSS;
      this.gradientText.style.backgroundClip = 'text';
      this.gradientText.style.webkitBackgroundClip = 'text';
      this.gradientText.style.webkitTextFillColor = 'transparent';
    }
    
    // Update gradient button
    if (this.gradientButton) {
      this.gradientButton.style.background = gradientCSS;
    }
  },

  updateCompanionSuggestions() {
    if (!this.color1Input || !this.companionItems.length) {
      return;
    }

    try {
      const color1Hex = this.color1Input.value;
      const { r, g, b } = hexToRgb(color1Hex);
      
      // Get companion colors using the companion function from color-exchange.js
      const companionColors = companion(r, g, b);
      
      // Update each companion item
      this.companionItems.forEach(item => {
        const style = item.dataset.style;
        const gradientText = item.querySelector('.companion-gradient-text');
        const gradientButton = item.querySelector('.companion-gradient-button');
        
        if (companionColors[style] && gradientText && gradientButton) {
          const companionColor = companionColors[style];
          let companionHex;
          
          if (style === 'lab-distance') {
            // lab-distance returns a hex color directly
            companionHex = companionColor;
          } else {
            // Other styles return RGB objects
            companionHex = rgbToHex(companionColor.r, companionColor.g, companionColor.b);
          }
          
          const gradientCSS = `linear-gradient(45deg, ${color1Hex}, ${companionHex})`;
          
          // Update companion gradient text
          gradientText.style.background = gradientCSS;
          gradientText.style.backgroundClip = 'text';
          gradientText.style.webkitBackgroundClip = 'text';
          gradientText.style.webkitTextFillColor = 'transparent';
          
          // Update companion gradient button
          gradientButton.style.background = gradientCSS;
        }
      });
    } catch (error) {
      console.error('Error updating companion suggestions:', error);
    }
  }
};

export default gradientCompanion;
