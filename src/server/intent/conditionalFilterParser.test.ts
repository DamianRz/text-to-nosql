import { parseConditionalFilter } from "./conditionalFilterParser";

describe("parseConditionalFilter", () => {
  test("extracts simple condition", () => {
    const result = parseConditionalFilter("mostrar users donde age >= 18");

    expect(result.detected).toBe(true);
    expect(result.filter).toEqual({
      age: { $gte: 18 }
    });
  });

  test("handles multiple conditions", () => {
    const result = parseConditionalFilter("contar users donde age >= 18 y active = true");

    expect(result.detected).toBe(true);
    expect(result.filter).toEqual({
      age: { $gte: 18 },
      active: true
    });
  });
});
