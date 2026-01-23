/**
 * Template Parser Module - Extract styles from Word documents
 */

/**
 * Parse a Word document and extract style information
 */
async function parseWordDocument(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const result = await extractStylesFromDocx(arrayBuffer);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Extract styles from a docx file using mammoth.js
 */
async function extractStylesFromDocx(arrayBuffer) {
    const extractedStyles = {
        colors: {
            primary: null,
            secondary: null,
            accent: null,
            text: null,
            background: null
        },
        typography: {
            headingFont: null,
            bodyFont: null,
            headingSizes: { h1: null, h2: null, h3: null },
            bodySize: null
        },
        rawContent: null
    };

    try {
        // Use mammoth to convert to HTML for analysis
        const result = await mammoth.convertToHtml({ arrayBuffer });
        extractedStyles.rawContent = result.value;

        // Also extract raw text for display
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        extractedStyles.rawText = textResult.value;

        // Parse the HTML to extract styles
        const parser = new DOMParser();
        const doc = parser.parseFromString(result.value, 'text/html');

        // Extract colors from inline styles
        const colorMatches = new Set();
        doc.querySelectorAll('[style]').forEach(el => {
            const style = el.getAttribute('style');

            // Extract color values
            const colorMatch = style.match(/color:\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\))/gi);
            if (colorMatch) {
                colorMatch.forEach(c => {
                    const value = c.replace(/color:\s*/i, '').trim();
                    colorMatches.add(normalizeColor(value));
                });
            }

            // Extract background colors
            const bgMatch = style.match(/background-color:\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\))/gi);
            if (bgMatch) {
                bgMatch.forEach(c => {
                    const value = c.replace(/background-color:\s*/i, '').trim();
                    colorMatches.add(normalizeColor(value));
                });
            }
        });

        // Assign extracted colors
        const uniqueColors = Array.from(colorMatches).filter(c => c && c !== '#000000' && c !== '#ffffff');
        if (uniqueColors.length > 0) extractedStyles.colors.primary = uniqueColors[0];
        if (uniqueColors.length > 1) extractedStyles.colors.secondary = uniqueColors[1];
        if (uniqueColors.length > 2) extractedStyles.colors.accent = uniqueColors[2];

        // Try to detect text color (most common dark color)
        const darkColors = Array.from(colorMatches).filter(c => isColorDark(c));
        if (darkColors.length > 0) {
            extractedStyles.colors.text = darkColors[0];
        }

        // Extract font information
        const fontMatches = new Set();
        doc.querySelectorAll('[style]').forEach(el => {
            const style = el.getAttribute('style');
            const fontMatch = style.match(/font-family:\s*([^;]+)/i);
            if (fontMatch) {
                const fontName = fontMatch[1].split(',')[0].replace(/["']/g, '').trim();
                fontMatches.add(fontName);
            }
        });

        const fonts = Array.from(fontMatches);
        if (fonts.length > 0) extractedStyles.typography.headingFont = fonts[0];
        if (fonts.length > 1) extractedStyles.typography.bodyFont = fonts[1];
        else if (fonts.length === 1) extractedStyles.typography.bodyFont = fonts[0];

        // Extract font sizes
        const fontSizes = [];
        doc.querySelectorAll('[style]').forEach(el => {
            const style = el.getAttribute('style');
            const sizeMatch = style.match(/font-size:\s*(\d+(?:\.\d+)?)(px|pt|em|rem)/i);
            if (sizeMatch) {
                let size = parseFloat(sizeMatch[1]);
                const unit = sizeMatch[2].toLowerCase();

                // Convert to pt
                if (unit === 'px') size = size * 0.75;
                else if (unit === 'em' || unit === 'rem') size = size * 12;

                fontSizes.push(Math.round(size));
            }
        });

        // Sort sizes and assign to heading levels
        const uniqueSizes = [...new Set(fontSizes)].sort((a, b) => b - a);
        if (uniqueSizes.length > 0) extractedStyles.typography.headingSizes.h1 = uniqueSizes[0];
        if (uniqueSizes.length > 1) extractedStyles.typography.headingSizes.h2 = uniqueSizes[1];
        if (uniqueSizes.length > 2) extractedStyles.typography.headingSizes.h3 = uniqueSizes[2];
        if (uniqueSizes.length > 3) extractedStyles.typography.bodySize = uniqueSizes[uniqueSizes.length - 1];

    } catch (error) {
        console.error('Error parsing document:', error);
    }

    return extractedStyles;
}

/**
 * Normalize a color value to hex format
 */
function normalizeColor(color) {
    if (!color) return null;

    // Already hex
    if (color.startsWith('#')) {
        // Expand 3-digit hex
        if (color.length === 4) {
            return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        return color.toUpperCase();
    }

    // RGB format
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
        const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
        const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
    }

    return null;
}

/**
 * Check if a color is dark
 */
function isColorDark(hexColor) {
    if (!hexColor || !hexColor.startsWith('#')) return false;

    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

/**
 * Apply extracted styles to a profile
 */
function applyExtractedStyles(profile, extractedStyles) {
    const updated = { ...profile };

    // Apply colors (only non-null values)
    Object.entries(extractedStyles.colors).forEach(([key, value]) => {
        if (value) {
            updated.colors[key] = value;
        }
    });

    // Apply typography (only non-null values)
    if (extractedStyles.typography.headingFont) {
        updated.typography.headingFont = extractedStyles.typography.headingFont;
    }
    if (extractedStyles.typography.bodyFont) {
        updated.typography.bodyFont = extractedStyles.typography.bodyFont;
    }
    Object.entries(extractedStyles.typography.headingSizes).forEach(([key, value]) => {
        if (value) {
            updated.typography.headingSizes[key] = value;
        }
    });
    if (extractedStyles.typography.bodySize) {
        updated.typography.bodySize = extractedStyles.typography.bodySize;
    }

    return updated;
}

/**
 * Get a summary of what was extracted
 */
function getExtractionSummary(extractedStyles) {
    const summary = [];

    // Colors
    const colorCount = Object.values(extractedStyles.colors).filter(c => c).length;
    if (colorCount > 0) {
        summary.push(`${colorCount} color(s) detected`);
    }

    // Fonts
    const fonts = [extractedStyles.typography.headingFont, extractedStyles.typography.bodyFont]
        .filter(f => f);
    if (fonts.length > 0) {
        summary.push(`Font(s): ${fonts.join(', ')}`);
    }

    // Sizes
    const sizeCount = Object.values(extractedStyles.typography.headingSizes).filter(s => s).length;
    if (sizeCount > 0 || extractedStyles.typography.bodySize) {
        summary.push(`${sizeCount + (extractedStyles.typography.bodySize ? 1 : 0)} font size(s) detected`);
    }

    return summary.length > 0 ? summary : ['No styles could be extracted'];
}

/**
 * Validate file is a valid docx
 */
function isValidDocxFile(file) {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];

    // Check MIME type
    if (validTypes.includes(file.type)) return true;

    // Check extension as fallback
    const ext = file.name.split('.').pop().toLowerCase();
    return ext === 'docx' || ext === 'doc';
}

// Export for use in other modules
window.TemplateParser = {
    parseWordDocument,
    applyExtractedStyles,
    getExtractionSummary,
    isValidDocxFile,
    normalizeColor,
    isColorDark
};
