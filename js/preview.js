/**
 * Preview Module - Live preview rendering for documents and presentations
 */

let currentPreviewMode = 'document';

/**
 * Sample content for document preview
 */
const DOCUMENT_SAMPLE_CONTENT = {
    title: 'Annual Report 2024',
    subtitle: 'Building Tomorrow Together',
    sections: [
        {
            heading: 'Executive Summary',
            content: 'This year marked significant progress across all key initiatives. Our team delivered exceptional results while maintaining our commitment to quality and innovation.',
            subsection: {
                heading: 'Key Highlights',
                content: 'Revenue growth exceeded expectations by 15%, customer satisfaction reached an all-time high of 94%, and we expanded into three new markets.'
            }
        },
        {
            heading: 'Financial Overview',
            content: 'Our financial performance demonstrates the strength of our business model and the effectiveness of our strategic investments.',
            list: [
                'Total revenue: $45.2 million',
                'Operating margin: 22%',
                'Year-over-year growth: 18%'
            ]
        }
    ]
};

/**
 * Sample content for presentation preview
 */
const PRESENTATION_SAMPLE_CONTENT = {
    titleSlide: {
        title: 'Q4 Strategy Review',
        subtitle: 'Driving Growth Through Innovation'
    },
    contentSlide: {
        title: 'Our Strategic Priorities',
        bullets: [
            'Expand market presence in key regions',
            'Accelerate product development cycles',
            'Strengthen customer relationships',
            'Invest in team development'
        ]
    }
};

/**
 * Initialize preview component
 */
function initPreview() {
    currentPreviewMode = 'document';

    // Initialize sidebar preview toggle
    const previewToggle = document.getElementById('preview-toggle');
    if (previewToggle) {
        previewToggle.addEventListener('click', togglePreviewMode);
    }

    // Initialize full preview toggle
    const previewToggleFull = document.getElementById('preview-toggle-full');
    if (previewToggleFull) {
        previewToggleFull.addEventListener('click', togglePreviewMode);
    }
}

/**
 * Toggle between document and presentation preview
 */
function togglePreviewMode() {
    currentPreviewMode = currentPreviewMode === 'document' ? 'presentation' : 'document';

    const buttonText = currentPreviewMode === 'document' ? 'Switch to Presentation' : 'Switch to Document';

    // Update both toggle buttons
    const toggleBtn = document.getElementById('preview-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = buttonText;
    }

    const toggleBtnFull = document.getElementById('preview-toggle-full');
    if (toggleBtnFull) {
        toggleBtnFull.textContent = buttonText;
    }

    // Re-render with current profile
    const profile = window.App?.currentProfile;
    if (profile) {
        renderPreview(profile);
    }
}

/**
 * Render preview based on current mode
 */
function renderPreview(profile) {
    // Load fonts first
    Typography.loadGoogleFonts([profile.typography.headingFont, profile.typography.bodyFont]);

    // Render to sidebar preview container
    const container = document.getElementById('preview-container');
    if (container) {
        if (currentPreviewMode === 'document') {
            renderDocumentPreview(container, profile);
        } else {
            renderPresentationPreview(container, profile);
        }
    }

    // Also render to full preview container if visible
    const fullContainer = document.getElementById('preview-container-full');
    if (fullContainer) {
        if (currentPreviewMode === 'document') {
            renderDocumentPreview(fullContainer, profile);
        } else {
            renderPresentationPreview(fullContainer, profile);
        }
    }
}

/**
 * Render document preview
 */
