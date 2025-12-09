// Social Share Image Generator - Intelligent Adaptive Layout Engine
// © 2025 Emre Dursun

let canvas = document.getElementById('socialCanvas');
let ctx = canvas.getContext('2d');
let floatingCanvas = document.getElementById('floatingCanvas');
let floatingCtx = floatingCanvas ? floatingCanvas.getContext('2d') : null;
let profileImage = null;
let currentEffect = 'pattern';
let currentLayout = 'auto';
let currentTemplateStyle = 'classic'; // classic, glassmorphism, neon, minimal, gradient
let textScaleMultiplier = 1.0;

// Intelligent layout calculator
class LayoutCalculator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;
        this.isLandscape = this.aspectRatio > 1;
        this.isPortrait = this.aspectRatio < 1;
        this.isSquare = Math.abs(this.aspectRatio - 1) < 0.1;
    }

    // Calculate optimal layout based on dimensions
    getOptimalLayout() {
        if (this.isSquare) return 'centered';
        if (this.isPortrait) return 'minimal';
        return 'split';
    }

    // Smart scaling factor based on canvas size
    getScaleFactor() {
        const baseArea = 1200 * 630;
        const currentArea = this.width * this.height;
        return Math.sqrt(currentArea / baseArea) * textScaleMultiplier;
    }

    // Calculate photo size based on layout and dimensions
    getPhotoSize(layout) {
        const scale = this.getScaleFactor();
        const basePhotoSize = 350;

        switch (layout) {
            case 'centered':
                return Math.min(this.width, this.height) * 0.4 * scale;
            case 'minimal':
                return Math.min(this.width, this.height) * 0.25 * scale;
            case 'bold':
                return Math.min(this.width, this.height) * 0.5 * scale;
            case 'split':
            case 'auto':
            default:
                return basePhotoSize * scale;
        }
    }

    // Calculate photo position based on layout
    getPhotoPosition(layout, photoSize) {
        switch (layout) {
            case 'centered':
                return {
                    x: this.width / 2,
                    y: this.height * 0.35
                };
            case 'minimal':
                return {
                    x: this.width * (this.isPortrait ? 0.5 : 0.15),
                    y: this.height * 0.25
                };
            case 'bold':
                return {
                    x: photoSize / 2 + 50,
                    y: this.height / 2
                };
            case 'split':
                return {
                    x: this.width * 0.25,
                    y: this.height / 2
                };
            case 'elegant':
                return {
                    x: this.width * 0.2,
                    y: this.height * 0.4
                };
            case 'auto':
            default:
                if (this.isPortrait) {
                    return { x: this.width / 2, y: this.height * 0.3 };
                }
                return {
                    x: this.width * 0.2,
                    y: this.height / 2
                };
        }
    }

    // Calculate text positioning
    getTextLayout(layout, photoSize, photoPos) {
        const scale = this.getScaleFactor();

        switch (layout) {
            case 'centered':
                return {
                    startX: this.width / 2,
                    nameY: photoPos.y + photoSize / 2 + 80 * scale,
                    titleY: photoPos.y + photoSize / 2 + 130 * scale,
                    subtitleY: photoPos.y + photoSize / 2 + 165 * scale,
                    websiteX: this.width / 2,
                    websiteY: this.height - 50 * scale,
                    align: 'center',
                    maxWidth: this.width * 0.8
                };
            case 'minimal':
                if (this.isPortrait) {
                    return {
                        startX: this.width / 2,
                        nameY: photoPos.y + photoSize / 2 + 60 * scale,
                        titleY: photoPos.y + photoSize / 2 + 100 * scale,
                        subtitleY: photoPos.y + photoSize / 2 + 130 * scale,
                        websiteX: this.width * 0.5,
                        websiteY: this.height - 30 * scale,
                        align: 'center',
                        maxWidth: this.width * 0.8
                    };
                }
                return {
                    startX: photoPos.x + photoSize / 2 + 40 * scale,
                    nameY: this.height * 0.3,
                    titleY: this.height * 0.4,
                    subtitleY: this.height * 0.5,
                    websiteX: this.width - 50 * scale,
                    websiteY: this.height - 40 * scale,
                    align: 'left',
                    maxWidth: this.width - (photoPos.x + photoSize / 2 + 60 * scale)
                };
            case 'bold':
                return {
                    startX: photoSize + 100 * scale,
                    nameY: this.height * 0.35,
                    titleY: this.height * 0.5,
                    subtitleY: this.height * 0.6,
                    websiteX: this.width - 100 * scale,
                    websiteY: this.height - 60 * scale,
                    align: 'left',
                    maxWidth: this.width - photoSize - 120 * scale
                };
            case 'split':
                return {
                    startX: this.width * 0.52,
                    nameY: this.height * 0.35,
                    titleY: this.height * 0.48,
                    subtitleY: this.height * 0.58,
                    websiteX: this.width * 0.9,
                    websiteY: this.height * 0.9,
                    align: 'left',
                    maxWidth: this.width * 0.4
                };
            case 'elegant':
                return {
                    startX: this.width * 0.5,
                    nameY: this.height * 0.25,
                    titleY: this.height * 0.35,
                    subtitleY: this.height * 0.43,
                    websiteX: this.width * 0.5,
                    websiteY: this.height * 0.85,
                    align: 'left',
                    maxWidth: this.width * 0.45
                };
            case 'auto':
            default:
                if (this.isPortrait) {
                    return {
                        startX: this.width / 2,
                        nameY: photoPos.y + photoSize / 2 + 70 * scale,
                        titleY: photoPos.y + photoSize / 2 + 115 * scale,
                        subtitleY: photoPos.y + photoSize / 2 + 145 * scale,
                        websiteX: this.width / 2,
                        websiteY: this.height - 40 * scale,
                        align: 'center',
                        maxWidth: this.width * 0.8
                    };
                }
                return {
                    startX: this.width * 0.45,
                    nameY: this.height * 0.4,
                    titleY: this.height * 0.52,
                    subtitleY: this.height * 0.62,
                    websiteX: this.width * 0.85,
                    websiteY: this.height * 0.92,
                    align: 'left',
                    maxWidth: this.width * 0.5
                };
        }
    }

    // Calculate font sizes intelligently
    getFontSizes() {
        const scale = this.getScaleFactor();

        return {
            name: Math.max(24, Math.min(120, 70 * scale)),
            title: Math.max(16, Math.min(60, 32 * scale)),
            subtitle: Math.max(14, Math.min(48, 28 * scale)),
            website: Math.max(12, Math.min(36, 24 * scale))
        };
    }

    // Calculate accent bar dimensions
    getAccentBar(layout, photoPos, photoSize) {
        const scale = this.getScaleFactor();

        if (layout === 'centered' || layout === 'minimal' || this.isPortrait) {
            return null; // No bar for these layouts
        }

        return {
            x: photoPos.x + photoSize / 2 + 30 * scale,
            y: this.height * 0.25,
            width: 6 * scale,
            height: this.height * 0.5
        };
    }
}

