import { temporalPostValidator } from "./temporalPostValidator";

describe("temporalPostValidator", () => {
  test("accepts valid temporal range", () => {
    const result = temporalPostValidator({
      original: "gastos de ayer",
      normalized: "ayer",
      filter: {
        date: {
          from: new Date("2026-03-01T00:00:00.000Z").toISOString(),
          to: new Date("2026-03-01T23:59:59.999Z").toISOString()
        }
      }
    });

    expect(result).not.toBeNull();
  });

  test("rejects fabricated numeric values", () => {
    const result = temporalPostValidator({
      original: "gastos ayer",
      normalized: "ayer 2027",
      filter: {
        date: {
          from: new Date("2026-03-01T00:00:00.000Z").toISOString(),
          to: new Date("2026-03-01T23:59:59.999Z").toISOString()
        }
      }
    });

    expect(result).toBeNull();
  });
});

