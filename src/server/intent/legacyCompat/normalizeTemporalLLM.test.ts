import { normalizeTemporalLLM } from "./normalizeTemporalLLM";

describe("normalizeTemporalLLM", () => {
  test("returns original text when expression is not temporal", async () => {
    const result = await normalizeTemporalLLM("muestra usuarios activos");

    expect(result).toBe("muestra usuarios activos");
  });

  test("respects env-based disable flag", async () => {
    const previous = process.env.LLM_ENABLED;
    process.env.LLM_ENABLED = "false";

    const result = await normalizeTemporalLLM("gastos de ayer");

    expect(result).toBe("gastos de ayer");
    process.env.LLM_ENABLED = previous;
  });
});

