/**
 * Main Application Controller
 * Coordinates all modules and handles UI interactions
 */

// Current state
let currentProfile = null;
let currentTab = 'design';
let selectedDocumentType = 'word';

/**
 * Initialize the application
 */
function initApp() {
    // Check for onboarding
    if (Onboarding.shouldShowOnboarding()) {
        Onboarding.showOnboarding();
    } else {
        loadActiveProfile();
    }

    // Initialize UI components
    initTabs();
    initProfileSelector();
    initColorPickers();
    initTypographyControls();
    initLogoUpload();
    initHeaderFooterFields();
    initWatermarkControls();
    initLayoutControls();
    initTemplateUpload();
    initSkillGeneration();
    initPresetButtons();
    initExportImport();

    // Initialize preview
    Preview.initPreview();

    // Set up auto-save
    setupAutoSave();
}

/**
 * Load the active profile or create default
 */
function loadActiveProfile() {
    let profile = Storage.getActiveProfile();

    if (!profile) {
        const profiles = Storage.getAllProfiles();
        if (profiles.length > 0) {
            profile = profiles[0];
            Storage.setActiveProfileId(profile.id);
        } else {
            // Create a default profile
            profile = Storage.createDefaultProfile('My Brand');
            Storage.saveProfile(profile);
            Storage.setActiveProfileId(profile.id);
        }
    }

    setCurrentProfile(profile);
    updateProfileSelector();
}

/**
 * Set the current profile and update UI
 */
function setCurrentProfile(profile) {
    currentProfile = profile;

    // Update all UI components
    ColorPicker.setAllColors(profile.colors);
    Typography.setTypographyValues(profile.typography);
    updateLogoUI(profile.logo);
    updateHeaderFooterUI(profile.headerFooter);
    updateWatermarkUI(profile.watermark);
    updateLayoutUI(profile.layout);

    // Update preview
    Preview.renderPreview(profile);

    // Update profile name in header
    const nameDisplay = document.getElementById('profile-name-display');
    if (nameDisplay) {
        nameDisplay.textContent = profile.name;
    }
}

/**
 * Initialize tab navigation
 */
function initTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });
}

/**
 * Switch to a different tab
 */
function switchTab(tabId) {
    currentTab = tabId;

    // Update tab buttons
    document.querySelectorAll('[data-tab]').forEach(tab => {
        const isActive = tab.dataset.tab === tabId;
        tab.classList.toggle('border-blue-500', isActive);
        tab.classList.toggle('text-blue-600', isActive);
        tab.classList.toggle('border-transparent', !isActive);
        tab.classList.toggle('text-gray-500', !isActive);
    });

    // Update tab panels
    document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.tabPanel !== tabId);
    });

    // Refresh preview when switching to preview tab
    if (tabId === 'preview' && currentProfile) {
        Preview.renderPreview(currentProfile);
    }

    // Refresh skill output when switching to generate tab
    if (tabId === 'generate' && currentProfile) {
        updateSkillOutput();
    }
}

/**
 * Initialize profile selector dropdown
 */
function initProfileSelector() {
    const selector = document.getElementById('profile-selector');
    const newBtn = document.getElementById('new-profile-btn');
    const deleteBtn = document.getElementById('delete-profile-btn');
    const renameBtn = document.getElementById('rename-profile-btn');

    if (selector) {
        selector.addEventListener('change', () => {
            const profile = Storage.getProfile(selector.value);
            if (profile) {
                Storage.setActiveProfileId(profile.id);
                setCurrentProfile(profile);
            }
        });
    }

    if (newBtn) {
        newBtn.addEventListener('click', createNewProfile);
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteCurrentProfile);
    }

    if (renameBtn) {
        renameBtn.addEventListener('click', renameCurrentProfile);
    }
}

/**
 * Update the profile selector dropdown
 */
function updateProfileSelector() {
    const selector = document.getElementById('profile-selector');
    if (!selector) return;

    const profiles = Storage.getAllProfiles();
    const activeId = Storage.getActiveProfileId();

    selector.innerHTML = profiles.map(p => `
        <option value="${p.id}" ${p.id === activeId ? 'selected' : ''}>${p.name}</option>
    `).join('');
}

/**
 * Create a new profile
 */
function createNewProfile() {
    const name = prompt('Enter a name for the new profile:');
    if (!name) return;

    const profile = Storage.createDefaultProfile(name);
    Storage.saveProfile(profile);
    Storage.setActiveProfileId(profile.id);
    setCurrentProfile(profile);
    updateProfileSelector();
}

