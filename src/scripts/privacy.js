// Theme toggle functionality - ensure DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const html = document.documentElement;
  const analyticsBadge = document.getElementById("analytics-badge-img");

  function applyCustomColors() {
    const savedColors = localStorage.getItem('colorValues');
    if (savedColors) {
      const colorValues = JSON.parse(savedColors);
      const currentTheme = html.getAttribute("data-theme") || "light";
      const colors = colorValues[currentTheme];

      Object.keys(colors).forEach((colorName) => {
        const colorValue = colors[colorName];
        document.documentElement.style.setProperty(
          `--${colorName}`,
          colorValue,
        );
      });
    }
  }

  // Function to update analytics badge based on theme
  function updateAnalyticsBadge(theme) {
    if (analyticsBadge && analyticsBadge instanceof HTMLImageElement) {
      const mode = theme === "dark" ? "dark" : "light";
      analyticsBadge.src = `https://simpleanalyticsbadges.com/ferrywl.to?mode=${mode}`;
    }
  }

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light";

  // Set initial theme
  html.setAttribute("data-theme", currentTheme);
  html.classList.remove("theme-light", "theme-dark");
  html.classList.add(`theme-${currentTheme}`);

  // Apply custom colors
  applyCustomColors();

  // Update badge for initial theme
  updateAnalyticsBadge(currentTheme);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        const systemTheme = e.matches ? "dark" : "light";
        html.setAttribute("data-theme", systemTheme);
        html.classList.remove("theme-light", "theme-dark");
        html.classList.add(`theme-${systemTheme}`);
        updateAnalyticsBadge(systemTheme);
        applyCustomColors();
      }
    });

  // Listen for storage changes (when theme is changed from main page)
  window.addEventListener("storage", function(e) {
    if (e.key === "theme" || e.key === "colorValues") {
      const newTheme = localStorage.getItem("theme") || "light";
      html.setAttribute("data-theme", newTheme);
      html.classList.remove("theme-light", "theme-dark");
      html.classList.add(`theme-${newTheme}`);
      updateAnalyticsBadge(newTheme);
      applyCustomColors();
    }
  });
});