// Initialize
window.onload = function () {
    document.getElementById('effect-pattern').classList.add('active');
    document.getElementById('layout-auto').classList.add('active');

    // Initialize floating canvas reference
    floatingCanvas = document.getElementById('floatingCanvas');
    if (floatingCanvas) {
        floatingCtx = floatingCanvas.getContext('2d');
    }

    // Load default profile image
    const img = new Image();
    img.onload = function () {
        profileImage = img;
        regenerateImage();
    };
    img.src = 'assets/default-profile.svg';

    regenerateImage();
};

// Toggle floating preview visibility
function toggleFloatingPreview() {
    const floatingPreview = document.getElementById('floatingPreview');
    if (floatingPreview) {
        floatingPreview.classList.toggle('minimized');
    }
}

// Sync floating preview with main canvas
function syncFloatingPreview() {
    if (!floatingCanvas || !floatingCtx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Set floating canvas size maintaining aspect ratio
    const maxWidth = 400;
    const maxHeight = 280;
    const scale = Math.min(maxWidth / width, maxHeight / height);
    
    floatingCanvas.width = width * scale;
    floatingCanvas.height = height * scale;
    
    // Draw scaled version of main canvas
    floatingCtx.drawImage(canvas, 0, 0, floatingCanvas.width, floatingCanvas.height);
    
    // Update dimensions display
    const floatingDimensions = document.getElementById('floatingDimensions');
    if (floatingDimensions) {
        floatingDimensions.textContent = `${width} × ${height}`;
    }
}

function setDimensions(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    regenerateImage();
}

function loadProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                profileImage = img;
                regenerateImage();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function setEffect(effect) {
    currentEffect = effect;
    document.querySelectorAll('.effect-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`effect-${effect}`).classList.add('active');
    regenerateImage();
}

function setLayout(layout) {
    currentLayout = layout;
    document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`layout-${layout}`).classList.add('active');
    regenerateImage();
}

function setTemplateStyle(style) {
    currentTemplateStyle = style;
    document.querySelectorAll('.template-style-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`template-${style}`).classList.add('active');
    regenerateImage();
}

function updateTextScale(value) {
    textScaleMultiplier = value / 100;
    document.getElementById('textScaleValue').textContent = value + '%';
    regenerateImage();
}

function regenerateImage() {
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    canvas.width = width;
    canvas.height = height;

    document.getElementById('dimensionsDisplay').textContent = `${width} × ${height} pixels`;

    const colorStart = document.getElementById('colorStart').value;
    const colorEnd = document.getElementById('colorEnd').value;
    const accentColor = document.getElementById('accentColor').value;

    // Create intelligent layout calculator
    const layoutCalc = new LayoutCalculator(width, height);
    const layout = currentLayout === 'auto' ? layoutCalc.getOptimalLayout() : currentLayout;

    // Render based on template style
    switch (currentTemplateStyle) {
        case 'glassmorphism':
            renderGlassmorphism(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout);
            break;
        case 'neon':
            renderNeonDark(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout);
            break;
        case 'minimal':
            renderMinimalLuxury(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout);
            break;
        case 'gradient':
            renderVibrantGradient(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout);
            break;
        case 'classic':
        default:
            renderClassic(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout);
            break;
    }
    
    // Sync floating preview for mobile
    syncFloatingPreview();
}

// Classic template (original style)
function renderClassic(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout) {
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Apply visual effects
    applyEffect(width, height, accentColor, layoutCalc);

    // Calculate layout elements
    const photoSize = layoutCalc.getPhotoSize(layout);
    const photoPos = layoutCalc.getPhotoPosition(layout, photoSize);
    const textLayout = layoutCalc.getTextLayout(layout, photoSize, photoPos);
    const fontSizes = layoutCalc.getFontSizes();
    const accentBar = layoutCalc.getAccentBar(layout, photoPos, photoSize);

    // Draw profile image if available
    if (profileImage) {
        drawProfileImage(photoPos.x, photoPos.y, photoSize);
    }

    // Draw accent bar if applicable
    if (accentBar) {
        ctx.fillStyle = accentColor;
        ctx.fillRect(accentBar.x, accentBar.y, accentBar.width, accentBar.height);
    }

    // Draw text with intelligent positioning
    drawText(textLayout, fontSizes);
}

// Glassmorphism template - premium frosted glass card effect
function renderGlassmorphism(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout) {
    const scale = layoutCalc.getScaleFactor();
    
    // Rich layered gradient background
    const gradient = ctx.createLinearGradient(0, 0, width * 0.7, height);
    gradient.addColorStop(0, '#4158D0');
    gradient.addColorStop(0.3, '#C850C0');
    gradient.addColorStop(0.7, '#aa42cc');
    gradient.addColorStop(1, '#FFCC70');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Elegant gradient orbs (larger, softer)
    const orbs = [
        { x: width * 0.05, y: height * 0.15, size: 200 * scale, color: 'rgba(255, 255, 255, 0.3)' },
        { x: width * 0.9, y: height * 0.1, size: 180 * scale, color: 'rgba(255, 204, 112, 0.25)' },
        { x: width * 0.85, y: height * 0.85, size: 250 * scale, color: 'rgba(255, 255, 255, 0.2)' },
        { x: width * 0.1, y: height * 0.9, size: 160 * scale, color: 'rgba(200, 80, 192, 0.2)' },
    ];
    
    orbs.forEach(orb => {
        const orbGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        orbGradient.addColorStop(0, orb.color);
        orbGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Calculate card dimensions - responsive based on orientation
    const isVertical = layoutCalc.isPortrait || layoutCalc.isSquare;
    const cardWidth = isVertical ? width * 0.88 : width * 0.80;
    const cardHeight = isVertical ? height * 0.75 : height * 0.65;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const cardRadius = 32 * scale;
    
    // Drop shadow for card
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 40 * scale;
    ctx.shadowOffsetY = 15 * scale;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.fill();
    ctx.restore();
    
    // Main glass card with gradient overlay
    const glassGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.18)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.fillStyle = glassGradient;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.fill();
    
    // Top highlight border (light from top)
    const highlightGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    highlightGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.strokeStyle = highlightGradient;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.stroke();
    
    // Photo inside card - responsive sizing
    const photoSize = isVertical ? Math.min(cardWidth, cardHeight) * 0.38 : Math.min(cardWidth, cardHeight) * 0.48;
    const photoX = isVertical ? width / 2 : cardX + cardWidth * 0.26;
    const photoY = isVertical ? cardY + photoSize / 2 + 40 * scale : height / 2;
    
    if (profileImage) {
        // Golden glow ring behind photo
        ctx.save();
        const glowGradient = ctx.createRadialGradient(photoX, photoY, photoSize / 2 - 5 * scale, photoX, photoY, photoSize / 2 + 20 * scale);
        glowGradient.addColorStop(0, 'rgba(255, 204, 112, 0.5)');
        glowGradient.addColorStop(0.5, 'rgba(200, 80, 192, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 204, 112, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(photoX, photoY, photoSize / 2 + 20 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // White border ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.arc(photoX, photoY, photoSize / 2 + 4 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        drawProfileImageWithGlow(photoX, photoY, photoSize, accentColor, scale);
    }
    
    // Text positioning - responsive
    const fontSizes = layoutCalc.getFontSizes();
    ctx.fillStyle = '#ffffff';
    
    const textX = isVertical ? width / 2 : photoX + photoSize / 2 + 55 * scale;
    const textAlign = isVertical ? 'center' : 'left';
    ctx.textAlign = textAlign;
    
    const nameY = isVertical ? photoY + photoSize / 2 + 50 * scale : height * 0.40;
    const titleY = nameY + fontSizes.name * 1.4;
    const subtitleY = titleY + fontSizes.title * 1.3;
    
    // Name with glow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8 * scale;
    ctx.font = `700 ${fontSizes.name * 1.05}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('nameText').value, textX, nameY);
    ctx.shadowBlur = 0;
    
    // Title with slight accent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = `500 ${fontSizes.title}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('titleText').value, textX, titleY);
    
    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = `400 ${fontSizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('subtitleText').value, textX, subtitleY);
    
    // Website at bottom of card
    const websiteText = document.getElementById('websiteText').value;
    if (websiteText) {
        ctx.font = `500 ${fontSizes.website}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(websiteText, width / 2, cardY + cardHeight - 30 * scale);
    }
}

// Neon Dark template - cyberpunk inspired with hexagonal frame
function renderNeonDark(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout) {
    const scale = layoutCalc.getScaleFactor();
    
    // Dark gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0d0d12');
    bgGradient.addColorStop(0.5, '#0a0a0f');
    bgGradient.addColorStop(1, '#0d0d12');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Subtle grid pattern
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    const gridSize = 30 * scale;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Diagonal neon accent lines - TOP LEFT (cyan)
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3 * scale;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15 * scale;
    
    // Top-left diagonal accents
    ctx.beginPath();
    ctx.moveTo(20 * scale, 80 * scale);
    ctx.lineTo(120 * scale, 20 * scale);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20 * scale, 120 * scale);
    ctx.lineTo(180 * scale, 20 * scale);
    ctx.stroke();
    
    // Diagonal neon accent lines - BOTTOM RIGHT (magenta)
    ctx.strokeStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    
    ctx.beginPath();
    ctx.moveTo(width - 20 * scale, height - 80 * scale);
    ctx.lineTo(width - 120 * scale, height - 20 * scale);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width - 20 * scale, height - 120 * scale);
    ctx.lineTo(width - 180 * scale, height - 20 * scale);
    ctx.stroke();
    
    // Horizontal accent lines
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10 * scale;
    
    // Top accent line
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.18);
    ctx.lineTo(width * 0.85, height * 0.18);
    ctx.stroke();
    
    // Bottom accent line  
    ctx.strokeStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.82);
    ctx.lineTo(width * 0.85, height * 0.82);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Calculate photo position - responsive for portrait/square
    const isVertical = layoutCalc.isPortrait || layoutCalc.isSquare;
    const photoSize = layoutCalc.getPhotoSize(layout) * (isVertical ? 0.9 : 1.1);
    const photoX = isVertical ? width / 2 : width * 0.28;
    const photoY = isVertical ? height * 0.35 : height / 2;
    
    if (profileImage) {
        // Draw hexagonal frame with glow
        drawHexagonalPhoto(photoX, photoY, photoSize, scale);
    }
    
    // Text positioning - responsive
    const fontSizes = layoutCalc.getFontSizes();
    const textX = isVertical ? width / 2 : photoX + photoSize / 2 + 60 * scale;
    const textAlign = isVertical ? 'center' : 'left';
    ctx.textAlign = textAlign;
    
    const nameY = isVertical ? photoY + photoSize / 2 + 55 * scale : height * 0.42;
    
    // Name with glow effect
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSizes.name * 1.1}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('nameText').value.toUpperCase(), textX, nameY);
    ctx.shadowBlur = 0;
    
    // Title in cyan/gradient
    const titleY = nameY + fontSizes.name * 1.3;
    ctx.fillStyle = '#00ffff';
    ctx.font = `600 ${fontSizes.title}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('titleText').value.toUpperCase(), textX, titleY);
    
    // Subtitle in lighter color
    const subtitleY = titleY + fontSizes.title * 1.4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `${fontSizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('subtitleText').value, textX, subtitleY);
    
    // Website at bottom
    const websiteText = document.getElementById('websiteText').value;
    if (websiteText) {
        ctx.fillStyle = '#ff00ff';
        ctx.font = `500 ${fontSizes.website}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(websiteText, width / 2, height - 35 * scale);
    }
}

// Helper function to draw hexagonal photo frame
function drawHexagonalPhoto(cx, cy, size, scale) {
    const radius = size / 2;
    const sides = 6;
    const angleOffset = Math.PI / 6; // Start from flat top
    
    // Outer glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 30 * scale;
    
    // Draw hexagon path
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI / sides) + angleOffset;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    // Clip and draw image
    ctx.save();
    ctx.clip();
    
    const imgAspect = profileImage.width / profileImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspect > 1) {
        drawHeight = size;
        drawWidth = size * imgAspect;
        offsetX = -(drawWidth - size) / 2;
        offsetY = 0;
    } else {
        drawWidth = size;
        drawHeight = size / imgAspect;
        offsetX = 0;
        offsetY = -(drawHeight - size) / 2;
    }
    ctx.drawImage(profileImage, cx - size / 2 + offsetX, cy - size / 2 + offsetY, drawWidth, drawHeight);
    ctx.restore();
    
    // Draw hexagon border with glow
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 4 * scale;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20 * scale;
    
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI / sides) + angleOffset;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Inner border
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    ctx.shadowBlur = 0;
    
    const innerRadius = radius - 8 * scale;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI / sides) + angleOffset;
        const x = cx + innerRadius * Math.cos(angle);
        const y = cy + innerRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
}

// Minimal Luxury template - elegant and premium clean design
function renderMinimalLuxury(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout) {
    const scale = layoutCalc.getScaleFactor();
    
    // Elegant cream background with subtle gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#fdfcfb');
    bgGradient.addColorStop(0.5, '#f8f7f5');
    bgGradient.addColorStop(1, '#f5f4f2');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Premium paper texture
    ctx.globalAlpha = 0.015;
    for (let i = 0; i < width; i += 3) {
        for (let j = 0; j < height; j += 3) {
            if (Math.random() > 0.5) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(i, j, 1, 1);
            }
        }
    }
    ctx.globalAlpha = 1;
    
    // Premium gold color
    const goldColor = '#b8860b';
    const goldLight = '#d4af37';
    
    // Elegant corner accents (top-left and bottom-right)
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2 * scale;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(40 * scale, 60 * scale);
    ctx.lineTo(40 * scale, 40 * scale);
    ctx.lineTo(60 * scale, 40 * scale);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - 40 * scale, height - 60 * scale);
    ctx.lineTo(width - 40 * scale, height - 40 * scale);
    ctx.lineTo(width - 60 * scale, height - 40 * scale);
    ctx.stroke();
    
    // Photo with elegant gold border - responsive for portrait/square
    const isVertical = layoutCalc.isPortrait || layoutCalc.isSquare;
    const photoSize = layoutCalc.getPhotoSize(layout) * (isVertical ? 0.7 : 0.85);
    const photoX = isVertical ? width / 2 : width * 0.28;
    const photoY = isVertical ? height * 0.32 : height / 2;
    
    if (profileImage) {
        // Outer gold ring
        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 2.5 * scale;
        ctx.beginPath();
        ctx.arc(photoX, photoY, photoSize / 2 + 10 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner gold ring
        ctx.strokeStyle = goldLight;
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.arc(photoX, photoY, photoSize / 2 + 5 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        drawProfileImageMinimal(photoX, photoY, photoSize);
    }
    
    // Text positioning - responsive
    const textX = isVertical ? width / 2 : photoX + photoSize / 2 + 80 * scale;
    const textAlign = isVertical ? 'center' : 'left';
    ctx.textAlign = textAlign;
    
    // Vertical gold accent bar (for landscape layouts only)
    if (!isVertical) {
        const accentGradient = ctx.createLinearGradient(textX - 25 * scale, 0, textX - 23 * scale, 0);
        accentGradient.addColorStop(0, goldLight);
        accentGradient.addColorStop(0.5, goldColor);
        accentGradient.addColorStop(1, goldLight);
        ctx.fillStyle = accentGradient;
        ctx.fillRect(textX - 25 * scale, height * 0.32, 2.5 * scale, height * 0.36);
    }
    
    const fontSizes = layoutCalc.getFontSizes();
    const nameY = isVertical ? photoY + photoSize / 2 + 50 * scale : height * 0.40;
    
    // Name in elegant dark charcoal
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `700 ${fontSizes.name * 1.1}px "Plus Jakarta Sans", serif`;
    ctx.fillText(document.getElementById('nameText').value, textX, nameY);
    
    // Horizontal gold underline below name (landscape only)
    if (!isVertical) {
        const nameWidth = ctx.measureText(document.getElementById('nameText').value).width;
        ctx.fillStyle = goldColor;
        ctx.fillRect(textX, nameY + 12 * scale, Math.min(nameWidth, 150 * scale), 2 * scale);
    }
    
    // Title in gold
    ctx.fillStyle = goldColor;
    ctx.font = `500 ${fontSizes.title}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('titleText').value, textX, nameY + fontSizes.name * 1.4);
    
    // Subtitle in muted gray
    ctx.fillStyle = '#5a5a5a';
    ctx.font = `400 ${fontSizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('subtitleText').value, textX, nameY + fontSizes.name * 1.4 + fontSizes.title * 1.5);
    
    // Website with gold accent
    const websiteText = document.getElementById('websiteText').value;
    if (websiteText) {
        ctx.fillStyle = '#888888';
        ctx.font = `400 ${fontSizes.website}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(websiteText, width / 2, height - 38 * scale);
    }
}