/**
 * Delete the current profile
 */
function deleteCurrentProfile() {
    if (!currentProfile) return;

    const profiles = Storage.getAllProfiles();
    if (profiles.length <= 1) {
        alert('Cannot delete the only profile. Create another profile first.');
        return;
    }

    if (confirm(`Are you sure you want to delete "${currentProfile.name}"?`)) {
        Storage.deleteProfile(currentProfile.id);
        loadActiveProfile();
        updateProfileSelector();
    }
}

/**
 * Rename the current profile
 */
function renameCurrentProfile() {
    if (!currentProfile) return;

    const newName = prompt('Enter new name:', currentProfile.name);
    if (!newName || newName === currentProfile.name) return;

    currentProfile.name = newName;
    Storage.saveProfile(currentProfile);
    updateProfileSelector();

    const nameDisplay = document.getElementById('profile-name-display');
    if (nameDisplay) {
        nameDisplay.textContent = newName;
    }
}

/**
 * Initialize color pickers
 */
function initColorPickers() {
    ColorPicker.initColorPickers((colorKey, value) => {
        if (currentProfile) {
            currentProfile.colors[colorKey] = value;
            saveCurrentProfile();
            Preview.updatePreviewDebounced(currentProfile);
        }
    });
}

/**
 * Initialize typography controls
 */
function initTypographyControls() {
    Typography.initTypographyControls((key, value) => {
        if (currentProfile) {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                currentProfile.typography[parent][child] = value;
            } else {
                currentProfile.typography[key] = value;
            }
            saveCurrentProfile();
            Preview.updatePreviewDebounced(currentProfile);
        }
    });
}

/**
 * Initialize logo upload
 */
function initLogoUpload() {
    const input = document.getElementById('logo-upload');
    const removeBtn = document.getElementById('remove-logo');
    const positionSelect = document.getElementById('logo-position');
    const sizeSelect = document.getElementById('logo-size');

    if (input) {
        input.addEventListener('change', handleLogoUpload);
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', removeLogo);
    }

    if (positionSelect) {
        positionSelect.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.logo.position = positionSelect.value;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }

    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.logo.size = sizeSelect.value;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }
}

