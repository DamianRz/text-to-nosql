import { classifyAction } from "./actionClassifier";

describe("classifyAction", () => {
  test("detects insertion by verb", () => {
    expect(classifyAction("agrega en transactions")).toBe("insertOne");
  });

  test("detects count by interrogative signal", () => {
    expect(classifyAction("cuantos usuarios hay en users")).toBe("count");
  });

  test("detects update by verb", () => {
    expect(classifyAction("actualiza users")).toBe("updateMany");
  });

  test("uses numeric clue as insertion", () => {
    expect(classifyAction("registre 100 en comida")).toBe("insertOne");
  });

  test("detects find with traer verb", () => {
    expect(classifyAction("traeme los gastos en transactions")).toBe("find");
  });
});
