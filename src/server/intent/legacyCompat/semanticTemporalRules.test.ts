import { semanticTemporalRules } from "./semanticTemporalRules";

describe("semanticTemporalRules", () => {
  test("detects last week", async () => {
    const result = await semanticTemporalRules("gastos de la semana pasada");

    expect(result).not.toBeNull();
    expect(result?.from).toBeInstanceOf(Date);
    expect(result?.to).toBeInstanceOf(Date);
  });
});

