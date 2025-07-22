// Gradient companion functionality
import { hexToRgb, rgbToHex, companion } from '../helper/color-exchange.js';

console.log('Imported functions:', { hexToRgb, rgbToHex, companion });

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  gradientText: null,
  gradientCard: null,
  companionItems: null,
  copyButtons: null,

  init() {
    console.log('Initializing gradient companion...');

    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.gradientText = document.getElementById('gradient-text');
    this.gradientCard = document.getElementById('gradient-card');
    this.companionItems = document.querySelectorAll('.companion-item');
    this.copyButtons = document.querySelectorAll('.companion-copy-btn');

    console.log('Elements found:', {
      color1Input: !!this.color1Input,
      color2Input: !!this.color2Input,
      gradientText: !!this.gradientText,
      gradientCard: !!this.gradientCard,
      companionItemsCount: this.companionItems.length,
      copyButtonsCount: this.copyButtons.length
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
      });
    }

    if (this.copyButtons) {
      this.copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = e.currentTarget.dataset.type;
          const style = e.currentTarget.dataset.style;
          this.copyValue(type, style, e.currentTarget);
        });
      });
    }
  },

  updateGradient() {
    if (!this.color1Input || !this.color2Input) {
      return;
    }

    const color1 = this.color1Input.value;
    const color2 = this.color2Input.value;

    this.color1Input.parentElement.style.backgroundColor = color1;
    this.color2Input.parentElement.style.backgroundColor = color2;
    
    const gradientCSS = `linear-gradient(45deg, ${color1}, ${color2})`;
    
    // Update gradient text
    if (this.gradientText) {
      this.gradientText.style.background = gradientCSS;
      this.gradientText.style.backgroundClip = 'text';
      this.gradientText.style.webkitBackgroundClip = 'text';
      this.gradientText.style.webkitTextFillColor = 'transparent';
    }

    // Update gradient card background
    if (this.gradientCard) {
      this.gradientCard.style.background = gradientCSS;
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

      this.companionItems.forEach(item => {
        const style = item.dataset.style;
        const companionColor = companionColors[style];

        if (companionColor) {
          const companionHex = rgbToHex(companionColor.r, companionColor.g, companionColor.b);
          const gradientCSS = `linear-gradient(45deg, ${color1Hex}, ${companionHex})`;

          const textElement = item.querySelector('.companion-gradient-text');
          if (textElement) {
            textElement.style.background = gradientCSS;
            textElement.style.backgroundClip = 'text';
            textElement.style.webkitBackgroundClip = 'text';
            textElement.style.webkitTextFillColor = 'transparent';
          }

          const buttonElement = item.querySelector('.companion-gradient-button');
          if (buttonElement) {
            buttonElement.style.background = gradientCSS;
          }

          // Update HEX and RGB values
          const hexValueElement = item.querySelector(`.companion-hex-value[data-style="${style}"]`);
          const rgbValueElement = item.querySelector(`.companion-rgb-value[data-style="${style}"]`);

          if (hexValueElement) {
            hexValueElement.textContent = companionHex;
          }
          if (rgbValueElement) {
            rgbValueElement.textContent = `(${companionColor.r}, ${companionColor.g}, ${companionColor.b})`;
          }
        }
      });
    } catch (error) {
      console.error('Error in updateCompanionSuggestions:', error);
    }
  },

  copyValue(type, style, element) {
    const item = document.querySelector(`.companion-item[data-style="${style}"]`);
    if (!item) return;

    let valueToCopy = '';
    if (type === 'hex') {
      valueToCopy = item.querySelector('.companion-hex-value').textContent;
    } else if (type === 'rgb') {
      valueToCopy = item.querySelector('.companion-rgb-value').textContent;
    }

    if (valueToCopy) {
      navigator.clipboard.writeText(valueToCopy).then(() => {
        this.showCopyNotification(element);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        try {
          const textArea = document.createElement("textarea");
          textArea.value = valueToCopy;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          this.showCopyNotification(element);
        } catch (fallbackErr) {
          console.error('Fallback copy failed: ', fallbackErr);
          alert('Failed to copy value.');
        }
      });
    }
  },

  showCopyNotification(element) {
    const originalText = element.textContent;
    element.textContent = '✅';
    element.style.opacity = '1';
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.opacity = '0.7';
    }, 1500);
  }
};

export default gradientCompanion;
