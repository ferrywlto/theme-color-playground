// Gradient companion functionality
import { hexToRgb, rgbToHex, companion } from '../helper/color-exchange.js';

if (import.meta.env.DEV) {
  console.log('Imported functions:', { hexToRgb, rgbToHex, companion });
}

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  gradientText: null,
  gradientCard: null,
  companionItems: null,
  copyButtons: null,

  init() {
    if (import.meta.env.DEV) {
      console.log('Initializing gradient companion...');
    }

    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.gradientText = document.getElementById('gradient-text');
    this.gradientCard = document.getElementById('gradient-card');
    this.companionItems = document.querySelectorAll('.companion-item');
    this.copyButtons = document.querySelectorAll('.companion-copy-btn');

    if (import.meta.env.DEV) {
      console.log('Elements found:', {
        color1Input: !!this.color1Input,
        color2Input: !!this.color2Input,
        gradientText: !!this.gradientText,
        gradientCard: !!this.gradientCard,
        companionItemsCount: this.companionItems.length,
        copyButtonsCount: this.copyButtons.length
      });
    }

    this.bindEvents();
    this.updateGradient();
    this.updateCompanionSuggestions();
  },

  bindEvents() {
    if (import.meta.env.DEV) {
      console.log('Binding events...', {
        color1Input: !!this.color1Input,
        color2Input: !!this.color2Input
      });
    }

    if (this.color1Input) {
      this.color1Input.addEventListener('input', () => {
        if (import.meta.env.DEV) {
          console.log('Color1 input changed:', this.color1Input.value);
        }
        this.updateGradient();
        this.updateCompanionSuggestions();
      });
    }

    if (this.color2Input) {
      this.color2Input.addEventListener('input', () => {
        if (import.meta.env.DEV) {
          console.log('Color2 input changed:', this.color2Input.value);
        }
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
    if (import.meta.env.DEV) {
      console.log('updateCompanionSuggestions called');
    }

    if (!this.color1Input || !this.companionItems.length) {
      if (import.meta.env.DEV) {
        console.log('Missing elements:', {
          color1Input: !!this.color1Input,
          companionItemsLength: this.companionItems ? this.companionItems.length : 0
        });
      }
      return;
    }

    try {
      const color1Hex = this.color1Input.value;
      const { r, g, b } = hexToRgb(color1Hex);
      // Get companion colors using the companion function from color-exchange.js
      const companionColors = companion(r, g, b);

      if (import.meta.env.DEV) {
        console.log('Color1 hex:', color1Hex);
        console.log('RGB values:', { r, g, b });
        console.log('Companion colors:', companionColors);
      }

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

  async copyValue(type, style) {
    const item = document.querySelector(`.companion-item[data-style="${style}"]`);
    if (!item) return;

    let valueToCopy = '';
    if (type === 'HEX') {
      valueToCopy = item.querySelector('.companion-hex-value').textContent;
    } else if (type === 'RGB') {
      valueToCopy = item.querySelector('.companion-rgb-value').textContent;
    }

    if (valueToCopy) {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        this.showCopyNotification(`${type} copied!`);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
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
};

export default gradientCompanion;
