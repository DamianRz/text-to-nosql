## Objective

Refactor the product into a cleaner developer tool UI: one primary input, one primary result surface, collapsed advanced options, and faster mobile usage.

## Plan

1. Reduce the visible interface to header, input, result, and about copy.
2. Move demos, model controls, preview toggles, logs, and database state into collapsed advanced options.
3. Tighten spacing, typography, and color usage so the app reads like a utility, not a playground.
4. Validate with tests and production build, then deploy through `main`.

## Execution Notes

- Replaced the multi-panel visible layout with a single-column utility flow.
- Collapsed secondary controls and demo tooling under `Advanced options`.
- Kept the Android-safe Next.js WASM SWC fallback in place for local builds.
- Pending final commit and deploy for this refactor.
