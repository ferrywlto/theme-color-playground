# Theme Color Playground

> 🎨 **Interactive Color System Explorer** - A modern web application for designing, testing, and exporting light/dark theme color schemes with real-time preview and accessibility-first design. Originally a tool created for personal use. If you find it useful, you may consider [buy me a bubble-tea. 🧋](https://www.paypal.com/paypalme/ferrywlto) 

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-ferrywl.to-blue?style=for-the-badge)](https://ferrywl.to/theme-color-playground/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-orange?style=for-the-badge&logo=astro)](https://astro.build)

## 🎯 What is Theme Color Playground?

A powerful, **framework-free** web application that lets you:
- 🌗 **Design dual-theme color systems** (light & dark mode)
- 🎨 **Interactive color picking** with real-time preview
- 🎨 **Interactive gradient blending and suggestion** with real-time preview
- 📱 **Mobile-first responsive design** that works everywhere
- 💾 **Export/Import configurations** as JSON files
- ♿ **Accessibility-compliant** with WCAG guidelines
- 🔒 **Privacy-first** with minimal data collection

Perfect for designers, developers, and anyone building modern web applications with theme support.

## ✨ Key Features

### 🎨 **Interactive Design Tools**
- Real-time color picker with live preview
- Instant theme switching (light ↔ dark)
- CSS custom properties generation
- Visual feedback for all color changes
- Gradient blending playground to see real time gradient color
- Gradient color suggestion on first color choice

### 🎨 **Brand Color Sample**
- Explore a curated list of brand color palettes.
- See how different brand colors work in both light and dark themes.
- Get inspiration for your own color schemes.
- Understand the mood and reasoning behind the color choices.
- Total 379 brands for selection. (Some are duplicates, clean up from time to time. With more to add in future.)

### 📱 **Modern Web Standards**
- Fully responsive design (mobile-first)
- Semantic HTML5 structure
- CSS Grid & Flexbox layouts
- Progressive enhancement

### 🔧 **Developer-Friendly**
- Export theme configurations as JSON
- Import and share color schemes
- CSS custom properties ready-to-use
- Zero framework dependencies (except build tools)

### 🔒 **Privacy & Performance**
- No tracking or personal data collection
- Simple Analytics (GDPR compliant)
- Static site generation for fast loading
- Minimal JavaScript footprint

## 🛠️ Tech Stack

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **[Astro](https://astro.build)** | Static Site Generator | Zero JavaScript by default, excellent performance |
| **Vanilla JavaScript** | Interactivity | No framework overhead, better performance |
| **CSS Custom Properties** | Theme System | Native browser support, dynamic theming |
| **[Simple Analytics](https://simpleanalytics.com)** | Privacy-first Analytics | GDPR compliant, no cookies |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ferrywlto/theme-color-playground.git
cd theme-color-playground

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
## JSON Schema

### Brand Color Sample
The JSON schema used for storing brand sample colors was defined as below:
```json
[
  {
    "name" : "Brand Name",
    "theme": "light",
    "mood": "Brilliant and bold",
    "reason": "It works great",
    "palette": ["#28A745", "#E60000", "#FFC107", "#FFFFFF", "#000000"],
    "colors": {
      "background": "#FAFAFA",
      "surface": "#E4E4E4",
      "body": "#4D4D4D",
      "subtle": "#656565",
      "primary": "#E60000",
      "secondary": "#0000DD",
      "success": "#28A745",
      "warning": "#FFC107",
      "danger": "#E60000",
      "info": "#0000DD",
      "light": "#FFFFFF",
      "dark": "#343A40"
    },
  }
]
```
### Import/Export
The JSON schema used for import and export was defined as below:
```json
{
  "light": {
    "background": "#FAFAFA",
    "surface": "#E4E4E4",
    "body": "#4D4D4D",
    "subtle": "#656565",
    "primary": "#E60000",
    "secondary": "#0000DD",
    "success": "#28A745",
    "warning": "#FFC107",
    "danger": "#E60000",
    "info": "#0000DD",
    "light": "#FFFFFF",
    "dark": "#343A40"
  },
  "dark": {
    "background": "#242424",
    "surface": "#4D4D4D",
    "body": "#E4E4E4",
    "subtle": "#6B7280",
    "primary": "#00D9A8",
    "secondary": "#FFC0CB",
    "success": "#006564",
    "danger": "#FFA0BC",
    "warning": "#FFD700",
    "info": "#4DA3FF",
    "light": "#606060",
    "dark": "#000000"
  }
}
```


## 🌐 Live Demo

**Try it now:** [ferrywl.to/theme-color-playground](https://ferrywl.to/theme-color-playground/)

## 💼 Use Cases

- **Web Developers**: Design consistent color systems for applications
- **UI/UX Designers**: Prototype and test theme variations
- **Design Systems**: Create and document color palettes
- **Accessibility Testing**: Ensure proper contrast ratios
- **Brand Guidelines**: Develop cohesive color schemes

## 🔍 SEO & Discoverability

This project implements comprehensive SEO best practices:
- 📊 Structured data (JSON-LD) for search engines
- 🔗 Open Graph & Twitter Card meta tags
- 🗺️ Automatic sitemap generation
- 🤖 Proper robots.txt configuration
- 📱 Mobile-optimized meta tags

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### ✅ **Permitted Uses**
- Personal projects and learning
- Educational and research purposes
- Non-commercial open source projects
- Contributing improvements back to this project

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report Issues**: Found a bug? [Open an issue](https://github.com/ferrywlto/theme-color-playground/issues)
2. **💡 Suggest Features**: Have an idea? We'd love to hear it!
3. **🔧 Submit PRs**: Ready to code? Fork, develop, and submit a pull request
4. **📖 Improve Docs**: Help make our documentation better

### Development Guidelines
- Follow semantic commit conventions
- Ensure accessibility compliance
- Test on multiple devices/browsers
- Maintain performance benchmarks

## 🙏 Acknowledgments

- **[Astro Team](https://astro.build)** - For the amazing static site generator
- **[Simple Analytics](https://simpleanalytics.com)** - For privacy-first analytics
- **Open Source Community** - For inspiration and best practices

---

**Made with ❤️ by [Ferry To](https://github.com/ferrywlto) | [Live Demo](https://ferrywl.to/theme-color-playground/) | [Report Issues](https://github.com/ferrywlto/theme-color-playground/issues)**