function renderDocumentPreview(container, profile) {
    const { colors, typography, logo, headerFooter, watermark, layout } = profile;

    const marginStyle = `
        padding: ${layout.margins.top * 40}px ${layout.margins.right * 40}px ${layout.margins.bottom * 40}px ${layout.margins.left * 40}px;
    `;

    const headingStyle = `
        font-family: "${typography.headingFont}", serif;
        font-weight: ${typography.headingWeight};
        color: ${colors.primary};
        letter-spacing: ${typography.letterSpacing}px;
    `;

    const subheadingStyle = `
        font-family: "${typography.headingFont}", serif;
        font-weight: ${typography.headingWeight};
        color: ${colors.secondary};
        letter-spacing: ${typography.letterSpacing}px;
    `;

    const bodyStyle = `
        font-family: "${typography.bodyFont}", sans-serif;
        font-weight: ${typography.bodyWeight};
        font-size: ${typography.bodySize}px;
        color: ${colors.text};
        line-height: ${typography.lineHeight};
    `;

    const watermarkHTML = watermark.enabled ? `
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            style="opacity: ${watermark.opacity}; ${watermark.position === 'diagonal' ? 'transform: rotate(-45deg);' : ''}">
            <span style="font-size: 80px; color: ${colors.secondary}; white-space: nowrap;">
                ${watermark.type === 'text' ? watermark.content : ''}
            </span>
        </div>
    ` : '';

    const logoHTML = logo.data ? `
        <img src="${logo.data}" alt="Logo" class="max-h-12 ${
            logo.position === 'header-center' ? 'mx-auto' :
            logo.position === 'header-right' ? 'ml-auto' : ''
        }" style="max-width: ${logo.size === 'small' ? '80px' : logo.size === 'large' ? '160px' : '120px'};">
    ` : '';

    const headerHTML = (logo.data || headerFooter.companyName) ? `
        <div class="flex items-center justify-between border-b pb-3 mb-6" style="border-color: ${colors.secondary}20;">
            ${logo.position === 'header-left' ? logoHTML : ''}
            <div class="text-center flex-1">
                ${logo.position === 'header-center' ? logoHTML : ''}
                ${headerFooter.companyName ? `<div style="font-family: '${typography.headingFont}'; color: ${colors.secondary}; font-size: 14px;">${headerFooter.companyName}</div>` : ''}
                ${headerFooter.tagline ? `<div style="font-size: 11px; color: ${colors.text}80;">${headerFooter.tagline}</div>` : ''}
            </div>
            ${logo.position === 'header-right' ? logoHTML : '<div></div>'}
        </div>
    ` : '';

    const footerHTML = headerFooter.footerText ? `
        <div class="border-t pt-3 mt-6 text-center" style="border-color: ${colors.secondary}20; font-size: 10px; color: ${colors.text}80;">
            ${headerFooter.footerText.replace('{page}', '1').replace('{pages}', '3')}
        </div>
    ` : '';

    container.innerHTML = `
        <div class="relative bg-white shadow-lg mx-auto overflow-hidden" style="width: 100%; max-width: 520px; min-height: 680px; background-color: ${colors.background}; ${marginStyle}">
            ${watermarkHTML}
            <div class="relative z-10">
                ${headerHTML}

                <h1 style="${headingStyle} font-size: ${typography.headingSizes.h1}px; margin-bottom: 8px;">
                    ${DOCUMENT_SAMPLE_CONTENT.title}
                </h1>
                <p style="${bodyStyle} margin-bottom: 24px; color: ${colors.secondary};">
                    ${DOCUMENT_SAMPLE_CONTENT.subtitle}
                </p>

                ${DOCUMENT_SAMPLE_CONTENT.sections.map(section => `
                    <h2 style="${subheadingStyle} font-size: ${typography.headingSizes.h2}px; margin-top: 20px; margin-bottom: 8px;">
                        ${section.heading}
                    </h2>
                    <p style="${bodyStyle} margin-bottom: 12px;">
                        ${section.content}
                    </p>
                    ${section.subsection ? `
                        <h3 style="${subheadingStyle} font-size: ${typography.headingSizes.h3}px; margin-top: 16px; margin-bottom: 6px; color: ${colors.accent};">
                            ${section.subsection.heading}
                        </h3>
                        <p style="${bodyStyle} margin-bottom: 12px;">
                            ${section.subsection.content}
                        </p>
                    ` : ''}
                    ${section.list ? `
                        <ul style="${bodyStyle} margin-left: 20px; list-style-type: disc;">
                            ${section.list.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                `).join('')}

                ${footerHTML}
            </div>
        </div>
    `;
}

/**
 * Render presentation preview
 */
function renderPresentationPreview(container, profile) {
    const { colors, typography, logo, headerFooter, watermark } = profile;

    const headingStyle = `
        font-family: "${typography.headingFont}", serif;
        font-weight: ${typography.headingWeight};
        color: ${colors.primary};
    `;

    const bodyStyle = `
        font-family: "${typography.bodyFont}", sans-serif;
        font-weight: ${typography.bodyWeight};
        font-size: ${typography.bodySize + 2}px;
        color: ${colors.text};
        line-height: ${typography.lineHeight};
    `;

    const watermarkHTML = watermark.enabled ? `
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none"
            style="opacity: ${watermark.opacity}; ${watermark.position === 'diagonal' ? 'transform: rotate(-45deg);' : ''}">
            <span style="font-size: 48px; color: ${colors.secondary};">
                ${watermark.type === 'text' ? watermark.content : ''}
            </span>
        </div>
    ` : '';

    const logoHTML = logo.data ? `
        <img src="${logo.data}" alt="Logo" class="absolute top-4 ${
            logo.position === 'header-center' ? 'left-1/2 -translate-x-1/2' :
            logo.position === 'header-right' ? 'right-4' : 'left-4'
        }" style="max-height: ${logo.size === 'small' ? '30px' : logo.size === 'large' ? '50px' : '40px'};">
    ` : '';

    container.innerHTML = `
        <div class="space-y-6">
            <!-- Title Slide -->
            <div class="relative shadow-lg mx-auto overflow-hidden rounded-lg" style="width: 100%; max-width: 520px; aspect-ratio: 16/9; background-color: ${colors.background};">
                ${watermarkHTML}
                ${logoHTML}
                <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
                    <h1 style="${headingStyle} font-size: ${typography.headingSizes.h1 + 4}px; margin-bottom: 12px;">
                        ${PRESENTATION_SAMPLE_CONTENT.titleSlide.title}
                    </h1>
                    <p style="${bodyStyle} color: ${colors.secondary}; font-size: ${typography.headingSizes.h3}px;">
                        ${PRESENTATION_SAMPLE_CONTENT.titleSlide.subtitle}
                    </p>
                    ${headerFooter.companyName ? `
                        <div class="absolute bottom-4 left-0 right-0 text-center" style="font-size: 12px; color: ${colors.text}80;">
                            ${headerFooter.companyName}
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Content Slide -->
            <div class="relative shadow-lg mx-auto overflow-hidden rounded-lg" style="width: 100%; max-width: 520px; aspect-ratio: 16/9; background-color: ${colors.background};">
                ${logoHTML}
                <div class="relative z-10 p-8 h-full">
                    <h2 style="${headingStyle} font-size: ${typography.headingSizes.h2 + 2}px; margin-bottom: 20px; border-bottom: 3px solid ${colors.accent}; padding-bottom: 8px;">
                        ${PRESENTATION_SAMPLE_CONTENT.contentSlide.title}
                    </h2>
                    <ul style="${bodyStyle} margin-left: 24px;">
                        ${PRESENTATION_SAMPLE_CONTENT.contentSlide.bullets.map(bullet => `
                            <li style="margin-bottom: 12px; position: relative; padding-left: 8px;">
                                <span style="position: absolute; left: -20px; color: ${colors.accent};">●</span>
                                ${bullet}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update preview with debouncing
 */
let previewDebounceTimer = null;

function updatePreviewDebounced(profile) {
    clearTimeout(previewDebounceTimer);
    previewDebounceTimer = setTimeout(() => {
        renderPreview(profile);
    }, 100);
}

/**
 * Get current preview mode
 */
function getPreviewMode() {
    return currentPreviewMode;
}

/**
 * Set preview mode
 */
function setPreviewMode(mode) {
    if (mode === 'document' || mode === 'presentation') {
        currentPreviewMode = mode;
        const toggleBtn = document.getElementById('preview-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = mode === 'document' ? 'Switch to Presentation' : 'Switch to Document';
        }
    }
}

// Export for use in other modules
window.Preview = {
    initPreview,
    renderPreview,
    togglePreviewMode,
    updatePreviewDebounced,
    getPreviewMode,
    setPreviewMode,
    DOCUMENT_SAMPLE_CONTENT,
    PRESENTATION_SAMPLE_CONTENT
};