/**
 * Handle logo file upload
 */
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Logo file must be less than 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (currentProfile) {
            currentProfile.logo.data = e.target.result;
            currentProfile.logo.filename = file.name;
            saveCurrentProfile();
            updateLogoUI(currentProfile.logo);
            Preview.updatePreviewDebounced(currentProfile);
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Remove logo
 */
function removeLogo() {
    if (currentProfile) {
        currentProfile.logo.data = null;
        currentProfile.logo.filename = null;
        saveCurrentProfile();
        updateLogoUI(currentProfile.logo);
        Preview.updatePreviewDebounced(currentProfile);
    }
}

/**
 * Update logo UI
 */
function updateLogoUI(logo) {
    const preview = document.getElementById('logo-preview');
    const removeBtn = document.getElementById('remove-logo');
    const positionSelect = document.getElementById('logo-position');
    const sizeSelect = document.getElementById('logo-size');

    if (preview) {
        if (logo.data) {
            preview.innerHTML = `<img src="${logo.data}" class="max-w-full max-h-full object-contain" alt="Logo">`;
        } else {
            preview.innerHTML = '<span class="text-gray-400 text-sm">No logo uploaded</span>';
        }
    }

    if (removeBtn) {
        removeBtn.classList.toggle('hidden', !logo.data);
    }

    if (positionSelect) {
        positionSelect.value = logo.position;
    }

    if (sizeSelect) {
        sizeSelect.value = logo.size;
    }
}

/**
 * Initialize header/footer fields
 */
function initHeaderFooterFields() {
    const fields = ['company-name', 'tagline', 'contact-info', 'footer-text'];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener('input', () => {
            if (currentProfile) {
                const key = fieldId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                currentProfile.headerFooter[key] = input.value;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    });
}

/**
 * Update header/footer UI
 */
function updateHeaderFooterUI(headerFooter) {
    document.getElementById('company-name')?.setAttribute('value', headerFooter.companyName || '');
    document.getElementById('tagline')?.setAttribute('value', headerFooter.tagline || '');
    document.getElementById('contact-info')?.setAttribute('value', headerFooter.contactInfo || '');
    document.getElementById('footer-text')?.setAttribute('value', headerFooter.footerText || '');

    // Set values directly as well
    const companyName = document.getElementById('company-name');
    const tagline = document.getElementById('tagline');
    const contactInfo = document.getElementById('contact-info');
    const footerText = document.getElementById('footer-text');

    if (companyName) companyName.value = headerFooter.companyName || '';
    if (tagline) tagline.value = headerFooter.tagline || '';
    if (contactInfo) contactInfo.value = headerFooter.contactInfo || '';
    if (footerText) footerText.value = headerFooter.footerText || '';
}

/**
 * Initialize watermark controls
 */
function initWatermarkControls() {
    const toggle = document.getElementById('watermark-enabled');
    const typeSelect = document.getElementById('watermark-type');
    const contentInput = document.getElementById('watermark-content');
    const opacitySlider = document.getElementById('watermark-opacity');
    const positionSelect = document.getElementById('watermark-position');

    if (toggle) {
        toggle.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.watermark.enabled = toggle.checked;
                saveCurrentProfile();
                updateWatermarkFieldsVisibility(toggle.checked);
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.watermark.type = typeSelect.value;
                saveCurrentProfile();
            }
        });
    }

    if (contentInput) {
        contentInput.addEventListener('input', () => {
            if (currentProfile) {
                currentProfile.watermark.content = contentInput.value;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }

    if (opacitySlider) {
        opacitySlider.addEventListener('input', () => {
            if (currentProfile) {
                currentProfile.watermark.opacity = parseFloat(opacitySlider.value);
                saveCurrentProfile();
                updateOpacityDisplay(opacitySlider.value);
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }

    if (positionSelect) {
        positionSelect.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.watermark.position = positionSelect.value;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    }
}

/**
 * Update watermark fields visibility
 */
function updateWatermarkFieldsVisibility(enabled) {
    const fields = document.getElementById('watermark-fields');
    if (fields) {
        fields.classList.toggle('hidden', !enabled);
    }
}

/**
 * Update opacity display
 */
function updateOpacityDisplay(value) {
    const display = document.getElementById('opacity-display');
    if (display) {
        display.textContent = Math.round(value * 100) + '%';
    }
}

/**
 * Update watermark UI
 */
function updateWatermarkUI(watermark) {
    const toggle = document.getElementById('watermark-enabled');
    const typeSelect = document.getElementById('watermark-type');
    const contentInput = document.getElementById('watermark-content');
    const opacitySlider = document.getElementById('watermark-opacity');
    const positionSelect = document.getElementById('watermark-position');

    if (toggle) toggle.checked = watermark.enabled;
    if (typeSelect) typeSelect.value = watermark.type;
    if (contentInput) contentInput.value = watermark.content || '';
    if (opacitySlider) opacitySlider.value = watermark.opacity;
    if (positionSelect) positionSelect.value = watermark.position;

    updateWatermarkFieldsVisibility(watermark.enabled);
    updateOpacityDisplay(watermark.opacity);
}

/**
 * Initialize layout controls
 */
function initLayoutControls() {
    const marginInputs = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
    const spacingSelect = document.getElementById('spacing');

    marginInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', () => {
            if (currentProfile) {
                const side = inputId.replace('margin-', '');
                currentProfile.layout.margins[side] = parseFloat(input.value) || 1;
                saveCurrentProfile();
                Preview.updatePreviewDebounced(currentProfile);
            }
        });
    });

    if (spacingSelect) {
        spacingSelect.addEventListener('change', () => {
            if (currentProfile) {
                currentProfile.layout.spacing = spacingSelect.value;
                saveCurrentProfile();
            }
        });
    }
}

/**
 * Update layout UI
 */
function updateLayoutUI(layout) {
    document.getElementById('margin-top')?.setAttribute('value', layout.margins.top);
    document.getElementById('margin-right')?.setAttribute('value', layout.margins.right);
    document.getElementById('margin-bottom')?.setAttribute('value', layout.margins.bottom);
    document.getElementById('margin-left')?.setAttribute('value', layout.margins.left);

    const marginTop = document.getElementById('margin-top');
    const marginRight = document.getElementById('margin-right');
    const marginBottom = document.getElementById('margin-bottom');
    const marginLeft = document.getElementById('margin-left');
    const spacing = document.getElementById('spacing');

    if (marginTop) marginTop.value = layout.margins.top;
    if (marginRight) marginRight.value = layout.margins.right;
    if (marginBottom) marginBottom.value = layout.margins.bottom;
    if (marginLeft) marginLeft.value = layout.margins.left;
    if (spacing) spacing.value = layout.spacing;
}

/**
 * Initialize template upload
 */
function initTemplateUpload() {
    const input = document.getElementById('template-upload');
    if (!input) return;

    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!TemplateParser.isValidDocxFile(file)) {
            alert('Please upload a valid Word document (.docx)');
            return;
        }

        const statusEl = document.getElementById('template-status');
        if (statusEl) {
            statusEl.textContent = 'Analyzing document...';
            statusEl.classList.remove('hidden');
        }

        try {
            const extracted = await TemplateParser.parseWordDocument(file);
            const summary = TemplateParser.getExtractionSummary(extracted);

            if (currentProfile) {
                const updatedProfile = TemplateParser.applyExtractedStyles(currentProfile, extracted);
                Object.assign(currentProfile, updatedProfile);
                saveCurrentProfile();
                setCurrentProfile(currentProfile);
            }

            if (statusEl) {
                statusEl.textContent = 'Extracted: ' + summary.join(', ');
                statusEl.classList.add('text-green-600');
            }
        } catch (error) {
            console.error('Template parsing error:', error);
            if (statusEl) {
                statusEl.textContent = 'Error parsing document';
                statusEl.classList.add('text-red-600');
            }
        }
    });
}

