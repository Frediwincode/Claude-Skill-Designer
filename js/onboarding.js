/**
 * Onboarding Module - First-time user wizard
 */

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Claude Skill Designer',
        description: 'Create brand guidelines that generate ready-to-use Claude skills for your documents and presentations.',
        icon: '✨'
    },
    {
        id: 'profile-name',
        title: 'Name Your Brand Profile',
        description: 'Give your first brand profile a name. You can create multiple profiles for different brands or projects.',
        icon: '📝'
    },
    {
        id: 'preset',
        title: 'Choose a Starting Point',
        description: 'Select a preset template or start from scratch. You can customize everything later.',
        icon: '🎨'
    },
    {
        id: 'logo',
        title: 'Add Your Logo (Optional)',
        description: 'Upload your logo to include it in document headers. You can skip this step and add it later.',
        icon: '🖼️'
    },
    {
        id: 'colors',
        title: 'Customize Your Colors',
        description: 'Fine-tune your brand colors. Click any color to open the color picker.',
        icon: '🎯'
    },
    {
        id: 'complete',
        title: 'You\'re All Set!',
        description: 'Your brand profile is ready. Generate a Claude skill to start creating branded documents.',
        icon: '🚀'
    }
];

let currentStep = 0;
let onboardingProfile = null;
let onboardingData = {
    profileName: '',
    selectedPreset: null,
    logoData: null
};

/**
 * Initialize onboarding
 */
function initOnboarding() {
    currentStep = 0;
    onboardingProfile = null;
    onboardingData = {
        profileName: '',
        selectedPreset: null,
        logoData: null
    };
}

/**
 * Check if should show onboarding
 */
function shouldShowOnboarding() {
    return !Storage.isOnboardingComplete() && Storage.getAllProfiles().length === 0;
}

/**
 * Show the onboarding modal
 */
function showOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;

    initOnboarding();
    modal.classList.remove('hidden');
    renderCurrentStep();
}

/**
 * Hide the onboarding modal
 */
function hideOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Skip onboarding completely
 */
function skipOnboarding() {
    Storage.setOnboardingComplete(true);
    hideOnboarding();

    // Create a default profile if none exists
    if (Storage.getAllProfiles().length === 0) {
        const profile = Storage.createDefaultProfile('My Brand');
        Storage.saveProfile(profile);
        Storage.setActiveProfileId(profile.id);
    }

    // Trigger app refresh
    if (window.App && window.App.loadActiveProfile) {
        window.App.loadActiveProfile();
    }
}

/**
 * Go to next step
 */
function nextStep() {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
        // Validate current step before proceeding
        if (!validateCurrentStep()) return;

        currentStep++;
        renderCurrentStep();
    } else {
        completeOnboarding();
    }
}

/**
 * Go to previous step
 */
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderCurrentStep();
    }
}

/**
 * Validate the current step
 */
function validateCurrentStep() {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.id) {
        case 'profile-name':
            const nameInput = document.getElementById('onboarding-profile-name');
            if (!nameInput || !nameInput.value.trim()) {
                nameInput?.classList.add('border-red-500');
                return false;
            }
            onboardingData.profileName = nameInput.value.trim();
            return true;

        default:
            return true;
    }
}

/**
 * Render the current step content
 */
function renderCurrentStep() {
    const step = ONBOARDING_STEPS[currentStep];
    const container = document.getElementById('onboarding-content');
    const progressBar = document.getElementById('onboarding-progress');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');
    const skipBtn = document.getElementById('onboarding-skip');

    if (!container) return;

    // Update progress bar
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // Update buttons
    if (prevBtn) {
        prevBtn.classList.toggle('invisible', currentStep === 0);
    }
    if (nextBtn) {
        nextBtn.textContent = currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next';
    }
    if (skipBtn) {
        skipBtn.classList.toggle('hidden', currentStep === ONBOARDING_STEPS.length - 1);
    }

    // Render step content
    container.innerHTML = `
        <div class="text-center mb-6">
            <div class="text-5xl mb-4">${step.icon}</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">${step.title}</h2>
            <p class="text-gray-600">${step.description}</p>
        </div>
        <div class="mt-6">
            ${renderStepContent(step)}
        </div>
    `;

    // Initialize step-specific functionality
    initStepFunctionality(step);
}

/**
 * Render step-specific content
 */
