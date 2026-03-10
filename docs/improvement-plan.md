# Improvement Plan

## Goal

Raise the project across three fronts: operational clarity, code robustness, and visual quality, without breaking the current minimal flow.

## Changes already completed

- Rewrote `AGENTS.md` with the actual architecture, repository limits, and delivery checklist.
- Added `docs/` with maintainable architecture and roadmap notes.
- Improved chat state handling so an outdated query is not executed while a new one is being generated.
- Upgraded the dashboard presentation to better match a professional data tooling product.
- Added a local simulated database and a viewer that updates after local execution.

## Priority 1: quick wins

### Code

- Extract a dedicated `useChatMongoState` hook to reduce state concentration in `ChatMongo.tsx`.
- Unify error handling between `POST /api/chat` and `POST /api/execute`.
- Tighten result typing so the UI depends less on `unknown`.
- Expand tests for transient states such as loading, parser failures, and disabled execution.

### Visual

- Consolidate semantic tokens in `theme.ts` and reduce hardcoded component colors.
- Strengthen the visual hierarchy between input, query, result, and database viewer.
- Improve empty and loading states so the current stage is always obvious.

## Priority 2: structural robustness

### Code

- Add a shared validation layer for API payloads.
- Introduce an explicit policy for destructive operations with empty filters.
- Capture basic telemetry for resolver source, confidence, and response time.
- Document `MongoOperation` and `ChatResponse` with edge-case examples.

### Visual

- Improve resolver and confidence indicators with stronger contrast and clearer copy.
- Show an explicit confirmation pattern before `deleteMany` and `updateMany`.
- Add better action traceability for executed steps and result history.

## Priority 3: product evolution

### Code

- Separate deterministic parsing and LLM orchestration into smaller testable modules.
- Prepare a policy layer by collection and action.
- Evaluate full end-to-end UI tests for the complete workflow.

### Visual

- Add a side-by-side comparison view between deterministic and LLM output for demos.
- Improve first-run onboarding with data-domain-aware examples.

## Acceptance criteria for future work

- Every functional change includes tests.
- Every structural change updates `docs/`.
- No visual improvement may hide the final query or reduce auditability.
