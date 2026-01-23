/**
 * Skill Generator Module - Generate Claude skill markdown from brand profiles
 */

const DOCUMENT_TYPES = {
    word: {
        name: 'Microsoft Word',
        icon: '📄',
        description: 'Word documents (.docx)'
    },
    googleDocs: {
        name: 'Google Docs',
        icon: '📝',
        description: 'Google Docs documents'
    },
    powerpoint: {
        name: 'PowerPoint',
        icon: '📊',
        description: 'PowerPoint presentations (.pptx)'
    },
    googleSlides: {
        name: 'Google Slides',
        icon: '🎯',
        description: 'Google Slides presentations'
    }
};

/**
 * Generate a Claude skill for a specific document type
 */
function generateSkill(profile, documentType = 'word') {
    const config = DOCUMENT_TYPES[documentType];
    if (!config) return null;

    const isPresentation = documentType === 'powerpoint' || documentType === 'googleSlides';

    let skill = `# Document Design Skill: ${profile.name}

## Purpose
Apply consistent ${profile.name} branding to all ${isPresentation ? 'presentations' : 'documents'} created in this project. This skill ensures visual consistency and professional appearance across all ${config.name} ${isPresentation ? 'slides' : 'files'}.

---

## Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary** | \`${profile.colors.primary}\` | Headings, key elements, primary buttons |
| **Secondary** | \`${profile.colors.secondary}\` | Subheadings, secondary elements, accents |
| **Accent** | \`${profile.colors.accent}\` | Highlights, call-to-actions, important callouts |
| **Text** | \`${profile.colors.text}\` | Body text, paragraphs, general content |
| **Background** | \`${profile.colors.background}\` | ${isPresentation ? 'Slide' : 'Page'} background color |

---

## Typography

### Heading Font
- **Family**: ${profile.typography.headingFont}
- **Weight**: ${getWeightLabel(profile.typography.headingWeight)}

### Heading Sizes
- **H1 / Title**: ${profile.typography.headingSizes.h1}pt
- **H2 / Section**: ${profile.typography.headingSizes.h2}pt
- **H3 / Subsection**: ${profile.typography.headingSizes.h3}pt

### Body Text
- **Family**: ${profile.typography.bodyFont}
- **Size**: ${profile.typography.bodySize}pt
- **Weight**: ${getWeightLabel(profile.typography.bodyWeight)}
- **Line Height**: ${profile.typography.lineHeight}
${profile.typography.letterSpacing !== 0 ? `- **Letter Spacing**: ${profile.typography.letterSpacing}px` : ''}

---
`;

    // Add logo section if logo is present
    if (profile.logo.data) {
        skill += `
## Logo

- **Position**: ${formatLogoPosition(profile.logo.position)}
- **Size**: ${capitalizeFirst(profile.logo.size)}

When placing the logo:
1. Insert the logo image in the ${formatLogoPosition(profile.logo.position).toLowerCase()}
2. Ensure proper spacing from ${isPresentation ? 'slide' : 'page'} edges (at least 0.5 inches)
3. Maintain aspect ratio when resizing

---
`;
    }

    // Add header/footer section if any values are set
    if (hasHeaderFooterContent(profile.headerFooter)) {
        skill += `
## Header & Footer

`;
        if (profile.headerFooter.companyName) {
            skill += `- **Company Name**: ${profile.headerFooter.companyName}\n`;
        }
        if (profile.headerFooter.tagline) {
            skill += `- **Tagline**: ${profile.headerFooter.tagline}\n`;
        }
        if (profile.headerFooter.contactInfo) {
            skill += `- **Contact Info**: ${profile.headerFooter.contactInfo}\n`;
        }
        if (profile.headerFooter.footerText) {
            skill += `- **Footer Text**: ${profile.headerFooter.footerText}\n`;
        }

        skill += `
Apply these in the ${isPresentation ? 'slide master/template' : 'document header and footer'}. Use the secondary color for header text and a smaller font size (${Math.max(8, profile.typography.bodySize - 4)}pt).

---
`;
    }

    // Add watermark section if enabled
    if (profile.watermark.enabled) {
        skill += `
## Watermark

- **Type**: ${capitalizeFirst(profile.watermark.type)}
- **Content**: ${profile.watermark.type === 'text' ? `"${profile.watermark.content}"` : 'Image watermark'}
- **Opacity**: ${Math.round(profile.watermark.opacity * 100)}%
- **Position**: ${capitalizeFirst(profile.watermark.position)}

Apply as a ${isPresentation ? 'slide background element' : 'page watermark'} with the specified opacity level.

---
`;
    }

    // Add layout section
    skill += `
## Layout

### Margins
- **Top**: ${profile.layout.margins.top} inch
- **Right**: ${profile.layout.margins.right} inch
- **Bottom**: ${profile.layout.margins.bottom} inch
- **Left**: ${profile.layout.margins.left} inch

### Spacing
- **Paragraph Spacing**: ${getSpacingDescription(profile.layout.spacing)}

---
`;

    // Add application instructions based on document type
    skill += generateApplicationInstructions(profile, documentType, isPresentation);

    return skill;
}

