# LLM Dev Inspector: High-Level Architecture

The LLM Dev Inspector is a Chrome DevTools extension designed to provide AI-generated insights and safe patch diffs for web development. It operates with a strict safety-first, diff-first, and no-chat-UI philosophy.

## Components

### 1. Chrome Extension (Frontend)
This component handles the user interface and interaction within the Chrome DevTools panel.
*   **DevTools Panel:** The main UI for displaying insights, diffs, and model confidence scores.
*   **Background Script:** Manages communication between the DevTools Panel and the LLM Router Service. Handles extension lifecycle events.
*   **Content Script (Stub):** A minimal script to inject into the inspected page to facilitate DOM/Network inspection requests.

### 2. LLM Router Service (Backend)
This is the core logic for managing LLM calls, consensus, and arbitration. It is designed to be a local service (e.g., Node.js or Python) running alongside the Nemotron-3 instance, communicating with the extension via a secure channel (e.g., WebSockets or long-polling).

*   **Request Handler:** Receives analysis requests from the Chrome Extension.
*   **Model Policy Engine:** Reads `config/llm-policy.json` and enforces rules (e.g., `nemotron_only` mode).
*   **Consensus Engine:** Manages multi-model calls (Nemotron-3, DeepSeek, OpenAI) and determines consensus based on risk level and disagreement thresholds.
*   **Arbiter (Nemotron-3):** The final authority. In case of disagreement or high-risk changes, Nemotron-3's output is prioritized for safety and architectural integrity.
*   **Output Normalizer:** Ensures all LLM outputs are converted into the required structured format (Issues, Root Cause, Safe Patch, Risk Level).

## Integrated Authorities

The system is designed to route tasks to the most appropriate authority while maintaining a strict hierarchy.

| Authority | Primary Role | Integration Method | Hierarchy |
| :--- | :--- | :--- | :--- |
| **Nemotron-3** | Safety, Architecture, Final Arbitration | Local HTTP Endpoint (`http://127.0.0.1:8000/v1/completions`) | **1 (Highest)** |
| **DeepSeek** | Verification, Reasoning, Code Synthesis | External API | 2 (Secondary) |
| **Notebook LLMs** | Jupyter-based Inspection, Testing, Prototyping | Local/Internal API (Stub) | 3 (Testing) |
| **Chrome DevTools Agent** | Frontend/Runtime Inspection, DOM/Network Data | Chrome Extension API | 4 (Data Source) |

## Data Flow (High-Risk Patch Request)

1.  **Extension** sends inspection data (DOM snapshot, network logs) to **LLM Router Service**.
2.  **LLM Router** checks **Model Policy Engine** (e.g., not `nemotron_only`).
3.  **LLM Router** sends parallel requests to **Nemotron-3** and **DeepSeek**.
4.  **Nemotron-3** and **DeepSeek** return structured output.
5.  **Consensus Engine** compares outputs. If a high-risk patch is suggested and Nemotron-3 and DeepSeek disagree, the request is halted, and the user is notified of the disagreement.
6.  If consensus is reached, the **Output Normalizer** formats the result.
7.  **LLM Router** sends the final, safe, structured output back to the **Extension**.
8.  **Extension** renders the diff and confidence score, requiring manual user confirmation for application.
