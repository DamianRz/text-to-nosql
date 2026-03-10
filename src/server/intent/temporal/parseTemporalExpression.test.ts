import { parseTemporalExpression } from "./parseTemporalExpression";

describe("parseTemporalExpression", () => {
  test("parses today", () => {
    const result = parseTemporalExpression("hoy");

    expect(result).not.toBeNull();
    expect(result?.from).toContain("T");
    expect(result?.to).toContain("T");
  });

  test("parses range between days", () => {
    const result = parseTemporalExpression("entre 3 y 7 de noviembre");

    expect(result).not.toBeNull();
    expect(result?.from).toBeDefined();
    expect(result?.to).toBeDefined();
  });

  test("parses date with time", () => {
    const result = parseTemporalExpression("martes proximo a las 18:30");

    expect(result).not.toBeNull();
    expect(result?.from).toContain(":30:00");
  });

  test("parses last weekend as saturday-sunday range", () => {
    const result = parseTemporalExpression("ultimo finde");

    expect(result).not.toBeNull();
    const from = new Date(result!.from);
    const to = new Date(result!.to);
    const hours = (to.getTime() - from.getTime()) / (1000 * 60 * 60);

    expect(hours).toBeGreaterThan(47);
    expect(hours).toBeLessThan(49);
  });
});
