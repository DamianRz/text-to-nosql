# Natural Language to MongoDB

Natural Language to MongoDB is a compact Next.js application that turns natural language instructions into auditable MongoDB operations. The product flow stays explicit:

`natural language -> query generation -> execution -> result`

The hosted experience is a product preview. Full functionality is intended to run locally with a local LLM and the session-based simulated database included in the app.

## What it does

- Accepts natural language instructions in Spanish or English
- Resolves them into typed MongoDB operations
- Displays the equivalent Mongo Shell query for review
- Executes only after explicit user action
- Offers a local simulated database for safe end-to-end demos
- Lets the user choose a local Ollama model when running locally

## Requirements

- Node.js 20+
- npm
- Ollama running locally if you want LLM-backed resolution

## Local setup

1. Install dependencies:

```bash
npm i
```

This also enables the repository commit hook defined in `commit.md`.

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Pull a local model if needed:

```bash
ollama pull llama3.1:8b
```

4. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
npm run dev
npm run test
npm run build
```

## Environment

Use `.env.example` as the starting point:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=refactor

LLM_ENABLED=true
LLM_URL=http://127.0.0.1:11434/api/generate
LLM_MODEL=llama3.1:8b
LLM_TIMEOUT_MS=12000
```

For local product demos, the primary path is the simulated browser database, not a live MongoDB instance.

## Repository structure

- `app/`: Next.js app router entry points and API routes
- `src/components/`: dashboard UI, demos, viewer, and layout
- `src/client/localDb/`: simulated Mongo-like browser database
- `src/server/intent/`: deterministic intent pipeline
- `src/server/llm/`: local LLM integration and model discovery
- `src/server/mongo/`: Mongo execution path for real database usage
- `docs/`: architecture notes and improvement plan
- `commit.md`: commit message standard used in this repository

## Notes

- The local database shown in the UI is simulated on purpose.
- The main goal of the project is to showcase the LLM-centered workflow without hiding the generated query.
- If you want to use a real MongoDB instance, configure `MONGO_URI` and `MONGO_DB` locally and keep the explicit execution step in place.
