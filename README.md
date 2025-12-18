# LLM Dev Inspector

The LLM Dev Inspector is a production-ready Chrome DevTools extension built for AI-generated insights, safety-first patch diffs, and multi-LLM reasoning. It is designed to be a diff-first, no-chat-UI tool for enterprise-grade development.

## Project Discovery Index

This repository is the central hub for the LLM Dev Inspector project. Start here to understand the mission, architecture, and development plan.

| Document | Purpose | Status |
| :--- | :--- | :--- |
| [**MANUS_HANDOFF.md**](./MANUS_HANDOFF.md) | **Source of Truth:** Defines the project mission, core capabilities, and non-negotiables. | **LOCKED** |
| [**AUTHORITY_HIERARCHY.md**](./AUTHORITY_HIERARCHY.md) | **Model Routing:** Defines the strict hierarchy and consensus rules for all integrated LLMs (Nemotron-3, DeepSeek, etc.). | **LOCKED** |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | **High-Level Design:** Overview of the Chrome Extension and LLM Router Service components. | **DRAFT** |
| [**MANUS_EXECUTION_CHECKLIST.md**](./MANUS_EXECUTION_CHECKLIST.md) | **Development Plan:** Task-by-task checklist for implementation phases. | **ACTIVE** |
| [**MANUS_SUCCESS_TEST.md**](./MANUS_SUCCESS_TEST.md) | **Validation Script:** End-to-end tests for successful deployment and core functionality. | **ACTIVE** |

## Core Authorities

The system integrates four key authorities for comprehensive analysis:

1.  **Nemotron-3:** Primary arbiter for safety and architecture.
2.  **DeepSeek:** Secondary reasoning and code synthesis.
3.  **Notebook LLMs:** For isolated inspection and testing.
4.  **Chrome DevTools Agent:** Frontend and runtime data source.

---
*For policy enforcement, see `config/llm-policy.json`.*
