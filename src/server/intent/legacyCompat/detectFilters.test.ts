import { detectFilters } from "./detectFilters";

describe("detectFilters", () => {
  test("detects temporal range and concept", async () => {
    const result = await detectFilters("traeme gastos de comida del ultimo finde");

    expect(result.filter.date).toBeDefined();
    expect(result.filter.concept).toBe("comida");
  });
});

