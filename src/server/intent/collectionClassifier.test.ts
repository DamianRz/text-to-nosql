import { classifyCollection } from "./collectionClassifier";

describe("classifyCollection", () => {
  test("detects explicit collection", () => {
    expect(classifyCollection("mostrar en users donde active = true")).toBe("users");
  });

  test("maps legacy alias", () => {
    expect(classifyCollection("contar en transacciones")).toBe("transactions");
  });

  test("detects product collection", () => {
    expect(classifyCollection('mostrar en products {"sku":"PRD-001"}')).toBe("products");
  });

  test("maps audit log alias", () => {
    expect(classifyCollection("count in logs")).toBe("audit_logs");
  });

  test("falls back to transactions when none is detected", () => {
    expect(classifyCollection("consulta general")).toBe("transactions");
  });
});
