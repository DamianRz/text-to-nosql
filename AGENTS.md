# AGENTS

## Repository goal

Maintain a minimal web application that converts natural language into MongoDB operations, shows an auditable Mongo Shell representation, and executes only after explicit user confirmation.

## System principles

- The deterministic parser is the primary path.
- The LLM is complementary and always schema-constrained.
- MongoDB execution requires human confirmation.
- The UI must expose the generated query instead of hiding it.

## Architecture map

### Frontend

- `app/page.tsx`: main entry point.
- `src/components/ChatMongo.tsx`: state orchestration for demos, query generation, execution, and results.
- `src/components/chatMongo/*`: focused panels and styled-components-based presentation.
- `src/styles/theme.ts`: global visual tokens.

### Backend

- `app/api/chat/route.ts`: receives text plus resolver mode.
- `app/api/execute/route.ts`: executes a validated operation.
- `src/server/chat/createChatResponseWithResolver.ts`: chooses deterministic parsing, LLM fallback, and response shaping.
- `src/server/nl/parseNaturalLanguage.ts`: adapter between free-form input and the intent pipeline.
- `src/server/nl/formatMongoShell.ts`: auditable query serialization for the UI.
- `src/server/mongo/executeMongoOperation.ts`: final execution against MongoDB.

### Intent pipeline

- `src/server/intent/runMongoIntentPipeline.ts`
- `src/server/intent/detectMongoIntent.ts`
- `src/server/intent/buildMongoOperation.ts`
- `src/server/intent/actionClassifier.ts`
- `src/server/intent/collectionClassifier.ts`
- `src/server/intent/conditionalFilterParser.ts`
- `src/server/intent/jsonEmbeddedParser.ts`
- `src/server/intent/temporal/*`
- `src/server/intent/legacyCompat/*`

## Required functional flow

1. The frontend sends text to `POST /api/chat`.
2. The backend detects intent, builds `MongoOperation`, and returns `mongoShell`.
3. The UI shows the generated query before execution.
4. The user confirms and the frontend calls `POST /api/execute`.
5. The backend executes with `executeMongoOperation` and returns a serializable result.

## Repository boundaries

- Do not add new modules outside `chat -> parser -> operation -> execution` without documenting the reason in `docs/`.
- Do not skip the visual audit step for generated queries.
- Do not add a visual dependency if `styled-components` already covers the need.
- Do not make the LLM a hard dependency for the happy path.

## Working rules for agents

- Keep strict TypeScript and ES modules style.
- Prefer small, composable changes over broad rewrites.
- Add or update tests with every functional change.
- Preserve compatibility with `mongodb-memory-server` in tests.
- Keep bilingual UI behavior when editing user-facing copy.
- Avoid unnecessary code comments; document decisions in `docs/`.
- Follow the commit message standard defined in `commit.md`.

## Delivery checklist

```bash
npm run test
npm run build
```

If a test needs MongoDB, use embedded memory or mocks. Do not couple the suite to an external instance.

## Related documentation

- `README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/improvement-plan.md`
- `commit.md`
