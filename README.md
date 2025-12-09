# 🎨 Social Share Image Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://emredursun.nl/tools/)

**Create professional social media images with intelligent adaptive layouts for any dimension.**

A free, open-source tool that automatically adjusts layouts, text sizing, and element positioning to create perfect social share images for any platform.

## ✨ Features

### 🎯 Intelligent Adaptive Layout System

-   **Auto-adjusts to any dimension** - portrait, landscape, or square
-   **Smart text sizing** - automatically scales based on canvas size
-   **Responsive element positioning** - perfect placement regardless of dimensions
-   **6 professional layouts** - Auto, Centered, Split, Minimal, Bold, Elegant

### 🚀 Platform Presets

-   Facebook/LinkedIn (1200×630)
-   Twitter/X Cards (1200×675)
-   Instagram Square (1080×1080)
-   YouTube Thumbnail (1920×1080)
-   Story Format (800×1200)
-   Custom dimensions (100px - 5000px)

### 🎨 Customization Options

-   Upload custom profile images
-   Customizable text (name, title, subtitle, website)
-   Color pickers for backgrounds and accents
-   Text scale adjustment (50%-150%)
-   6 visual effects (Pattern, Circles, Grid, Waves, Dots, None)
-   Export quality options (High, Ultra, Medium)

### ✨ Premium Template Styles

Five stunning template designs to elevate your social images:

| Template             | Style                                   | Best For                             |
| -------------------- | --------------------------------------- | ------------------------------------ |
| **Classic**          | Clean gradient with accent bars         | Professional profiles, corporate use |
| **Glassmorphism**    | Frosted glass card with gradient orbs   | Modern, trendy designs               |
| **Neon Dark**        | Cyberpunk-inspired with hexagonal frame | Tech, gaming, creative fields        |
| **Minimal Luxury**   | Elegant cream with gold accents         | Premium brands, luxury aesthetic     |
| **Vibrant Gradient** | Bold multi-color with rounded photo     | Social media, personal branding      |

All templates are **fully responsive** and adapt beautifully to:

-   📐 Landscape formats (Facebook, LinkedIn, Twitter, YouTube)
-   ⬛ Square formats (Instagram, TikTok)
-   📱 Portrait/Story formats (Instagram Stories, TikTok)

### 💾 Export Features

-   Download as PNG
-   Copy to clipboard
-   High-quality output
-   Multiple quality levels

## 🖼️ Layout Templates

### Auto Layout

Intelligently selects the best layout based on aspect ratio:

-   **Square** → Centered layout
-   **Portrait** → Minimal layout
-   **Landscape** → Split layout

### Manual Layouts

-   **Centered**: Photo centered with text below (perfect for square images)
-   **Split**: Photo left, text right (ideal for landscape)
-   **Minimal**: Compact design with efficient space usage
-   **Bold**: Large photo with prominent text
-   **Elegant**: Sophisticated balanced composition

## 🎯 Use Cases

-   **Social Media Marketing** - Create eye-catching posts for all platforms
-   **Personal Branding** - Professional profile images
-   **Event Promotion** - Custom event graphics
-   **Blog Headers** - Featured images for articles
-   **YouTube Thumbnails** - High-quality video thumbnails
-   **Portfolio Showcases** - Project preview images

## 🚀 Quick Start

### Online (Recommended)

Visit the [live demo](https://emredursun.github.io/social-share-image-generator/) - no installation required!

### Local Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/emredursun/social-share-image-generator.git
    cd social-share-image-generator
    ```

2. Open `index.html` in your browser - that's it!

    ```bash
    # Windows
    start index.html

    # macOS
    open index.html

    # Linux
    xdg-open index.html
    ```

No build process, no dependencies - pure HTML5, CSS3, and JavaScript!

## 📖 How It Works

### Intelligent Layout Calculation

The core of the generator is the `LayoutCalculator` class that:

1. **Analyzes dimensions** - Determines if the canvas is portrait, landscape, or square
2. **Calculates scale factor** - Ensures consistent sizing across all dimensions
3. **Positions elements** - Smartly places photo, text, and accents
4. **Sizes fonts** - Automatically scales text for readability
5. **Wraps text** - Handles long text with intelligent line breaking

```javascript
// Example: Auto-scaling based on canvas area
getScaleFactor() {
    const baseArea = 1200 * 630;
    const currentArea = this.width * this.height;
    return Math.sqrt(currentArea / baseArea) * textScaleMultiplier;
}
```

### Adaptive Text Positioning

Text automatically adjusts based on:

-   Canvas dimensions
-   Selected layout
-   Photo size and position
-   Available space
-   Text length (with word wrapping)

## 🛠️ Technical Stack

-   **HTML5 Canvas API** - For image rendering
-   **Vanilla JavaScript** - No frameworks or dependencies
-   **CSS3** - Modern responsive design
-   **Plus Jakarta Sans** - Professional typography

## 📱 Browser Support

-   ✅ Chrome/Edge (recommended)
-   ✅ Firefox
-   ✅ Safari
-   ✅ Opera

Requires modern browser with Canvas API support.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

-   Additional layout templates
-   More visual effects
-   Font selection options
-   Gradient presets
-   Image filters
-   Batch processing
-   Template saving/loading

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Emre Dursun**

-   Portfolio: [emredursun.nl](https://emredursun.nl)
-   GitHub: [@emredursun](https://github.com/emredursun)
-   LinkedIn: [emre-dursun-nl](https://linkedin.com/in/emre-dursun-nl/)

## 🌟 Show Your Support

If you find this tool useful, please:

-   ⭐ Star the repository
-   🐛 Report bugs
-   💡 Suggest new features
-   🔀 Share with others

## 📊 Examples

### Different Dimensions, Perfect Results

| Dimension | Layout   | Best For           |
| --------- | -------- | ------------------ |
| 1200×630  | Split    | Facebook, LinkedIn |
| 1200×675  | Split    | Twitter/X          |
| 1080×1080 | Centered | Instagram, TikTok  |
| 1920×1080 | Split    | YouTube            |
| 800×1200  | Minimal  | Stories            |

## 🔮 Roadmap

-   [ ] Template saving system
-   [ ] Custom font upload
-   [ ] Advanced gradient editor
-   [ ] Image filters and effects
-   [ ] Batch generation
-   [ ] SVG export option
-   [ ] Animation support
-   [ ] API for programmatic access

## ❓ FAQ

**Q: Can I use the generated images commercially?**  
A: Yes! All images you create are yours to use freely.

**Q: Do you store my uploaded images?**  
A: No. Everything runs in your browser. No data is sent to any server.

**Q: Can I add custom fonts?**  
A: Currently uses Plus Jakarta Sans. Custom fonts support is planned.

**Q: What's the maximum image size?**  
A: Up to 5000×5000 pixels. Higher dimensions may impact performance.

## 🙏 Acknowledgments

-   Font: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) by Tokotype
-   Icons: [Font Awesome](https://fontawesome.com/)
-   Inspired by the need for adaptive social media graphics

---

**Made with ❤️ by [Emre Dursun](https://emredursun.nl)**

[Report Bug](https://github.com/emredursun/social-share-image-generator/issues) · [Request Feature](https://github.com/emredursun/social-share-image-generator/issues) · [Documentation](https://github.com/emredursun/social-share-image-generator/wiki)
