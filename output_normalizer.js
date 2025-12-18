// LLM Output Normalizer Module

/**
 * Parses the raw LLM response and normalizes it into the required structured format.
 * @param {object} rawResponse - The raw response object from the LLM client.
 * @returns {object} - The normalized structured output.
 */
export function normalizeOutput(rawResponse) {
    let parsedContent;
    try {
        // The content is expected to be a JSON string
        parsedContent = JSON.parse(rawResponse.content);
    } catch (e) {
        console.error("Failed to parse LLM content as JSON:", e);
        // Return a safe, error-based structure
        return {
            model: rawResponse.model,
            issues: ["ERROR: Failed to parse structured output from model."],
            rootCause: ["Model returned non-JSON or invalid JSON content."],
            safePatch: "N/A",
            riskLevel: "HIGH",
            confidence: 0.0,
            raw: rawResponse
        };
    }

    // Ensure all required fields are present, using defaults if missing
    const normalized = {
        model: rawResponse.model,
        issues: parsedContent.issues || ["No issues reported."],
        rootCause: parsedContent.root_cause || ["No root cause identified."],
        safePatch: parsedContent.safe_patch || "N/A",
        riskLevel: (parsedContent.risk_level || "UNKNOWN").toUpperCase(),
        confidence: parsedContent.confidence_score || 0.0,
        // Add audit-relevant fields
        timestamp: rawResponse.created_at,
        usage: rawResponse.usage,
        raw: rawResponse
    };

    // Simple validation for risk level
    if (!["LOW", "MEDIUM", "HIGH", "UNKNOWN"].includes(normalized.riskLevel)) {
        normalized.riskLevel = "UNKNOWN";
    }

    return normalized;
}