// Vibrant Gradient template - bold and colorful with premium design
function renderVibrantGradient(width, height, colorStart, colorEnd, accentColor, layoutCalc, layout) {
    const scale = layoutCalc.getScaleFactor();
    const isVertical = layoutCalc.isPortrait || layoutCalc.isSquare;
    
    // Rich multi-color gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.25, '#764ba2');
    gradient.addColorStop(0.5, '#f093fb');
    gradient.addColorStop(0.75, '#f5576c');
    gradient.addColorStop(1, '#fda085');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Elegant gradient blob overlays (fixed positions for consistency)
    const blobs = [
        { x: width * 0.1, y: height * 0.2, size: 180 * scale, color1: 'rgba(255, 255, 255, 0.25)', color2: 'rgba(255, 255, 255, 0)' },
        { x: width * 0.85, y: height * 0.15, size: 220 * scale, color1: 'rgba(255, 255, 255, 0.2)', color2: 'rgba(255, 255, 255, 0)' },
        { x: width * 0.7, y: height * 0.75, size: 250 * scale, color1: 'rgba(255, 255, 255, 0.18)', color2: 'rgba(255, 255, 255, 0)' },
        { x: width * 0.15, y: height * 0.8, size: 200 * scale, color1: 'rgba(255, 255, 255, 0.22)', color2: 'rgba(255, 255, 255, 0)' },
        { x: width * 0.5, y: height * 0.5, size: 300 * scale, color1: 'rgba(255, 255, 255, 0.1)', color2: 'rgba(255, 255, 255, 0)' }
    ];
    
    blobs.forEach(blob => {
        const blobGradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.size);
        blobGradient.addColorStop(0, blob.color1);
        blobGradient.addColorStop(1, blob.color2);
        ctx.fillStyle = blobGradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Photo positioning - responsive for vertical layouts
    const photoSize = isVertical ? Math.min(width, height) * 0.28 : layoutCalc.getPhotoSize(layout);
    const photoX = isVertical ? width / 2 : layoutCalc.getPhotoPosition(layout, photoSize).x;
    const photoY = isVertical ? height * 0.28 : layoutCalc.getPhotoPosition(layout, photoSize).y;
    const cornerRadius = photoSize * 0.2;
    
    if (profileImage) {
        // Soft shadow behind photo
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 30 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10 * scale;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(photoX - photoSize / 2 - 6 * scale, photoY - photoSize / 2 - 6 * scale, photoSize + 12 * scale, photoSize + 12 * scale, cornerRadius + 4 * scale);
        ctx.fill();
        ctx.restore();
        
        // White border around photo
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(photoX - photoSize / 2 - 5 * scale, photoY - photoSize / 2 - 5 * scale, photoSize + 10 * scale, photoSize + 10 * scale, cornerRadius + 3 * scale);
        ctx.fill();
        
        // Photo with rounded rectangle clip
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX - photoSize / 2, photoY - photoSize / 2, photoSize, photoSize, cornerRadius);
        ctx.clip();
        
        const imgAspect = profileImage.width / profileImage.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgAspect > 1) {
            drawHeight = photoSize;
            drawWidth = photoSize * imgAspect;
            offsetX = -(drawWidth - photoSize) / 2;
            offsetY = 0;
        } else {
            drawWidth = photoSize;
            drawHeight = photoSize / imgAspect;
            offsetX = 0;
            offsetY = -(drawHeight - photoSize) / 2;
        }
        ctx.drawImage(profileImage, photoX - photoSize / 2 + offsetX, photoY - photoSize / 2 + offsetY, drawWidth, drawHeight);
        ctx.restore();
    }
    
    // Text positioning - responsive for vertical layouts
    const fontSizes = layoutCalc.getFontSizes();
    const textX = isVertical ? width / 2 : layoutCalc.getTextLayout(layout, photoSize, {x: photoX, y: photoY}).startX;
    const textAlign = isVertical ? 'center' : 'left';
    
    // Calculate Y positions for vertical layout
    const nameY = isVertical ? photoY + photoSize / 2 + 60 * scale : layoutCalc.getTextLayout(layout, photoSize, {x: photoX, y: photoY}).nameY;
    const titleY = nameY + fontSizes.name * 1.35;
    const subtitleY = titleY + fontSizes.title * 1.3;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 15 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3 * scale;
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = textAlign;
    
    // Name with bold styling
    ctx.font = `800 ${fontSizes.name * 1.15}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('nameText').value, textX, nameY);
    
    // Title
    ctx.font = `600 ${fontSizes.title}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('titleText').value, textX, titleY);
    
    // Subtitle with softer opacity
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `400 ${fontSizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('subtitleText').value, textX, subtitleY);
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Website - centered at bottom for vertical, right-aligned for landscape
    const websiteText = document.getElementById('websiteText').value;
    if (websiteText) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${fontSizes.website}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = isVertical ? 'center' : 'right';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8 * scale;
        const websiteX = isVertical ? width / 2 : width - 50 * scale;
        ctx.fillText(websiteText, websiteX, height - 50 * scale);
        ctx.shadowBlur = 0;
    }
}

// Helper function for glassmorphism photo with glow
function drawProfileImageWithGlow(x, y, size, glowColor, scale) {
    ctx.save();
    
    // Glow effect
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25 * scale;
    
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const imgAspect = profileImage.width / profileImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > 1) {
        drawHeight = size;
        drawWidth = size * imgAspect;
        offsetX = -(drawWidth - size) / 2;
        offsetY = 0;
    } else {
        drawWidth = size;
        drawHeight = size / imgAspect;
        offsetX = 0;
        offsetY = -(drawHeight - size) / 2;
    }

    ctx.drawImage(profileImage, x - size / 2 + offsetX, y - size / 2 + offsetY, drawWidth, drawHeight);
    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.stroke();
}

// Helper for minimal style photo
function drawProfileImageMinimal(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const imgAspect = profileImage.width / profileImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > 1) {
        drawHeight = size;
        drawWidth = size * imgAspect;
        offsetX = -(drawWidth - size) / 2;
        offsetY = 0;
    } else {
        drawWidth = size;
        drawHeight = size / imgAspect;
        offsetX = 0;
        offsetY = -(drawHeight - size) / 2;
    }

    ctx.drawImage(profileImage, x - size / 2 + offsetX, y - size / 2 + offsetY, drawWidth, drawHeight);
    ctx.restore();
}

// Helper for text content drawing
function drawTextContent(textX, nameY, titleY, subtitleY, fontSizes, maxWidth) {
    ctx.fillStyle = '#ffffff';
    
    ctx.font = `bold ${fontSizes.name}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(document.getElementById('nameText').value, textX, nameY);
    
    ctx.font = `${fontSizes.title}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(document.getElementById('titleText').value, textX, titleY);
    
    ctx.font = `${fontSizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText(document.getElementById('subtitleText').value, textX, subtitleY);
}