function renderStepContent(step) {
    switch (step.id) {
        case 'welcome':
            return `
                <div class="bg-gray-50 rounded-lg p-6 text-left">
                    <h3 class="font-semibold text-gray-800 mb-3">What you can create:</h3>
                    <ul class="space-y-2 text-gray-600">
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Word document brand guidelines
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Google Docs styling rules
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            PowerPoint presentation themes
                        </li>
                        <li class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Google Slides design systems
                        </li>
                    </ul>
                </div>
            `;

        case 'profile-name':
            return `
                <div class="max-w-md mx-auto">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Brand Profile Name</label>
                    <input type="text" id="onboarding-profile-name"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Acme Corporation, My Startup"
                        value="${onboardingData.profileName}">
                    <p class="text-sm text-gray-500 mt-2">This name will appear in your generated Claude skills.</p>
                </div>
            `;

        case 'preset':
            const presets = Presets.getAllPresets();
            return `
                <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    ${presets.map(preset => `
                        <button type="button"
                            class="preset-option p-4 border-2 rounded-lg text-left transition-all hover:border-blue-400 ${onboardingData.selectedPreset === preset.id.replace('preset_', '') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                            data-preset="${preset.id.replace('preset_', '')}">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="flex gap-1">
                                    ${Object.values(preset.colors).slice(0, 3).map(color => `
                                        <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
                                    `).join('')}
                                </div>
                                <span class="font-semibold text-gray-800">${preset.name}</span>
                            </div>
                            <p class="text-sm text-gray-600">${preset.description}</p>
                        </button>
                    `).join('')}
                    <button type="button"
                        class="preset-option p-4 border-2 rounded-lg text-left transition-all hover:border-blue-400 ${onboardingData.selectedPreset === 'blank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                        data-preset="blank">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-4 h-4 rounded-full border-2 border-dashed border-gray-400"></div>
                            <span class="font-semibold text-gray-800">Start Blank</span>
                        </div>
                        <p class="text-sm text-gray-600">Begin with default settings and customize from scratch</p>
                    </button>
                </div>
            `;

        case 'logo':
            return `
                <div class="max-w-md mx-auto">
                    <div id="onboarding-logo-preview" class="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        ${onboardingData.logoData
                            ? `<img src="${onboardingData.logoData}" class="max-w-full max-h-full object-contain">`
                            : `<span class="text-gray-400 text-sm">No logo</span>`
                        }
                    </div>
                    <label class="block">
                        <span class="sr-only">Choose logo file</span>
                        <input type="file" id="onboarding-logo-input" accept="image/png,image/jpeg,image/jpg"
                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
                    </label>
                    <p class="text-sm text-gray-500 mt-2 text-center">PNG or JPG, max 2MB</p>
                </div>
            `;

        case 'colors':
            // Create profile if not already created
            if (!onboardingProfile) {
                if (onboardingData.selectedPreset && onboardingData.selectedPreset !== 'blank') {
                    onboardingProfile = Presets.createProfileFromPreset(onboardingData.selectedPreset, onboardingData.profileName);
                } else {
                    onboardingProfile = Storage.createDefaultProfile(onboardingData.profileName);
                }
                if (onboardingData.logoData) {
                    onboardingProfile.logo.data = onboardingData.logoData;
                }
            }

            const colors = onboardingProfile.colors;
            return `
                <div class="grid grid-cols-5 gap-4 max-w-lg mx-auto">
                    ${Object.entries(colors).map(([key, value]) => `
                        <div class="text-center">
                            <div class="onboarding-color-picker w-12 h-12 mx-auto rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-colors"
                                style="background-color: ${value}"
                                data-color-key="${key}"
                                data-color-value="${value}">
                            </div>
                            <span class="text-xs text-gray-600 mt-1 block capitalize">${key}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="text-sm text-gray-500 mt-4 text-center">Click any color to customize it</p>
            `;

        case 'complete':
            return `
                <div class="bg-green-50 rounded-lg p-6 text-center">
                    <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="font-semibold text-gray-800 mb-2">Profile "${onboardingData.profileName}" Created</h3>
                    <p class="text-gray-600">Head to the Generate tab to create your first Claude skill!</p>
                </div>
            `;

        default:
            return '';
    }
}

/**
 * Initialize step-specific functionality
 */
function initStepFunctionality(step) {
    switch (step.id) {
        case 'profile-name':
            const nameInput = document.getElementById('onboarding-profile-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.addEventListener('input', () => {
                    nameInput.classList.remove('border-red-500');
                });
                nameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') nextStep();
                });
            }
            break;

        case 'preset':
            document.querySelectorAll('.preset-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.preset-option').forEach(b => {
                        b.classList.remove('border-blue-500', 'bg-blue-50');
                        b.classList.add('border-gray-200');
                    });
                    btn.classList.add('border-blue-500', 'bg-blue-50');
                    btn.classList.remove('border-gray-200');
                    onboardingData.selectedPreset = btn.dataset.preset;
                });
            });
            break;

        case 'logo':
            const logoInput = document.getElementById('onboarding-logo-input');
            if (logoInput) {
                logoInput.addEventListener('change', handleLogoUpload);
            }
            break;

        case 'colors':
            initOnboardingColorPickers();
            break;
    }
}

/**
 * Handle logo upload in onboarding
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
        onboardingData.logoData = e.target.result;
        const preview = document.getElementById('onboarding-logo-preview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" class="max-w-full max-h-full object-contain">`;
        }
        if (onboardingProfile) {
            onboardingProfile.logo.data = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Initialize color pickers in onboarding
 */
function initOnboardingColorPickers() {
    document.querySelectorAll('.onboarding-color-picker').forEach(el => {
        el.addEventListener('click', () => {
            const key = el.dataset.colorKey;
            const currentValue = el.dataset.colorValue;

            // Create a temporary color input
            const input = document.createElement('input');
            input.type = 'color';
            input.value = currentValue;
            input.style.position = 'absolute';
            input.style.opacity = '0';
            document.body.appendChild(input);

            input.addEventListener('input', (e) => {
                const newColor = e.target.value;
                el.style.backgroundColor = newColor;
                el.dataset.colorValue = newColor;
                if (onboardingProfile) {
                    onboardingProfile.colors[key] = newColor;
                }
            });

            input.addEventListener('change', () => {
                document.body.removeChild(input);
            });

            input.click();
        });
    });
}

/**
 * Complete the onboarding process
 */
function completeOnboarding() {
    // Save the profile
    if (onboardingProfile) {
        Storage.saveProfile(onboardingProfile);
        Storage.setActiveProfileId(onboardingProfile.id);
    }

    Storage.setOnboardingComplete(true);
    hideOnboarding();

    // Trigger app refresh
    if (window.App && window.App.loadActiveProfile) {
        window.App.loadActiveProfile();
    }
}

// Export for use in other modules
window.Onboarding = {
    shouldShowOnboarding,
    showOnboarding,
    hideOnboarding,
    skipOnboarding,
    nextStep,
    prevStep,
    ONBOARDING_STEPS
};
