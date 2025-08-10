document.addEventListener('DOMContentLoaded', () => {
  const brandSelect = document.getElementById('brand-select');
  const brandColorsContainer = document.getElementById('brand-colors-container');

  if (brandSelect && brandColorsContainer) {
    const colorSwatches = brandColorsContainer.querySelectorAll('.brand-color-swatch');

    fetch('/theme-color-playground/brand-colors.json')
      .then(response => response.json())
      .then(data => {
        const brands = data.brands;
        brands.forEach(brand => {
          const option = document.createElement('option');
          option.value = brand.name;
          option.textContent = brand.name;
          brandSelect.appendChild(option);
        });

        brandSelect.addEventListener('change', () => {
          const selectedBrandName = brandSelect.value;
          const selectedBrand = brands.find(brand => brand.name === selectedBrandName);

          if (selectedBrand) {
            const colors = selectedBrand.colors;
            colorSwatches.forEach((swatch, index) => {
              if (colors[index]) {
                swatch.style.backgroundColor = colors[index];
              } else {
                swatch.style.backgroundColor = '';
              }
            });
          } else {
            colorSwatches.forEach(swatch => {
              swatch.style.backgroundColor = '';
            });
          }
        });
      })
      .catch(error => console.error('Error fetching brand colors:', error));
  }
});