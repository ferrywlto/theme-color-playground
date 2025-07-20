// Button text color control functionality

const buttonControls = {
  textColorRadios: null,
  buttons: null,
  boldTextCheckbox: null,

  init() {
    this.textColorRadios = document.querySelectorAll('input[name="button-text-color"]');
    this.buttons = document.querySelectorAll('.button-group .btn');
    this.boldTextCheckbox = document.getElementById('bold-text-checkbox');

    this.setupEventListeners();
    this.setTextColorBasedOnTheme();
  },

  setupEventListeners() {
    // Add event listeners to radio buttons
    this.textColorRadios.forEach(radio => {
      radio.addEventListener('change', () => this.updateButtonTextColors());
    });

    // Bold text toggle functionality
    if (this.boldTextCheckbox) {
      this.boldTextCheckbox.addEventListener('change', () => this.updateButtonTextWeight());
    }
  },

  updateButtonTextColors() {
    const selectedRadio = document.querySelector('input[name="button-text-color"]:checked');
    const selectedTextColor = selectedRadio?.value || 'light';
    
    this.buttons.forEach(button => {
      // Remove existing text color classes
      button.classList.remove('text-light', 'text-dark', 'text-body');
      
      // Add the selected text color class
      button.classList.add(`text-${selectedTextColor}`);
    });
  },

  setTextColorBasedOnTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    // For dark theme, use light text; for light theme, use dark text for better contrast
    const recommendedTextColor = currentTheme === "dark" ? "light" : "dark";
    
    // Update radio button selection
    const radioToSelect = document.querySelector(`input[name="button-text-color"][value="${recommendedTextColor}"]`);
    if (radioToSelect) {
      radioToSelect.checked = true;
      this.updateButtonTextColors();
    }
  },

  updateButtonTextWeight() {
    const isBold = this.boldTextCheckbox?.checked || false;
    
    this.buttons.forEach(button => {
      if (isBold) {
        button.style.fontWeight = 'bold';
      } else {
        button.style.fontWeight = '';
      }
    });
  }
};

export default buttonControls;
