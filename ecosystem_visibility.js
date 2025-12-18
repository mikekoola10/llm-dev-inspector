// Ecosystem Visibility Checks Module

// This module checks for the existence of configuration/environment variables
// that would indicate the presence and accessibility of other key components.

const REQUIRED_CONFIG = {
    AGI_Koola10: "AGI_KOOLA10_ENDPOINT",
    Mike_AI: "MIKE_AI_SERVICE_URL",
    Aura_AI: "AURA_AI_CORE_ENDPOINT"
};

/**
 * Checks if a required environment variable is set.
 * NOTE: In a Chrome Extension, this would check chrome.storage or a configuration file.
 * We simulate this by checking a global placeholder object.
 * @param {string} key - The environment variable key.
 * @returns {boolean}
 */
function isConfigSet(key) {
    // STUB: Simulate checking for configuration
    // To demonstrate fail-loudly behavior, we will make one component fail.
    if (key === REQUIRED_CONFIG.Mike_AI) {
        return false; // Simulate Mike_AI being missing/unconfigured
    }
    return true; 
}

/**
 * Checks the visibility of the AGI_Koola10 component.
 * @returns {Promise<boolean>}
 */
export async function checkAGIKoola10Visibility() {
    return isConfigSet(REQUIRED_CONFIG.AGI_Koola10);
}

/**
 * Checks the visibility of the Mike_AI component.
 * @returns {Promise<boolean>}
 */
export async function checkMikeAIVisibility() {
    return isConfigSet(REQUIRED_CONFIG.Mike_AI);
}

/**
 * Checks the visibility of the Aura_AI component.
 * @returns {Promise<boolean>}
 */
export async function checkAuraAIVisibility() {
    return isConfigSet(REQUIRED_CONFIG.Aura_AI);
}

/**
 * Runs all visibility checks and returns a status object.
 * Fails loudly if any required component is missing.
 * @returns {Promise<object>}
 */
export async function runAllVisibilityChecks() {
    const results = {
        AGI_Koola10: await checkAGIKoola10Visibility(),
        Mike_AI: await checkMikeAIVisibility(),
        Aura_AI: await checkAuraAIVisibility()
    };

    const allVisible = Object.values(results).every(v => v === true);

    if (!allVisible) {
        const missing = Object.keys(results).filter(key => results[key] === false);
        const errorMessage = `CRITICAL FAILURE: Ecosystem component(s) missing or unconfigured: ${missing.join(', ')}. LLM Router will be blocked.`;
        console.error(errorMessage);
        throw new Error(errorMessage); // Fail loudly
    }

    return {
        status: "VISIBLE",
        details: results
    };
}

console.log("Ecosystem Visibility Module loaded.");
