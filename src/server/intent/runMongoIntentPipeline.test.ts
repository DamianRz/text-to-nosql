import { runMongoIntentPipeline } from "./runMongoIntentPipeline";

describe("runMongoIntentPipeline", () => {
  test("builds find operation with filter and temporal range", async () => {
    const result = await runMongoIntentPipeline("mostrar en transactions donde category = comida y amount > 10 ayer");

    expect(result.ok).toBe(true);
    expect(result.operation?.action).toBe("find");
    expect(result.operation?.collection).toBe("transactions");
    expect(result.operation?.filter).toMatchObject({
      category: "comida",
      amount: { $gt: 10 }
    });
    expect((result.operation?.filter as Record<string, unknown>).date).toBeDefined();
  });

  test("returns error for insert without JSON", async () => {
    const result = await runMongoIntentPipeline("agrega en transactions");

    expect(result.ok).toBe(false);
    expect(result.operation).toBeUndefined();
    expect(result.errors[0]).toContain("documento JSON");
  });

  test("uses embedded JSON for insert", async () => {
    const result = await runMongoIntentPipeline("agrega en transactions {\"category\":\"comida\",\"amount\":25}");

    expect(result.ok).toBe(true);
    expect(result.operation).toEqual({
      action: "insertOne",
      collection: "transactions",
      document: {
        category: "comida",
        amount: 25
      }
    });
  });

  test("interprets last weekend and adds date filter", async () => {
    const result = await runMongoIntentPipeline("traeme lo mas importante de gastos del ultimo finde en transactions");

    expect(result.ok).toBe(true);
    expect(result.operation?.action).toBe("find");
    expect(result.operation?.collection).toBe("transactions");
    expect((result.operation?.filter as Record<string, unknown>).date).toBeDefined();
  });
});
