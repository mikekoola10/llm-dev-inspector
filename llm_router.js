// LLM Router Core Module

import { auditLog } from './audit_log.js';
import { callNemotron, callDeepSeek, callOpenAI, callNotebookLLM } from './llm_clients.js';
import { normalizeOutput } from './output_normalizer.js';

// Stub for reading the policy file (in a real extension, this would be loaded from storage/config)
// NOTE: This should be loaded from config/llm-policy.json
// Stub for Nemotron-3's hard override (fail-closed)
const NEMOTRON_OVERRIDE_ENABLED = true;
const POLICY = {
  mode: "normal", // or "nemotron_only"
  allow: ["nemotron", "deepseek", "openai"],
  deny: [],
  reason: ""
};

// Stub for audit logging (in a real extension, this would write to a persistent log)
// function auditLog(entry) { ... } // Now imported from audit_log.js

/**
 * Routes the analysis request to the appropriate LLM authority based on policy and task type.
 * @param {object} request - The analysis request payload.
 * @returns {Promise<object>} - The structured response from the LLM(s).
 */
export async function routeRequest(request) {
    console.log(`Routing request: ${request.taskType} with mode: ${POLICY.mode}`);

    // 1. Policy Check (Nemotron-Only Guard)
    if (POLICY.mode === "nemotron_only" && request.taskType !== "security_audit" && request.taskType !== "core_refactor") {
        auditLog({
            action: "POLICY_BLOCK",
            taskType: request.taskType,
            reason: "Nemotron-only mode active."
        });
        return {
            status: "POLICY_BLOCKED",
            message: "Policy violation: Nemotron-only mode active for critical tasks.",
            arbiter: "Nemotron-3"
        };
    }

    // 2. Routing Logic based on Task Type
    switch (request.taskType) {
        case "security_audit":
        case "core_refactor":
            // High-risk changes require Nemotron-3 + DeepSeek consensus
            return await handleConsensusRequest(request, [callNemotron, callDeepSeek]);

        case "ux_review":
        case "readability_check":
            // Non-critical, use OpenAI
            return await handleSingleModelRequest(request, callOpenAI);

        case "testing_prototype":
            // Local testing, route to Notebook LLMs
            return await handleSingleModelRequest(request, callNotebookLLM);

        case "data_fetch":
            // Data source, route to Chrome DevTools Agent (handled by background script)
            return await handleDevToolsAgentRequest(request);

        default:
            // Default to Nemotron for safety
            return await handleSingleModelRequest(request, callNemotron);
    }
}

/**
 * Handles requests that require consensus between Nemotron-3 and DeepSeek.
 */
async function handleConsensusRequest(request, modelCallers) {
    console.log(`Handling consensus request for models: Nemotron-3 and DeepSeek`);
    
    const [nemotronRaw, deepseekRaw] = await Promise.all([
        modelCallers[0](request), // Nemotron
        modelCallers[1](request)  // DeepSeek
    ]);

    const nemotron = normalizeOutput(nemotronRaw);
    const deepseek = normalizeOutput(deepseekRaw);

    auditLog({
        action: "CONSENSUS_CHECK",
        taskType: request.taskType,
        nemotron_risk: nemotron.riskLevel,
        deepseek_risk: deepseek.riskLevel
    });

    // Consensus Check: Do they agree on the risk level?
    if (nemotron.riskLevel === deepseek.riskLevel && nemotron.riskLevel !== "HIGH") {
        // Consensus reached on LOW/MEDIUM risk. Nemotron is final arbiter for patch.
        // Enforce Nemotron-3 as hard final arbiter (explicit override)
        if (NEMOTRON_OVERRIDE_ENABLED) {
            auditLog({
                action: "NEMOTRON_OVERRIDE",
                taskType: request.taskType,
                reason: "Nemotron-3 patch explicitly chosen as final arbiter."
            });
        }
        return {
            status: "CONSENSUS_REACHED",
            arbiter: "Nemotron-3",
            nemotron: nemotron,
            deepseek: deepseek,
            final_patch: nemotron.safePatch,
            confidence: (nemotron.confidence + deepseek.confidence) / 2
        };
    } else if (nemotron.riskLevel === "HIGH" && deepseek.riskLevel === "HIGH") {
        // Consensus reached on HIGH risk. Requires manual confirmation.
        return {
            status: "HIGH_RISK_CONSENSUS",
            message: "HIGH-risk change confirmed by both Nemotron-3 and DeepSeek. Manual confirmation required.",
            arbiter: "Nemotron-3",
            nemotron: nemotron,
            deepseek: deepseek,
            final_patch: nemotron.safePatch,
            confidence: (nemotron.confidence + deepseek.confidence) / 2
        };
    } else {
        // Disagreement or one suggests HIGH risk. Halt and report.
        // Fail-closed behavior: If there is any disagreement on a high-risk change, or if Nemotron-3 suggests HIGH risk,
        // the system must fail-closed and require manual review.
        if (NEMOTRON_OVERRIDE_ENABLED && nemotron.riskLevel === "HIGH") {
            auditLog({
                action: "FAIL_CLOSED_HIGH_RISK",
                taskType: request.taskType,
                reason: "Nemotron-3 suggested HIGH risk. System failed closed."
            });
            return {
                status: "FAIL_CLOSED_HALTED",
                message: "Nemotron-3 suggested HIGH risk. System failed closed. Manual review required.",
                arbiter: "Nemotron-3",
                nemotron: nemotron,
                deepseek: deepseek,
                confidence: 0.0
            };
        }
        auditLog({
            action: "DISAGREEMENT_HALT",
            taskType: request.taskType,
            nemotron_risk: nemotron.riskLevel,
            deepseek_risk: deepseek.riskLevel
        });
        return {
            status: "DISAGREEMENT_HALTED",
            message: "High-risk change halted due to Nemotron-3 and DeepSeek disagreement. Manual review required.",
            arbiter: "Nemotron-3",
            nemotron: nemotron,
            deepseek: deepseek,
            confidence: 0.0
        };
    }
}