/**
 * Generate application instructions for a specific document type
 */
function generateApplicationInstructions(profile, documentType, isPresentation) {
    let instructions = `
## Application Instructions

When creating ${DOCUMENT_TYPES[documentType].name} ${isPresentation ? 'presentations' : 'documents'}:

### Colors
1. Apply **Primary** color (\`${profile.colors.primary}\`) to all main headings (H1)
2. Apply **Secondary** color (\`${profile.colors.secondary}\`) to subheadings (H2, H3)
3. Use **Text** color (\`${profile.colors.text}\`) for all body paragraphs
4. Set ${isPresentation ? 'slide' : 'page'} background to **Background** color (\`${profile.colors.background}\`)
5. Use **Accent** color (\`${profile.colors.accent}\`) sparingly for emphasis and call-outs

### Typography
1. Set heading font to **${profile.typography.headingFont}** with **${getWeightLabel(profile.typography.headingWeight).toLowerCase()}** weight
2. Set body text font to **${profile.typography.bodyFont}** at **${profile.typography.bodySize}pt**
3. Apply the following heading sizes:
   - H1: ${profile.typography.headingSizes.h1}pt
   - H2: ${profile.typography.headingSizes.h2}pt
   - H3: ${profile.typography.headingSizes.h3}pt
4. Set line height to ${profile.typography.lineHeight} for body text

### Structure
`;

    if (isPresentation) {
        instructions += `1. **Title Slide**: Use H1 styling for the main title, centered
2. **Section Slides**: Use H2 for section headers
3. **Content Slides**: Use H3 for slide titles, body text for bullet points
4. Maintain consistent margins of ${profile.layout.margins.left}" on all sides
5. Align content to a consistent grid

### Slide Elements
- Use Primary color for key data points and important numbers
- Apply Accent color to highlight boxes or callout sections
- Keep backgrounds clean using the Background color
- Use Secondary color for supporting text and labels
`;
    } else {
        instructions += `1. **Title Page**: Center the document title using H1 styling
2. **Sections**: Begin each major section with H2 heading
3. **Subsections**: Use H3 for subsection headers
4. **Body**: Apply consistent body text styling throughout
5. Maintain margins as specified in the Layout section

### Document Elements
- **Lists**: Indent by 0.5" with body text styling
- **Tables**: Use Primary color for headers, alternating light backgrounds for rows
- **Quotes**: Indent and use Secondary color for blockquotes
- **Links**: Apply Accent color to hyperlinks
- **Code/Technical**: Use a monospace font at body size
`;
    }

    instructions += `
---

## Quick Reference

\`\`\`
Brand: ${profile.name}
Primary: ${profile.colors.primary}
Secondary: ${profile.colors.secondary}
Accent: ${profile.colors.accent}
Text: ${profile.colors.text}
Background: ${profile.colors.background}
Heading Font: ${profile.typography.headingFont}
Body Font: ${profile.typography.bodyFont}
\`\`\`
`;

    return instructions;
}

/**
 * Generate all skills for a profile
 */
function generateAllSkills(profile) {
    return {
        word: generateSkill(profile, 'word'),
        googleDocs: generateSkill(profile, 'googleDocs'),
        powerpoint: generateSkill(profile, 'powerpoint'),
        googleSlides: generateSkill(profile, 'googleSlides')
    };
}

/**
 * Get weight label from numeric value
 */
function getWeightLabel(weight) {
    const weights = {
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'Semi-Bold',
        700: 'Bold',
        800: 'Extra-Bold'
    };
    return weights[weight] || 'Regular';
}

/**
 * Format logo position for display
 */
function formatLogoPosition(position) {
    const positions = {
        'header-left': 'Header Left',
        'header-center': 'Header Center',
        'header-right': 'Header Right'
    };
    return positions[position] || 'Header Left';
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if header/footer has content
 */
function hasHeaderFooterContent(headerFooter) {
    return headerFooter.companyName || headerFooter.tagline ||
           headerFooter.contactInfo || headerFooter.footerText;
}

/**
 * Get spacing description
 */
function getSpacingDescription(spacing) {
    const descriptions = {
        'compact': 'Compact (6pt after paragraphs)',
        'normal': 'Normal (12pt after paragraphs)',
        'relaxed': 'Relaxed (18pt after paragraphs)'
    };
    return descriptions[spacing] || 'Normal';
}

/**
 * Copy skill to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

/**
 * Download skill as markdown file
 */
function downloadSkill(skill, filename) {
    const blob = new Blob([skill], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate filename for a skill
 */
function generateFilename(profileName, documentType) {
    const safeName = profileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${safeName}-${documentType}-skill.md`;
}

// Export for use in other modules
window.SkillGenerator = {
    generateSkill,
    generateAllSkills,
    copyToClipboard,
    downloadSkill,
    generateFilename,
    DOCUMENT_TYPES
};
