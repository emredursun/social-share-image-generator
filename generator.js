// Social Share Image Generator - Intelligent Adaptive Layout Engine
// © 2025 Emre Dursun

let canvas = document.getElementById('socialCanvas');
let ctx = canvas.getContext('2d');
let profileImage = null;
let currentEffect = 'pattern';
let currentLayout = 'auto';
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
                    startX: this.width * 0.1,
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
                        startX: this.width * 0.1,
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
                        startX: this.width * 0.1,
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

    // Load default profile image
    const img = new Image();
    img.onload = function () {
        profileImage = img;
        regenerateImage();
    };
    img.src = 'assets/default-profile.svg';

    regenerateImage();
};

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
