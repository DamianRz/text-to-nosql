# Architecture

## Summary

The application converts free-form text into a typed MongoDB operation, shows the equivalent Mongo Shell expression, and executes the action only after user confirmation.

## Layers

### UI

- `app/page.tsx` renders `ChatMongo`.
- `src/components/ChatMongo.tsx` owns language, input, messages, operation, result, and network state.
- `src/components/chatMongo/*` splits the interface into focused panels to keep view logic separated from orchestration.
- `src/styles/theme.ts` and `AppThemeProvider.tsx` define visual tokens and global styling with `styled-components`.

### API

- `POST /api/chat`
  - validates `text` and `llmMode`
  - calls `createChatResponseWithResolver`
  - returns `operation`, `mongoShell`, resolver metadata, and errors
- `POST /api/execute`
  - validates `operation`
  - opens the Mongo connection
  - executes the operation through `executeMongoOperation`

### NLP domain

- `parseNaturalLanguageToMongo` normalizes input and delegates to the intent pipeline.
- `runMongoIntentPipeline` chains intent detection and operation building.
- `detectMongoIntent` aggregates action, collection, filter, JSON, and temporal parsing.
- `buildMongoOperation` converts intent data into a consistent `MongoOperation`.

### LLM resolver

- `createChatResponseWithResolver` decides between deterministic parsing and LLM assistance.
- `resolveMongoOperationWithLlm` calls the configured provider, validates the returned JSON, and constrains it to the allowed schema.
- The LLM never executes directly. It always returns to the same typed contract as the deterministic path.

### Execution

- `getMongoDb` resolves the Mongo connection.
- `executeMongoOperation` translates `MongoOperation` into MongoDB driver calls.
- Supported actions remain limited to `find`, `count`, `insertOne`, `updateMany`, and `deleteMany`.

## End-to-end flow

1. The user writes an instruction in the UI.
2. `ChatMongo` calls `POST /api/chat`.
3. The backend tries the deterministic pipeline first.
4. If resolver mode allows it and confidence is low, the LLM path is used as fallback or forced mode.
5. The response returns as `MongoOperation` plus `mongoShell`.
6. The UI renders the query in an auditable format.
7. Only after confirmation does `ChatMongo` call `POST /api/execute`.
8. The backend executes and returns a serializable result.

## Invariants

- The UI must not allow execution without a current `MongoOperation`.
- Parsing errors must be surfaced in the conversation or a visible error area.
- Destructive operations must keep explicit human confirmation.
- Shared contracts live in `src/types/mongo.ts`, and any change must update tests and docs.

## Current risks

- `ChatMongo.tsx` still centralizes a large amount of state and side effects.
- Formal contract documentation and observability criteria are still light.
- The hosted preview and local runtime are intentionally different surfaces and must stay clearly separated.
