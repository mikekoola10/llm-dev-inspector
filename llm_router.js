// LLM Router Core Module

// Stub for reading the policy file (in a real extension, this would be loaded from storage/config)
const POLICY = {
  mode: "normal", // or "nemotron_only"
  allow: ["nemotron", "deepseek", "openai"],
  deny: [],
  reason: ""
};

// Stub for the Nemotron-3 endpoint
const NEMOTRON_ENDPOINT = "http://127.0.0.1:8000/v1/completions";

/**
 * Routes the analysis request to the appropriate LLM authority based on policy and task type.
 * @param {object} request - The analysis request payload.
 * @returns {Promise<object>} - The structured response from the LLM(s).
 */
export async function routeRequest(request) {
    console.log(`Routing request: ${request.taskType} with mode: ${POLICY.mode}`);

    // 1. Policy Check (Nemotron-Only Guard)
    if (POLICY.mode === "nemotron_only" && request.taskType !== "security_audit" && request.taskType !== "core_refactor") {
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
            return await handleConsensusRequest(request, ["nemotron", "deepseek"]);

        case "ux_review":
        case "readability_check":
            // Non-critical, use OpenAI (stubbed as DeepSeek for now)
            return await handleSingleModelRequest(request, "deepseek");

        case "testing_prototype":
            // Local testing, route to Notebook LLMs (stubbed as a local process)
            return await handleNotebookLLMRequest(request);

        case "data_fetch":
            // Data source, route to Chrome DevTools Agent (handled by background script)
            return await handleDevToolsAgentRequest(request);

        default:
            return await handleSingleModelRequest(request, "nemotron");
    }
}

/**
 * Handles requests that require consensus between Nemotron-3 and DeepSeek.
 */
async function handleConsensusRequest(request, models) {
    console.log(`Handling consensus request for models: ${models.join(', ')}`);
    
    // STUB: Simulate parallel calls and a consensus check
    const nemotronResponse = await callNemotron(request);
    const deepseekResponse = await callDeepSeek(request);

    // STUB: Simple consensus check
    if (nemotronResponse.riskLevel === deepseekResponse.riskLevel) {
        return {
            status: "CONSENSUS_REACHED",
            arbiter: "Nemotron-3",
            nemotron: nemotronResponse,
            deepseek: deepseekResponse,
            final_patch: nemotronResponse.safePatch // Nemotron is final arbiter
        };
    } else {
        return {
            status: "DISAGREEMENT_HALTED",
            message: "High-risk change halted due to Nemotron-3 and DeepSeek disagreement. Manual review required.",
            arbiter: "Nemotron-3",
            nemotron: nemotronResponse,
            deepseek: deepseekResponse
        };
    }
}

/**
 * Handles requests that only need a single model response.
 */
async function handleSingleModelRequest(request, model) {
    console.log(`Handling single model request for: ${model}`);
    
    let response;
    switch (model) {
        case "nemotron":
            response = await callNemotron(request);
            break;
        case "deepseek":
        case "openai": // Stubbing OpenAI call via DeepSeek logic for now
            response = await callDeepSeek(request);
            break;
        default:
            response = { status: "ERROR", message: "Invalid model specified." };
    }

    return {
        status: "SINGLE_MODEL_RESPONSE",
        model: model,
        response: response
    };
}

// --- Authority Call Stubs ---

async function callNemotron(request) {
    console.log(`Calling Nemotron-3 at ${NEMOTRON_ENDPOINT}`);
    // STUB: Simulate a call to the local Nemotron-3 endpoint
    return {
        issues: ["Security vulnerability in XSS filter."],
        rootCause: ["Improper sanitization of user input in component Y."],
        safePatch: "```diff\n+ function sanitize(input) { return DOMPurify.sanitize(input); }\n```",
        riskLevel: "HIGH",
        confidence: 0.95
    };
}

async function callDeepSeek(request) {
    console.log("Calling DeepSeek API");
    // STUB: Simulate a call to the DeepSeek API
    return {
        issues: ["Code is not idiomatic JavaScript."],
        rootCause: ["Developer used old-style 'var' instead of 'const/let'."],
        safePatch: "```diff\n- var i = 0;\n+ let i = 0;\n```",
        riskLevel: "LOW",
        confidence: 0.80
    };
}

async function handleNotebookLLMRequest(request) {
    console.log("Routing to Notebook LLMs (Local Process Stub)");
    // STUB: Simulate a local Jupyter/Notebook LLM process
    return {
        status: "NOTEBOOK_LLM_STUB",
        message: "Analysis queued for local Jupyter environment.",
        result: {
            test_pass: true,
            notebook_link: "file:///path/to/test.ipynb"
        }
    };
}

async function handleDevToolsAgentRequest(request) {
    console.log("Routing to Chrome DevTools Agent (Data Fetch)");
    // STUB: This request is typically handled by the background script messaging the content script
    return {
        status: "DEVICETOOLS_AGENT_STUB",
        message: "Data fetch request sent to inspected page.",
        data_type: request.dataType
    };
}
