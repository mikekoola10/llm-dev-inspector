## Validation Script

### Test 1 — Extension Load
- Open chrome://extensions
- Load unpacked extension
- DevTools shows “LLM Dev Inspector”

PASS if panel renders without errors

---

### Test 2 — DeepSeek Response
- Inspect a page with DOM complexity
- Select Model: DeepSeek
- Trigger analysis

PASS if response contains:
- Issues
- Root Cause
- Safe Patch
- Risk Level

---

### Test 3 — OpenAI Response
- Switch model to OpenAI
- Trigger performance analysis

PASS if output is structured and readable

---

### Test 4 — Consensus Block
- Trigger high-risk refactor
- Enable consensus

PASS if:
- Disagreement blocks auto-apply
- Manual review required

---

### Test 5 — Guardrails
- Attempt auto-apply without consensus

PASS if action is blocked

---

### Final Pass Condition
All tests pass with no silent failures.
