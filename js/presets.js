/**
 * Presets Module - Predefined brand template configurations
 */

const PRESETS = {
    corporate: {
        id: 'preset_corporate',
        name: 'Corporate',
        description: 'Professional blues, serif headings, clean layout',
        colors: {
            primary: '#1e3a5f',
            secondary: '#3d5a80',
            accent: '#ee6c4d',
            text: '#293241',
            background: '#ffffff'
        },
        typography: {
            headingFont: 'Merriweather',
            bodyFont: 'Source Sans Pro',
            headingSizes: { h1: 36, h2: 28, h3: 20 },
            bodySize: 14,
            headingWeight: 700,
            bodyWeight: 400,
            lineHeight: 1.6,
            letterSpacing: 0
        },
        logo: {
            data: null,
            filename: null,
            position: 'header-left',
            size: 'medium'
        },
        headerFooter: {
            companyName: 'Your Company Name',
            tagline: 'Excellence in Everything We Do',
            contactInfo: 'contact@company.com | (555) 123-4567',
            footerText: 'Confidential - For Internal Use Only'
        },
        watermark: {
            enabled: false,
            type: 'text',
            content: '',
            imageData: null,
            opacity: 0.1,
            position: 'center'
        },
        layout: {
            margins: { top: 1, right: 1, bottom: 1, left: 1 },
            spacing: 'normal'
        }
    },

    creative: {
        id: 'preset_creative',
        name: 'Creative',
        description: 'Bold colors, modern fonts, dynamic spacing',
        colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            text: '#1f2937',
            background: '#fafafa'
        },
        typography: {
            headingFont: 'Poppins',
            bodyFont: 'Inter',
            headingSizes: { h1: 40, h2: 30, h3: 22 },
            bodySize: 15,
            headingWeight: 600,
            bodyWeight: 400,
            lineHeight: 1.7,
            letterSpacing: 0.5
        },
        logo: {
            data: null,
            filename: null,
            position: 'header-center',
            size: 'large'
        },
        headerFooter: {
            companyName: 'Creative Studio',
            tagline: 'Where Ideas Come to Life',
            contactInfo: 'hello@creativestudio.com',
            footerText: ''
        },
        watermark: {
            enabled: false,
            type: 'text',
            content: '',
            imageData: null,
            opacity: 0.1,
            position: 'center'
        },
        layout: {
            margins: { top: 1.25, right: 1.25, bottom: 1.25, left: 1.25 },
            spacing: 'relaxed'
        }
    },

    minimal: {
        id: 'preset_minimal',
        name: 'Minimal',
        description: 'Monochrome, simple typography, generous whitespace',
        colors: {
            primary: '#171717',
            secondary: '#404040',
            accent: '#737373',
            text: '#262626',
            background: '#ffffff'
        },
        typography: {
            headingFont: 'DM Sans',
            bodyFont: 'DM Sans',
            headingSizes: { h1: 32, h2: 24, h3: 18 },
            bodySize: 14,
            headingWeight: 500,
            bodyWeight: 400,
            lineHeight: 1.8,
            letterSpacing: 0
        },
        logo: {
            data: null,
            filename: null,
            position: 'header-left',
            size: 'small'
        },
        headerFooter: {
            companyName: '',
            tagline: '',
            contactInfo: '',
            footerText: ''
        },
        watermark: {
            enabled: false,
            type: 'text',
            content: '',
            imageData: null,
            opacity: 0.1,
            position: 'center'
        },
        layout: {
            margins: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
            spacing: 'relaxed'
        }
    },

    academic: {
        id: 'preset_academic',
        name: 'Academic',
        description: 'Traditional fonts, formal structure, citation-friendly',
        colors: {
            primary: '#1e40af',
            secondary: '#1e3a8a',
            accent: '#dc2626',
            text: '#1f2937',
            background: '#ffffff'
        },
        typography: {
            headingFont: 'Libre Baskerville',
            bodyFont: 'Libre Baskerville',
            headingSizes: { h1: 28, h2: 22, h3: 18 },
            bodySize: 12,
            headingWeight: 700,
            bodyWeight: 400,
            lineHeight: 2.0,
            letterSpacing: 0
        },
        logo: {
            data: null,
            filename: null,
            position: 'header-center',
            size: 'medium'
        },
        headerFooter: {
            companyName: 'University Name',
            tagline: 'Department of Studies',
            contactInfo: '',
            footerText: 'Page {page} of {pages}'
        },
        watermark: {
            enabled: false,
            type: 'text',
            content: 'DRAFT',
            imageData: null,
            opacity: 0.05,
            position: 'diagonal'
        },
        layout: {
            margins: { top: 1, right: 1, bottom: 1, left: 1.5 },
            spacing: 'normal'
        }
    }
};

/**
 * Get all available presets
 */
function getAllPresets() {
    return Object.values(PRESETS);
}

/**
 * Get a specific preset by key
 */
function getPreset(key) {
    return PRESETS[key] || null;
}

/**
 * Create a new profile from a preset
 */
function createProfileFromPreset(presetKey, customName = null) {
    const preset = getPreset(presetKey);
    if (!preset) return null;

    const profile = Storage.createDefaultProfile(customName || preset.name);

    // Copy preset values
    profile.colors = { ...preset.colors };
    profile.typography = {
        ...preset.typography,
        headingSizes: { ...preset.typography.headingSizes }
    };
    profile.logo = { ...preset.logo };
    profile.headerFooter = { ...preset.headerFooter };
    profile.watermark = { ...preset.watermark };
    profile.layout = {
        ...preset.layout,
        margins: { ...preset.layout.margins }
    };

    return profile;
}

/**
 * Get preset colors for preview
 */
function getPresetColors(presetKey) {
    const preset = getPreset(presetKey);
    return preset ? preset.colors : null;
}

// Export for use in other modules
window.Presets = {
    getAllPresets,
    getPreset,
    createProfileFromPreset,
    getPresetColors,
    PRESETS
};
