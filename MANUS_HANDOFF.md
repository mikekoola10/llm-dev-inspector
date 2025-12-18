# Project: LLM Dev Inspector

## Mission
Build a production-ready Chrome DevTools extension with multi-LLM reasoning.
DeepSeek is the primary deterministic model.
OpenAI is secondary.
Local models are optional.
No chat UI. Diff-first. Safety-first.

## Core Capabilities
- Chrome DevTools panel
- Inspect DOM / Network / Performance
- AI-generated insights
- Structured output only
- Patch diffs with guardrails
- Multi-model consensus for risky actions

## Models
- DeepSeek: security, audits, refactors
- OpenAI: UX, performance, readability
- Local: optional, private iteration

## Non-Negotiables
- No autonomous execution
- No silent patching
- Read-only by default
- Consensus required for auto-apply
- Model source + confidence always visible
- Full audit logging

## Output Format (ALL MODELS)
Issues:
- …

Root Cause:
- …

Safe Patch:
```diff

Risk Level: LOW | MEDIUM | HIGH

Definition of Done

Extension loads in Chrome DevTools

Page inspection works

DeepSeek + OpenAI respond correctly

Diff preview renders

Consensus blocks unsafe changes

Guardrails enforced
