// Gradient companion functionality
import { hexToRgb, rgbToHex, companion } from '../helper/color-exchange.js';

console.log('Imported functions:', { hexToRgb, rgbToHex, companion });

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  gradientText: null,
  gradientButton: null,
  companionItems: null,

  init() {
    console.log('Initializing gradient companion...');
    
    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.gradientText = document.getElementById('gradient-text');
    this.gradientButton = document.getElementById('gradient-button');
    this.companionItems = document.querySelectorAll('.companion-item');

    console.log('Elements found:', {
      color1Input: !!this.color1Input,
      color2Input: !!this.color2Input,
      gradientText: !!this.gradientText,
      gradientButton: !!this.gradientButton,
      companionItemsCount: this.companionItems.length
    });

    this.bindEvents();
    this.updateGradient();
    this.updateCompanionSuggestions();
  },

  bindEvents() {
    console.log('Binding events...', { 
      color1Input: !!this.color1Input, 
      color2Input: !!this.color2Input 
    });
    
    if (this.color1Input) {
      this.color1Input.addEventListener('input', () => {
        console.log('Color1 input changed:', this.color1Input.value);
        this.updateGradient();
        this.updateCompanionSuggestions();
      });
    }
    
    if (this.color2Input) {
      this.color2Input.addEventListener('input', () => {
        console.log('Color2 input changed:', this.color2Input.value);
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
    console.log('updateCompanionSuggestions called');
    
    if (!this.color1Input || !this.companionItems.length) {
      console.log('Missing elements:', { 
        color1Input: !!this.color1Input, 
        companionItemsLength: this.companionItems ? this.companionItems.length : 0 
      });
      return;
    }

    try {
      const color1Hex = this.color1Input.value;
      console.log('Color1 hex:', color1Hex);
      
      const { r, g, b } = hexToRgb(color1Hex);
      console.log('RGB values:', { r, g, b });
      
      // Get companion colors using the companion function from color-exchange.js
      const companionColors = companion(r, g, b);
      console.log('Companion colors:', companionColors);
      
      // Update each companion item
      this.companionItems.forEach(item => {
        const style = item.dataset.style;
        const gradientText = item.querySelector('.companion-gradient-text');
        const gradientButton = item.querySelector('.companion-gradient-button');
        
        console.log('Processing style:', style, { gradientText: !!gradientText, gradientButton: !!gradientButton });
        
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
          
          console.log('Companion hex for', style, ':', companionHex);
          
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
