/**
 * Typography Module - Font selection and typography controls
 */

/**
 * Popular Google Fonts organized by category
 */
const FONT_OPTIONS = {
    serif: [
        'Merriweather',
        'Playfair Display',
        'Libre Baskerville',
        'Lora',
        'PT Serif',
        'Source Serif Pro',
        'Crimson Text',
        'Cormorant Garamond',
        'EB Garamond',
        'Spectral'
    ],
    sansSerif: [
        'Open Sans',
        'Roboto',
        'Lato',
        'Montserrat',
        'Source Sans Pro',
        'Inter',
        'Poppins',
        'Nunito',
        'Work Sans',
        'DM Sans',
        'Raleway',
        'Outfit',
        'Plus Jakarta Sans',
        'Manrope'
    ],
    display: [
        'Oswald',
        'Abril Fatface',
        'Bebas Neue',
        'Righteous',
        'Pacifico',
        'Lobster',
        'Permanent Marker'
    ],
    monospace: [
        'Roboto Mono',
        'Source Code Pro',
        'Fira Code',
        'JetBrains Mono',
        'IBM Plex Mono'
    ]
};

/**
 * Font weight options
 */
const FONT_WEIGHTS = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi-Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra-Bold' }
];

/**
 * Default heading sizes
 */
const DEFAULT_HEADING_SIZES = {
    h1: { min: 24, max: 48, default: 32 },
    h2: { min: 18, max: 36, default: 24 },
    h3: { min: 14, max: 28, default: 18 }
};

/**
 * Load Google Fonts dynamically
 */
