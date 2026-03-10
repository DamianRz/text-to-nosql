import { buildMongoOperationFromLlmPayload, listAvailableLlmModels } from "./resolveMongoOperationWithLlm";

describe("listAvailableLlmModels", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.LLM_URL;
    delete process.env.LLM_MODEL;
  });

  test("reads local models from ollama tags endpoint", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [{ name: "mistral:7b" }, { name: "llama3.1:8b" }]
      })
    }) as typeof fetch;

    process.env.LLM_URL = "http://127.0.0.1:11434/api/generate";
    process.env.LLM_MODEL = "llama3.1:8b";

    const result = await listAvailableLlmModels();

    expect(result.ok).toBe(true);
    expect(result.models).toEqual(["llama3.1:8b", "mistral:7b"]);
    expect(result.currentModel).toBe("llama3.1:8b");
  });
});

describe("buildMongoOperationFromLlmPayload", () => {
  test("builds valid find from direct payload", () => {
    const operation = buildMongoOperationFromLlmPayload({
      action: "find",
      collection: "transactions",
      filter: { category: "comida" },
      limit: 20
    });

    expect(operation).toEqual({
      action: "find",
      collection: "transactions",
      filter: { category: "comida" },
      projection: undefined,
      sort: undefined,
      limit: 20
    });
  });

  test("builds insert from payload nested in operation", () => {
    const operation = buildMongoOperationFromLlmPayload({
      operation: {
        action: "insertOne",
        collection: "transactions",
        document: { amount: 15, category: "demo" }
      }
    });

    expect(operation).toEqual({
      action: "insertOne",
      collection: "transactions",
      document: { amount: 15, category: "demo" }
    });
  });

  test("rejects delete without filter", () => {
    const operation = buildMongoOperationFromLlmPayload({
      action: "deleteMany",
      collection: "transactions",
      filter: {}
    });

    expect(operation).toBeNull();
  });

  test("rejects invalid action", () => {
    const operation = buildMongoOperationFromLlmPayload({
      action: "aggregate",
      collection: "transactions"
    });

    expect(operation).toBeNull();
  });
});
