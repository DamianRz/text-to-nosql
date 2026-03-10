import { parseEmbeddedJson, processPropertyRemoval } from "./jsonEmbeddedParser";

describe("jsonEmbeddedParser", () => {
  test("extracts embedded JSON", () => {
    const result = parseEmbeddedJson("agrega en transactions {\"category\":\"comida\",\"amount\":20}");

    expect(result.json).toEqual({
      category: "comida",
      amount: 20
    });
    expect(result.remainingText).toContain("agrega");
  });

  test("removes requested property", () => {
    const output = processPropertyRemoval(
      { category: "comida", amount: 20, note: "x" },
      "eliminar propiedad note"
    );

    expect(output).toEqual({
      category: "comida",
      amount: 20
    });
  });
});
