### Phase 1 — Backend (Critical Path)
- [x] Replace DeepSeek stub with live API call
- [x] Replace OpenAI stub with live API call
- [x] Implement normalized output parser
- [x] Add confidence scoring
- [x] Add audit logging (model, hash, timestamp)

### Phase 2 — LLM Router
- [ ] Auto-routing by task type
- [ ] Manual model override
- [ ] Consensus engine (DeepSeek + OpenAI)
- [ ] Disagreement threshold logic

### Phase 3 — DevTools UI
- [ ] DevTools panel loads
- [ ] Model selector wired
- [ ] Insight cards render
- [ ] Diff viewer functional
- [ ] Confidence indicators visible

### Phase 4 — Guardrails
- [ ] Read-only default enforced
- [ ] Auto-apply gated by consensus
- [ ] Manual confirmation required
- [ ] Kill switch environment flag

### Phase 5 — Stability
- [ ] Clean install instructions
- [ ] No runtime crashes
- [ ] Reasonable latency (<5s)