/**
 * Handles requests that only need a single model response.
 */
async function handleSingleModelRequest(request, modelCaller) {
    const rawResponse = await modelCaller(request);
    const normalized = normalizeOutput(rawResponse);

    auditLog({
        action: "SINGLE_MODEL_CALL",
        taskType: request.taskType,
        model: normalized.model,
        risk: normalized.riskLevel
    });

    return {
        status: "SINGLE_MODEL_RESPONSE",
        model: normalized.model,
        response: normalized
    };
}

async function handleDevToolsAgentRequest(request) {
    console.log("Routing to Chrome DevTools Agent (Data Fetch)");
    // This is a placeholder. Actual data fetching is handled by the background script
    // communicating with the content script and DevTools API.
    return {
        status: "DEVICETOOLS_AGENT_STUB",
        message: "Data fetch request sent to inspected page.",
        data_type: request.dataType
    };
}

// --- Demonstration Function ---

/**
 * Simulates a high-risk disagreement scenario and logs the result.
 * This demonstrates the fail-closed arbitration logic.
 */
export async function demonstrateArbitration() {
    console.log("\n--- DEMONSTRATING ARBITRATION (HIGH-RISK DISAGREEMENT) ---");
    
    // Temporarily override client stubs to force a disagreement
    const originalNemotron = callNemotron;
    const originalDeepseek = callDeepseek;

    // Nemotron suggests HIGH risk
    global.callNemotron = async (req) => ({
        model: "Nemotron-3",
        created_at: new Date().toISOString(),
        usage: { prompt_tokens: 100, completion_tokens: 50 },
        content: JSON.stringify({
            issues: ["CRITICAL: XSS vulnerability found."],
            root_cause: ["Improper sanitization."],
            safe_patch: "Nemotron's HIGH-RISK PATCH",
            risk_level: "HIGH",
            confidence_score: 0.99
        })
    });

    // DeepSeek suggests LOW risk
    global.callDeepseek = async (req) => ({
        model: "DeepSeek",
        created_at: new Date().toISOString(),
        usage: { prompt_tokens: 100, completion_tokens: 50 },
        content: JSON.stringify({
            issues: ["Minor: Typo in comment."],
            root_cause: ["Developer error."],
            safe_patch: "DeepSeek's LOW-RISK PATCH",
            risk_level: "LOW",
            confidence_score: 0.80
        })
    });

    const request = { taskType: "security_audit", payload: "..." };
    const result = await handleConsensusRequest(request, [global.callNemotron, global.callDeepseek]);

    console.log("\n--- ARBITRATION RESULT ---");
    console.log("Status:", result.status);
    console.log("Message:", result.message);
    console.log("Nemotron Risk:", result.nemotron.riskLevel);
    console.log("DeepSeek Risk:", result.deepseek.riskLevel);
    
    // Restore original stubs
    global.callNemotron = originalNemotron;
    global.callDeepseek = originalDeepseek;

    return result;
}

async function handleDevToolsAgentRequest(request) {
    console.log("Routing to Chrome DevTools Agent (Data Fetch)");
    // This is a placeholder. Actual data fetching is handled by the background script
    // communicating with the content script and DevTools API.
    return {
        status: "DEVICETOOLS_AGENT_STUB",
        message: "Data fetch request sent to inspected page.",
        data_type: request.dataType
    };
}
