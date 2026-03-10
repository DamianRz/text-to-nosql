import { detectTemporalExpressions } from "./detectTemporalExpressions";

describe("detectTemporalExpressions", () => {
  test("detects relative temporal block", () => {
    const result = detectTemporalExpressions("mostrar gastos de ayer");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].match).toContain("ayer");
  });

  test("detects full temporal range", () => {
    const result = detectTemporalExpressions("contar del 1 al 5 de noviembre en transactions");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].match).toContain("noviembre");
  });

  test("detects last weekend expression", () => {
    const result = detectTemporalExpressions("traeme lo mas importante de gastos del ultimo finde en transactions");

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((entry) => entry.match.includes("ultimo finde"))).toBe(true);
  });
});
