/**
 * Color Picker Module - Handles color selection with Pickr integration
 */

let colorPickers = {};

/**
 * Color configuration for brand colors
 */
const COLOR_CONFIG = {
    primary: {
        label: 'Primary',
        description: 'Main brand color for headings and key elements'
    },
    secondary: {
        label: 'Secondary',
        description: 'Supporting color for subheadings and accents'
    },
    accent: {
        label: 'Accent',
        description: 'Highlight color for call-to-actions and emphasis'
    },
    text: {
        label: 'Text',
        description: 'Default body text color'
    },
    background: {
        label: 'Background',
        description: 'Page or slide background color'
    }
};

/**
 * Initialize all color pickers
 */
function initColorPickers(onChange) {
    // Destroy any existing pickers
    destroyColorPickers();

    Object.keys(COLOR_CONFIG).forEach(colorKey => {
        const container = document.getElementById(`color-picker-${colorKey}`);
        if (!container) return;

        const picker = Pickr.create({
            el: container,
            theme: 'nano',
            default: '#ffffff',
            swatches: [
                '#1a73e8', '#34a853', '#ea4335', '#fbbc05',
                '#1e3a5f', '#6366f1', '#8b5cf6', '#f59e0b',
                '#171717', '#404040', '#737373', '#dc2626',
                '#202124', '#1f2937', '#293241', '#262626'
            ],
            components: {
                preview: true,
                opacity: false,
                hue: true,
                interaction: {
                    hex: true,
                    input: true,
                    save: true
                }
            }
        });

        picker.on('save', (color) => {
            if (color && onChange) {
                const hexColor = color.toHEXA().toString();
                onChange(colorKey, hexColor);
                updateHexInput(colorKey, hexColor);
            }
            picker.hide();
        });

        picker.on('change', (color) => {
            if (color) {
                const hexColor = color.toHEXA().toString();
                updateHexInput(colorKey, hexColor);
            }
        });

        colorPickers[colorKey] = picker;
    });

    // Set up hex input listeners
    initHexInputs(onChange);
}

/**
 * Initialize hex input fields
 */
function initHexInputs(onChange) {
    Object.keys(COLOR_CONFIG).forEach(colorKey => {
        const input = document.getElementById(`hex-input-${colorKey}`);
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value;

            // Auto-add # if not present
            if (value && !value.startsWith('#')) {
                value = '#' + value;
            }

            // Validate hex color
            if (isValidHex(value)) {
                input.classList.remove('border-red-500');
                if (colorPickers[colorKey]) {
                    colorPickers[colorKey].setColor(value);
                }
            } else if (value.length > 1) {
                input.classList.add('border-red-500');
            }
        });

        input.addEventListener('change', (e) => {
            let value = e.target.value;

            if (value && !value.startsWith('#')) {
                value = '#' + value;
                input.value = value;
            }

            if (isValidHex(value) && onChange) {
                onChange(colorKey, value);
                if (colorPickers[colorKey]) {
                    colorPickers[colorKey].setColor(value);
                }
            }
        });
    });
}

/**
 * Validate hex color format
 */
function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Update hex input field
 */
function updateHexInput(colorKey, value) {
    const input = document.getElementById(`hex-input-${colorKey}`);
    if (input) {
        input.value = value;
        input.classList.remove('border-red-500');
    }
}

/**
 * Set color picker value
 */
function setColorValue(colorKey, value) {
    if (colorPickers[colorKey]) {
        colorPickers[colorKey].setColor(value);
    }
    updateHexInput(colorKey, value);
}

/**
 * Set all color values from a profile
 */
function setAllColors(colors) {
    Object.entries(colors).forEach(([key, value]) => {
        setColorValue(key, value);
    });
}

/**
 * Get all current color values
 */
function getAllColors() {
    const colors = {};
    Object.keys(COLOR_CONFIG).forEach(colorKey => {
        const input = document.getElementById(`hex-input-${colorKey}`);
        if (input && isValidHex(input.value)) {
            colors[colorKey] = input.value;
        }
    });
    return colors;
}

/**
 * Destroy all color pickers
 */
function destroyColorPickers() {
    Object.values(colorPickers).forEach(picker => {
        if (picker && picker.destroyAndRemove) {
            picker.destroyAndRemove();
        }
    });
    colorPickers = {};
}

/**
 * Generate color picker HTML
 */
function generateColorPickerHTML(colorKey) {
    const config = COLOR_CONFIG[colorKey];
    if (!config) return '';

    return `
        <div class="color-picker-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">${config.label}</label>
            <div class="flex items-center gap-2">
                <div id="color-picker-${colorKey}" class="color-picker-button"></div>
                <input type="text" id="hex-input-${colorKey}"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="#000000"
                    maxlength="7">
            </div>
            <p class="text-xs text-gray-500 mt-1">${config.description}</p>
        </div>
    `;
}

/**
 * Generate all color pickers HTML
 */
function generateAllColorPickersHTML() {
    return Object.keys(COLOR_CONFIG).map(key => generateColorPickerHTML(key)).join('');
}

// Export for use in other modules
window.ColorPicker = {
    initColorPickers,
    setColorValue,
    setAllColors,
    getAllColors,
    destroyColorPickers,
    generateColorPickerHTML,
    generateAllColorPickersHTML,
    isValidHex,
    COLOR_CONFIG
};
