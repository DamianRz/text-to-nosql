import { formatMongoShell } from "./formatMongoShell";

describe("formatMongoShell", () => {
  test("serializes find", () => {
    const output = formatMongoShell({
      action: "find",
      collection: "transactions",
      filter: { category: "comida" },
      limit: 10
    });

    expect(output).toContain("db.transactions.find");
    expect(output).toContain("\"category\": \"comida\"");
    expect(output).toContain("limit(10)");
  });

  test("serializes updateMany", () => {
    const output = formatMongoShell({
      action: "updateMany",
      collection: "users",
      filter: { active: true },
      update: { $set: { active: false } }
    });

    expect(output).toContain("updateMany");
    expect(output).toContain("\"$set\"");
  });
});
