# Theme System Documentation

This Theme Color Playground includes a comprehensive theme system supporting both light and dark modes with beautiful color palettes.

## 🎨 Color Variables

### Light Theme
- **Background**: `#FAFAFA` - Clean white background
- **Surface**: `#E4E4E4` - Light gray for cards and surfaces
- **Text**: `#4D4D4D` - Dark gray for readable text
- **Primary**: `#006564` - Teal for primary actions
- **Secondary**: `#FFC0CB` - Pink for secondary elements
- **Success**: `#00D9A8` - Green for success states
- **Danger**: `#FF5C8A` - Pink-red for errors
- **Warning**: `#FFD700` - Gold for warnings
- **Info**: `#2F6DB8` - Blue for information
- **Light**: `#F7F7F7` - Very light gray
- **Dark**: `#242424` - Dark gray

### Dark Theme
- **Background**: `#242424` - Dark background
- **Surface**: `#4D4D4D` - Medium gray for surfaces
- **Text**: `#E4E4E4` - Light gray text
- **Primary**: `#00D9A8` - Bright teal (swapped with success)
- **Secondary**: `#FFC0CB` - Same pink (works well in both themes)
- **Success**: `#006564` - Darker teal (swapped with primary)
- **Danger**: `#FFA0BC` - Lighter pink for better contrast
- **Warning**: `#FFD700` - Same gold
- **Info**: `#4DA3FF` - Brighter blue
- **Light**: `#606060` - Medium gray
- **Dark**: `#000000` - Pure black

## 🔧 Usage

### CSS Variables
All colors are available as CSS custom properties:

```css
.my-element {
  background-color: var(--primary);
  color: var(--text);
  border: 1px solid var(--surface);
}
```

### Utility Classes

#### Text Colors
- `.text-primary`, `.text-secondary`, `.text-success`, etc.

#### Background Colors
- `.bg-primary`, `.bg-secondary`, `.bg-success`, etc.
- `.bg-surface` - For surface backgrounds

#### Component Classes
- `.btn` + `.btn-primary` - Styled buttons
- `.card` - Container with surface background
- `.alert` + `.alert-primary` - Alert messages
- `.surface` - Generic surface styling

### Theme Switching

#### Automatic Theme Detection
The system automatically detects the user's system preference and applies the appropriate theme.

#### Manual Theme Toggle
- Click the floating toggle button in the top-right corner
- Use keyboard shortcut: `Ctrl+T`
- Themes are saved in localStorage

#### Programmatic Control
```javascript
// Get the theme manager instance
const themeManager = new ThemeManager();

// Toggle theme
themeManager.toggleTheme();

// Set specific theme
themeManager.applyTheme('dark');
themeManager.applyTheme('light');

// Get current theme
console.log(themeManager.currentTheme);
```

## 🎯 Features

- **Smooth Transitions**: All theme changes are animated with CSS transitions
- **System Integration**: Respects user's system dark/light mode preference
- **Persistent Storage**: Theme choice is saved in localStorage
- **Keyboard Shortcuts**: Quick theme switching with Ctrl+T
- **Accessibility**: Proper ARIA labels and focus management
- **Responsive**: Works on all screen sizes

## 🔄 Customization

### Adding New Colors
1. Add the color variable to both `.theme-light` and `.theme-dark` classes
2. Create corresponding utility classes if needed
3. Update the theme toggle logic if automatic swapping is desired

### Creating Custom Components
Use the CSS variables to ensure your components work with both themes:

```css
.my-custom-component {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--primary);
  transition: var(--transition);
}

.my-custom-component:hover {
  background-color: var(--primary);
  color: white;
}
```

## 🚀 Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Test in both themes** to ensure proper contrast
3. **Use semantic color names** (primary, success, danger) rather than specific colors
4. **Include transitions** for smooth theme switching
5. **Consider accessibility** with proper contrast ratios
