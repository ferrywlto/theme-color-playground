// Gradient companion functionality

const gradientCompanion = {
  color1Input: null,
  color2Input: null,
  gradientText: null,
  gradientButton: null,

  init() {
    this.color1Input = document.getElementById('gradient-color1');
    this.color2Input = document.getElementById('gradient-color2');
    this.gradientText = document.getElementById('gradient-text');
    this.gradientButton = document.getElementById('gradient-button');

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
  }
};

export default gradientCompanion;