function loadGoogleFonts(fonts) {
    const uniqueFonts = [...new Set(fonts)];
    const fontQuery = uniqueFonts.map(f => f.replace(/\s+/g, '+')).join('&family=');

    // Check if already loaded
    const existingLink = document.querySelector('link[data-google-fonts]');
    if (existingLink) {
        existingLink.remove();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700;800&display=swap`;
    link.setAttribute('data-google-fonts', 'true');
    document.head.appendChild(link);
}

/**
 * Initialize typography controls
 */
function initTypographyControls(onChange) {
    // Initialize font dropdowns
    initFontDropdown('heading-font', onChange);
    initFontDropdown('body-font', onChange);

    // Initialize weight dropdowns
    initWeightDropdown('heading-weight', onChange);
    initWeightDropdown('body-weight', onChange);

    // Initialize size inputs
    initSizeInputs(onChange);

    // Initialize line height and letter spacing
    initSpacingControls(onChange);
}

/**
 * Initialize a font dropdown
 */
function initFontDropdown(id, onChange) {
    const select = document.getElementById(id);
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    // Add option groups
    const categories = {
        'Sans Serif': FONT_OPTIONS.sansSerif,
        'Serif': FONT_OPTIONS.serif,
        'Display': FONT_OPTIONS.display,
        'Monospace': FONT_OPTIONS.monospace
    };

    Object.entries(categories).forEach(([category, fonts]) => {
        const group = document.createElement('optgroup');
        group.label = category;

        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font;
            group.appendChild(option);
        });

        select.appendChild(group);
    });

    // Add change listener
    select.addEventListener('change', () => {
        if (onChange) {
            const key = id === 'heading-font' ? 'headingFont' : 'bodyFont';
            onChange(key, select.value);
        }
        loadGoogleFonts([select.value]);
        updateFontPreview(id, select.value);
    });
}

/**
 * Initialize a weight dropdown
 */
function initWeightDropdown(id, onChange) {
    const select = document.getElementById(id);
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    FONT_WEIGHTS.forEach(weight => {
        const option = document.createElement('option');
        option.value = weight.value;
        option.textContent = weight.label;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        if (onChange) {
            const key = id === 'heading-weight' ? 'headingWeight' : 'bodyWeight';
            onChange(key, parseInt(select.value));
        }
    });
}

/**
 * Initialize size inputs
 */
function initSizeInputs(onChange) {
    // Heading sizes
    ['h1', 'h2', 'h3'].forEach(level => {
        const input = document.getElementById(`${level}-size`);
        if (!input) return;

        const config = DEFAULT_HEADING_SIZES[level];
        input.min = config.min;
        input.max = config.max;

        input.addEventListener('input', () => {
            const value = parseInt(input.value);
            if (value >= config.min && value <= config.max && onChange) {
                onChange(`headingSizes.${level}`, value);
            }
        });
    });

    // Body size
    const bodyInput = document.getElementById('body-size');
    if (bodyInput) {
        bodyInput.addEventListener('input', () => {
            const value = parseInt(bodyInput.value);
            if (value >= 10 && value <= 24 && onChange) {
                onChange('bodySize', value);
            }
        });
    }
}

/**
 * Initialize line height and letter spacing controls
 */
function initSpacingControls(onChange) {
    const lineHeightInput = document.getElementById('line-height');
    if (lineHeightInput) {
        lineHeightInput.addEventListener('input', () => {
            const value = parseFloat(lineHeightInput.value);
            if (value >= 1 && value <= 3 && onChange) {
                onChange('lineHeight', value);
            }
            updateSpacingDisplay('line-height-display', value);
        });
    }

    const letterSpacingInput = document.getElementById('letter-spacing');
    if (letterSpacingInput) {
        letterSpacingInput.addEventListener('input', () => {
            const value = parseFloat(letterSpacingInput.value);
            if (value >= -2 && value <= 5 && onChange) {
                onChange('letterSpacing', value);
            }
            updateSpacingDisplay('letter-spacing-display', value + 'px');
        });
    }
}

/**
 * Update spacing display value
 */
function updateSpacingDisplay(id, value) {
    const display = document.getElementById(id);
    if (display) {
        display.textContent = value;
    }
}

/**
 * Update font preview
 */
function updateFontPreview(inputId, fontFamily) {
    const preview = document.getElementById(`${inputId}-preview`);
    if (preview) {
        preview.style.fontFamily = `"${fontFamily}", sans-serif`;
    }
}

/**
 * Set typography values from a profile
 */
function setTypographyValues(typography) {
    // Font families
    const headingFontSelect = document.getElementById('heading-font');
    const bodyFontSelect = document.getElementById('body-font');

    if (headingFontSelect) {
        headingFontSelect.value = typography.headingFont;
        updateFontPreview('heading-font', typography.headingFont);
    }
    if (bodyFontSelect) {
        bodyFontSelect.value = typography.bodyFont;
        updateFontPreview('body-font', typography.bodyFont);
    }

    // Font weights
    const headingWeightSelect = document.getElementById('heading-weight');
    const bodyWeightSelect = document.getElementById('body-weight');

    if (headingWeightSelect) headingWeightSelect.value = typography.headingWeight;
    if (bodyWeightSelect) bodyWeightSelect.value = typography.bodyWeight;

    // Heading sizes
    ['h1', 'h2', 'h3'].forEach(level => {
        const input = document.getElementById(`${level}-size`);
        if (input && typography.headingSizes) {
            input.value = typography.headingSizes[level];
        }
    });

    // Body size
    const bodySizeInput = document.getElementById('body-size');
    if (bodySizeInput) bodySizeInput.value = typography.bodySize;

    // Line height
    const lineHeightInput = document.getElementById('line-height');
    if (lineHeightInput) {
        lineHeightInput.value = typography.lineHeight;
        updateSpacingDisplay('line-height-display', typography.lineHeight);
    }

    // Letter spacing
    const letterSpacingInput = document.getElementById('letter-spacing');
    if (letterSpacingInput) {
        letterSpacingInput.value = typography.letterSpacing;
        updateSpacingDisplay('letter-spacing-display', typography.letterSpacing + 'px');
    }

    // Load the fonts
    loadGoogleFonts([typography.headingFont, typography.bodyFont]);
}

/**
 * Get current typography values from the form
 */
function getTypographyValues() {
    return {
        headingFont: document.getElementById('heading-font')?.value || 'Playfair Display',
        bodyFont: document.getElementById('body-font')?.value || 'Open Sans',
        headingSizes: {
            h1: parseInt(document.getElementById('h1-size')?.value) || 32,
            h2: parseInt(document.getElementById('h2-size')?.value) || 24,
            h3: parseInt(document.getElementById('h3-size')?.value) || 18
        },
        bodySize: parseInt(document.getElementById('body-size')?.value) || 14,
        headingWeight: parseInt(document.getElementById('heading-weight')?.value) || 700,
        bodyWeight: parseInt(document.getElementById('body-weight')?.value) || 400,
        lineHeight: parseFloat(document.getElementById('line-height')?.value) || 1.6,
        letterSpacing: parseFloat(document.getElementById('letter-spacing')?.value) || 0
    };
}

/**
 * Get all available fonts as a flat array
 */
function getAllFonts() {
    return [
        ...FONT_OPTIONS.sansSerif,
        ...FONT_OPTIONS.serif,
        ...FONT_OPTIONS.display,
        ...FONT_OPTIONS.monospace
    ];
}

// Export for use in other modules
window.Typography = {
    initTypographyControls,
    setTypographyValues,
    getTypographyValues,
    loadGoogleFonts,
    getAllFonts,
    FONT_OPTIONS,
    FONT_WEIGHTS,
    DEFAULT_HEADING_SIZES
};
