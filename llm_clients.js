// LLM API Client Module

// Configuration based on environment variables (stubs for Chrome Extension environment)
const CONFIG = {
    NEMOTRON_ENDPOINT: "http://127.0.0.1:8000/v1/completions",
    DEEPSEEK_API_KEY: "YOUR_DEEPSEEK_API_KEY", // Placeholder
    OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",     // Placeholder
    // NOTE: In a real extension, these keys would be managed securely (e.g., via a backend service)
};

/**
 * Base function to simulate an API call to an LLM.
 * @param {string} endpoint - The API endpoint URL.
 * @param {string} apiKey - The API key for authorization.
 * @param {object} payload - The request payload.
 * @returns {Promise<object>} - The raw LLM response.
 */
async function callLLM(endpoint, apiKey, payload) {
    console.log(`Calling LLM at: ${endpoint}`);
    // In a real extension, this would be a fetch() call to the endpoint.
    // For now, we return a structured stub that the normalizer can process.
    
    const modelName = endpoint.includes("nemotron") ? "Nemotron-3" : (apiKey === CONFIG.DEEPSEEK_API_KEY ? "DeepSeek" : "OpenAI");

    // Simulate a structured JSON response from the LLM
    const rawResponse = {
        model: modelName,
        created_at: new Date().toISOString(),
        usage: { prompt_tokens: 100, completion_tokens: 50 },
        // The actual content is a JSON string that needs to be parsed
        content: JSON.stringify({
            issues: [`Simulated issue from ${modelName}`],
            root_cause: [`Simulated root cause from ${modelName}`],
            safe_patch: `\`\`\`diff\n+ // Simulated patch from ${modelName}\n\`\`\``,
            risk_level: modelName === "Nemotron-3" ? "HIGH" : "LOW",
            confidence_score: modelName === "Nemotron-3" ? 0.99 : 0.85
        })
    };

    return rawResponse;
}

/**
 * Calls the local Nemotron-3 endpoint.
 * @param {object} requestPayload - The analysis request.
 * @returns {Promise<object>} - The raw Nemotron-3 response.
 */
export async function callNemotron(requestPayload) {
    // Nemotron-3 is the primary authority, using the local endpoint
    return callLLM(CONFIG.NEMOTRON_ENDPOINT, null, requestPayload);
}

/**
 * Calls the DeepSeek API.
 * @param {object} requestPayload - The analysis request.
 * @returns {Promise<object>} - The raw DeepSeek response.
 */
export async function callDeepSeek(requestPayload) {
    // DeepSeek is the secondary reasoning authority
    return callLLM("https://api.deepseek.com/v1/chat/completions", CONFIG.DEEPSEEK_API_KEY, requestPayload);
}

/**
 * Calls the OpenAI API.
 * @param {object} requestPayload - The analysis request.
 * @returns {Promise<object>} - The raw OpenAI response.
 */
export async function callOpenAI(requestPayload) {
    // OpenAI is for UX/readability
    return callLLM("https://api.openai.com/v1/chat/completions", CONFIG.OPENAI_API_KEY, requestPayload);
}

// Stub for Notebook LLM (local execution)
export async function callNotebookLLM(requestPayload) {
    console.log("Simulating Notebook LLM execution...");
    return {
        model: "Notebook LLM",
        content: JSON.stringify({
            issues: ["Local test environment issue."],
            root_cause: ["Test failed in isolated environment."],
            safe_patch: "N/A",
            risk_level: "LOW",
            confidence_score: 0.70
        })
    };
}
