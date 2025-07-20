// Gradient companion functionality

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  preview: null,
  gradientCodeOutput: null,
  copyButton: null,

  init() {
    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.preview = document.getElementById('gradient-preview');
    this.gradientCodeOutput = document.getElementById('gradient-code');
    this.copyButton = document.getElementById('copy-gradient');

    this.bindEvents();
    this.updateGradient();
  },

  bindEvents() {
    if (this.color1Input) {
      this.color1Input.addEventListener('input', () => this.updateGradient());
    }
    
    if (this.color2Input) {
      this.color2Input.addEventListener('input', () => this.updateGradient());
    }
    
    if (this.copyButton) {
      this.copyButton.addEventListener('click', () => this.copyGradientCode());
    }
  },

  updateGradient() {
    if (!this.color1Input || !this.color2Input || !this.preview || !this.gradientCodeOutput) {
      return;
    }

    const color1 = this.color1Input.value;
    const color2 = this.color2Input.value;
    
    const gradientCSS = `linear-gradient(135deg, ${color1}, ${color2})`;
    
    this.preview.style.background = gradientCSS;
    this.gradientCodeOutput.textContent = `background: ${gradientCSS};`;
  },

  async copyGradientCode() {
    if (!this.gradientCodeOutput) return;

    const text = this.gradientCodeOutput.textContent;
    
    try {
      await navigator.clipboard.writeText(text);
      console.log('Gradient code copied to clipboard:', text);
      
      const notification = document.createElement('div');
      notification.textContent = 'Gradient code copied!';
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
          document.body.removeChild(notification);
        }, 200);
      }, 1500);
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
};

export default gradientCompanion;
