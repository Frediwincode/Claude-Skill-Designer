/**
 * Storage Module - Manages brand profiles in localStorage
 */

const STORAGE_KEY = 'claudeSkillDesigner_profiles';
const ACTIVE_PROFILE_KEY = 'claudeSkillDesigner_activeProfile';
const ONBOARDING_KEY = 'claudeSkillDesigner_onboardingComplete';

/**
 * Generate a unique ID for profiles
 */
function generateId() {
    return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Create a default brand profile structure
 */
function createDefaultProfile(name = 'New Brand') {
    return {
        id: generateId(),
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        colors: {
            primary: '#1a73e8',
            secondary: '#34a853',
            accent: '#ea4335',
            text: '#202124',
            background: '#ffffff'
        },
        typography: {
            headingFont: 'Playfair Display',
            bodyFont: 'Open Sans',
            headingSizes: { h1: 32, h2: 24, h3: 18 },
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
            margins: { top: 1, right: 1, bottom: 1, left: 1 },
            spacing: 'normal'
        }
    };
}

/**
 * Get all profiles from localStorage
 */
function getAllProfiles() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading profiles:', error);
        return [];
    }
}

/**
 * Save all profiles to localStorage
 */
function saveAllProfiles(profiles) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        return true;
    } catch (error) {
        console.error('Error saving profiles:', error);
        return false;
    }
}

/**
 * Get a specific profile by ID
 */
function getProfile(id) {
    const profiles = getAllProfiles();
    return profiles.find(p => p.id === id) || null;
}

/**
 * Save a single profile (create or update)
 */
function saveProfile(profile) {
    const profiles = getAllProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);

    profile.updatedAt = new Date().toISOString();

    if (index >= 0) {
        profiles[index] = profile;
    } else {
        profile.createdAt = new Date().toISOString();
        profiles.push(profile);
    }

    return saveAllProfiles(profiles);
}

/**
 * Delete a profile by ID
 */
function deleteProfile(id) {
    const profiles = getAllProfiles();
    const filtered = profiles.filter(p => p.id !== id);

    // If we deleted the active profile, clear it
    if (getActiveProfileId() === id) {
        setActiveProfileId(filtered.length > 0 ? filtered[0].id : null);
    }

    return saveAllProfiles(filtered);
}

/**
 * Get the active profile ID
 */
function getActiveProfileId() {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

/**
 * Set the active profile ID
 */
function setActiveProfileId(id) {
    if (id) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
}

/**
 * Get the active profile object
 */
function getActiveProfile() {
    const id = getActiveProfileId();
    return id ? getProfile(id) : null;
}

/**
 * Check if onboarding is complete
 */
function isOnboardingComplete() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

/**
 * Mark onboarding as complete
 */
function setOnboardingComplete(complete = true) {
    localStorage.setItem(ONBOARDING_KEY, complete ? 'true' : 'false');
}

/**
 * Export a profile as JSON
 */
function exportProfile(id) {
    const profile = getProfile(id);
    if (!profile) return null;

    return JSON.stringify(profile, null, 2);
}

/**
 * Import a profile from JSON string
 */
function importProfile(jsonString) {
    try {
        const profile = JSON.parse(jsonString);

        // Validate required fields
        if (!profile.name || !profile.colors || !profile.typography) {
            throw new Error('Invalid profile format');
        }

        // Generate new ID to avoid conflicts
        profile.id = generateId();
        profile.createdAt = new Date().toISOString();
        profile.updatedAt = new Date().toISOString();

        // Ensure all required fields exist with defaults
        const defaultProfile = createDefaultProfile();
        const mergedProfile = deepMerge(defaultProfile, profile);
        mergedProfile.id = profile.id;
        mergedProfile.name = profile.name + ' (Imported)';

        saveProfile(mergedProfile);
        return mergedProfile;
    } catch (error) {
        console.error('Error importing profile:', error);
        return null;
    }
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}

/**
 * Duplicate a profile
 */
function duplicateProfile(id) {
    const original = getProfile(id);
    if (!original) return null;

    const duplicate = { ...original };
    duplicate.id = generateId();
    duplicate.name = original.name + ' (Copy)';
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = new Date().toISOString();

    saveProfile(duplicate);
    return duplicate;
}

// Export functions for use in other modules
window.Storage = {
    generateId,
    createDefaultProfile,
    getAllProfiles,
    getProfile,
    saveProfile,
    deleteProfile,
    getActiveProfileId,
    setActiveProfileId,
    getActiveProfile,
    isOnboardingComplete,
    setOnboardingComplete,
    exportProfile,
    importProfile,
    duplicateProfile
};
