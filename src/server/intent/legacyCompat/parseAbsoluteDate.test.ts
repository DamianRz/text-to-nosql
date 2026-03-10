import { parseAbsoluteDate } from "./parseAbsoluteDate";

describe("parseAbsoluteDate", () => {
  test("parses Spanish day and month", () => {
    const result = parseAbsoluteDate("1 de noviembre");

    expect(result).not.toBeNull();
    expect(result?.filter.date.from).toContain("T");
    expect(result?.filter.date.to).toContain("T");
  });

  test("parses simple numeric range", () => {
    const result = parseAbsoluteDate("del 3 al 5 de noviembre");

    expect(result).not.toBeNull();
    expect(result?.filter.date.from).toBeDefined();
    expect(result?.filter.date.to).toBeDefined();
  });
});

