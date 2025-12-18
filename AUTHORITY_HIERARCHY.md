# LLM Dev Inspector: Model Authority Hierarchy

This document defines the strict hierarchy and consensus rules for all Large Language Models (LLMs) integrated into the LLM Dev Inspector. The primary goal is safety, determinism, and architectural integrity.

## Authority Order (Highest to Lowest)

| Rank | Authority | Primary Role | Consensus Rule | Integration |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Nemotron-3** | Deterministic Safety, Architecture, Final Arbitration | **Final Arbiter:** Must agree with DeepSeek on high-risk changes. Nemotron-3's output is prioritized in case of disagreement. | Local / Private Endpoint |
| **2** | **DeepSeek** | Verification, Reasoning, Code Synthesis | **Verification:** Must agree with Nemotron-3 on high-risk changes. Used for general code generation and analysis. | External API |
| **3** | **OpenAI** | UX, Documentation, Developer Ergonomics | **Advisory:** Never final authority. Used for non-critical, user-facing suggestions. | External API |
| **4** | **Notebook LLMs** | Jupyter-based Inspection, Testing, Prototyping | **Testing:** Used for local, isolated testing and inspection tasks. | Local / Jupyter Kernel |
| **5** | **Chrome DevTools Agent** | Frontend/Runtime Inspection, Data Source | **Data Source:** Provides raw data (DOM, Network, Performance) to the LLMs. | Chrome Extension API |

## Consensus and Guardrails

### High-Risk Change Protocol
A "High-Risk Change" is defined as any suggested patch that modifies core application logic, security-sensitive code, or high-traffic components.

1.  **Nemotron-3** and **DeepSeek** must both be consulted.
2.  If both models agree on the patch, it is presented to the user with a **HIGH** confidence score.
3.  If they **disagree**, the process is halted, and the user is presented with the disagreement and a **LOW** confidence score, requiring manual review. **Nemotron-3's reasoning is always surfaced as the primary safety justification.**

### Nemotron-Only Mode
The system can be switched to `nemotron_only` mode via `config/llm-policy.json` for tasks requiring maximum security and determinism (e.g., security audits, core refactors). In this mode, all other LLM calls are blocked.

### Non-Negotiables (Enforced by Router)
*   No autonomous execution.
*   No silent patching.
*   Read-only by default.
*   Consensus required for auto-apply.
*   Model source + confidence always visible.
*   Full audit logging.
