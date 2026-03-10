import { parseNaturalLanguageToMongo } from "./parseNaturalLanguage";

describe("parseNaturalLanguageToMongo", () => {
  test("converts find query with simple conditions", async () => {
    const result = await parseNaturalLanguageToMongo("mostrar en transactions donde category = comida y amount > 10");

    expect(result.errors).toEqual([]);
    expect(result.operation).toEqual({
      action: "find",
      collection: "transactions",
      filter: {
        category: "comida",
        amount: { $gt: 10 }
      },
      limit: 50
    });
  });

  test("converts count with JSON", async () => {
    const result = await parseNaturalLanguageToMongo("contar en users {\"country\":\"UY\"}");

    expect(result.errors).toEqual([]);
    expect(result.operation).toEqual({
      action: "count",
      collection: "users",
      filter: { country: "UY" }
    });
  });

  test("requires JSON document for insert", async () => {
    const result = await parseNaturalLanguageToMongo("agregar en transactions");

    expect(result.operation).toBeUndefined();
    expect(result.errors[0]).toContain("documento JSON");
  });
});
