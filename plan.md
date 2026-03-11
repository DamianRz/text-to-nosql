## Objective

Consolidate the current guided-workflow redesign, keep the Mongo query review step explicit, and leave the repository in a shippable state on this Android environment.

## Plan

1. Review the pending UI, copy, and test changes to confirm the intended product flow.
2. Fix environment-specific gaps that block local validation, especially `next build` on Android.
3. Validate the updated experience with tests and a production build.
4. Commit the resulting state using the repository commit standard.

## Execution Notes

- Reviewed the pending diff and confirmed the main change is a clearer guided workflow: write, review, execute, and verify.
- Verified the updated component tests for the redesigned workspace.
- Added the Next.js WASM SWC fallback dependency required for Android builds.
- Pending final validation and commit.