/**
 * Initialize skill generation
 */
function initSkillGeneration() {
    const typeButtons = document.querySelectorAll('[data-doc-type]');
    const copyBtn = document.getElementById('copy-skill');
    const downloadBtn = document.getElementById('download-skill');

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDocumentType = btn.dataset.docType;
            updateDocTypeButtons();
            updateSkillOutput();
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            if (!currentProfile) return;
            const skill = SkillGenerator.generateSkill(currentProfile, selectedDocumentType);
            const success = await SkillGenerator.copyToClipboard(skill);
            if (success) {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!currentProfile) return;
            const skill = SkillGenerator.generateSkill(currentProfile, selectedDocumentType);
            const filename = SkillGenerator.generateFilename(currentProfile.name, selectedDocumentType);
            SkillGenerator.downloadSkill(skill, filename);
        });
    }
}

/**
 * Update document type buttons
 */
function updateDocTypeButtons() {
    document.querySelectorAll('[data-doc-type]').forEach(btn => {
        const isActive = btn.dataset.docType === selectedDocumentType;
        btn.classList.toggle('bg-blue-500', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-100', !isActive);
        btn.classList.toggle('text-gray-700', !isActive);
    });
}

/**
 * Update skill output display
 */
function updateSkillOutput() {
    const output = document.getElementById('skill-output');
    if (!output || !currentProfile) return;

    const skill = SkillGenerator.generateSkill(currentProfile, selectedDocumentType);
    output.textContent = skill;
}

/**
 * Initialize preset buttons
 */
function initPresetButtons() {
    document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.dataset.preset;
            applyPreset(presetKey);
        });
    });
}

/**
 * Apply a preset to the current profile
 */
function applyPreset(presetKey) {
    if (!currentProfile) return;

    const preset = Presets.getPreset(presetKey);
    if (!preset) return;

    // Apply preset values to current profile
    currentProfile.colors = { ...preset.colors };
    currentProfile.typography = {
        ...preset.typography,
        headingSizes: { ...preset.typography.headingSizes }
    };

    saveCurrentProfile();
    setCurrentProfile(currentProfile);
}

/**
 * Initialize export/import functionality
 */
function initExportImport() {
    const exportBtn = document.getElementById('export-profile');
    const importBtn = document.getElementById('import-profile');
    const importInput = document.getElementById('import-input');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (!currentProfile) return;
            const json = Storage.exportProfile(currentProfile.id);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentProfile.name.toLowerCase().replace(/\s+/g, '-')}-profile.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const imported = Storage.importProfile(e.target.result);
                if (imported) {
                    Storage.setActiveProfileId(imported.id);
                    setCurrentProfile(imported);
                    updateProfileSelector();
                    alert('Profile imported successfully!');
                } else {
                    alert('Failed to import profile. Invalid file format.');
                }
            };
            reader.readAsText(file);
        });
    }
}

/**
 * Save current profile with debounce
 */
let saveDebounceTimer = null;

function saveCurrentProfile() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
        if (currentProfile) {
            Storage.saveProfile(currentProfile);
        }
    }, 300);
}

/**
 * Setup auto-save functionality
 */
function setupAutoSave() {
    // Already handled by saveCurrentProfile debounce
}

// Export app functions
window.App = {
    initApp,
    loadActiveProfile,
    setCurrentProfile,
    switchTab,
    currentProfile: null
};

// Update currentProfile getter
Object.defineProperty(window.App, 'currentProfile', {
    get: () => currentProfile
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
