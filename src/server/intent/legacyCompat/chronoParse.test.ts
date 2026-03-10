import { chronoParse } from "./chronoParse";

describe("chronoParse", () => {
  test("parses simple relative expression", async () => {
    const result = await chronoParse("gastos de ayer");

    expect(result).not.toBeNull();
    expect(result?.filter.date.from).toBeDefined();
    expect(result?.filter.date.to).toBeDefined();
  });
});