function drawProfileImage(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Calculate aspect ratio and draw centered
    const imgAspect = profileImage.width / profileImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > 1) {
        // Landscape image
        drawHeight = size;
        drawWidth = size * imgAspect;
        offsetX = -(drawWidth - size) / 2;
        offsetY = 0;
    } else {
        // Portrait image
        drawWidth = size;
        drawHeight = size / imgAspect;
        offsetX = 0;
        offsetY = -(drawHeight - size) / 2;
    }

    ctx.drawImage(profileImage,
        x - size / 2 + offsetX,
        y - size / 2 + offsetY,
        drawWidth,
        drawHeight);
    ctx.restore();

    // Add border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.stroke();
}

function drawText(layout, sizes) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = layout.align;

    const nameText = document.getElementById('nameText').value;
    const titleText = document.getElementById('titleText').value;
    const subtitleText = document.getElementById('subtitleText').value;
    const websiteText = document.getElementById('websiteText').value;

    // Word wrap helper
    function wrapText(text, maxWidth, fontSize, fontWeight = 'normal') {
        ctx.font = `${fontWeight} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Draw name with word wrap
    const nameLines = wrapText(nameText, layout.maxWidth, sizes.name, 'bold');
    let currentY = layout.nameY;
    nameLines.forEach((line, index) => {
        ctx.font = `bold ${sizes.name}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(line, layout.startX, currentY + (index * sizes.name * 1.2));
    });

    // Draw title
    currentY = layout.titleY + (nameLines.length - 1) * sizes.name * 1.2;
    ctx.font = `${sizes.title}px "Plus Jakarta Sans", sans-serif`;
    const titleLines = wrapText(titleText, layout.maxWidth, sizes.title);
    titleLines.forEach((line, index) => {
        ctx.fillText(line, layout.startX, currentY + (index * sizes.title * 1.2));
    });

    // Draw subtitle if exists
    if (subtitleText) {
        currentY = layout.subtitleY + (nameLines.length - 1) * sizes.name * 1.2 + (titleLines.length - 1) * sizes.title * 1.2;
        ctx.font = `${sizes.subtitle}px "Plus Jakarta Sans", sans-serif`;
        const subtitleLines = wrapText(subtitleText, layout.maxWidth, sizes.subtitle);
        subtitleLines.forEach((line, index) => {
            ctx.fillText(line, layout.startX, currentY + (index * sizes.subtitle * 1.2));
        });
    }

    // Draw website
    if (websiteText) {
        ctx.font = `${sizes.website}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = layout.align === 'center' ? 'center' : 'right';
        ctx.fillText(websiteText, layout.websiteX, layout.websiteY);
    }
}

function applyEffect(width, height, accentColor, layoutCalc) {
    const scale = layoutCalc.getScaleFactor();
    ctx.globalAlpha = 0.08;

    switch (currentEffect) {
        case 'pattern':
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 1 * scale;
            const spacing = 60 * scale;
            for (let i = 0; i < Math.floor(width / spacing); i++) {
                ctx.beginPath();
                ctx.moveTo(i * spacing, 0);
                ctx.lineTo(i * spacing + 200 * scale, height);
                ctx.stroke();
            }
            break;

        case 'circles':
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2 * scale;
            const circleCount = Math.floor((width * height) / 100000);
            for (let i = 0; i < circleCount; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * width, Math.random() * height,
                    (50 + Math.random() * 100) * scale, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;

        case 'grid':
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 1 * scale;
            const gridSpacing = 60 * scale;
            for (let i = 0; i < width; i += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let i = 0; i < height; i += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }
            break;

        case 'waves':
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 3 * scale;
            const waveCount = 5;
            for (let i = 0; i < waveCount; i++) {
                ctx.beginPath();
                for (let x = 0; x < width; x += 10) {
                    const y = Math.sin((x / 50 + i) * scale) * 50 * scale + height / 2;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            break;

        case 'dots':
            ctx.fillStyle = accentColor;
            const dotCount = Math.floor((width * height) / 10000);
            for (let i = 0; i < dotCount; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * width, Math.random() * height,
                    (5 + Math.random() * 10) * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }

    ctx.globalAlpha = 1.0;
}

function downloadImage() {
    const quality = parseFloat(document.getElementById('exportQuality').value);
    const fileName = `social-share-${canvas.width}x${canvas.height}.png`;

    // If quality is not 1, create a scaled version
    if (quality !== 1) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width * quality;
        tempCanvas.height = canvas.height * quality;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.scale(quality, quality);
        tempCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = fileName;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

async function copyToClipboard() {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        alert('✅ Image copied to clipboard!');
    } catch (err) {
        alert('❌ Copy failed. Please use the Download button instead.');
    }
}
