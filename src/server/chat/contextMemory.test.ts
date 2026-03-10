import { clearChatContext, getLastChatContext, isRepeatInstruction, recordChatContext } from "./contextMemory";

describe("contextMemory", () => {
  beforeEach(() => {
    clearChatContext();
  });

  test("detects repeat instructions", () => {
    expect(isRepeatInstruction("otra vez")).toBe(true);
    expect(isRepeatInstruction("repite la consulta")).toBe(true);
    expect(isRepeatInstruction("mostrar users")).toBe(false);
  });

  test("stores and retrieves last operation", () => {
    recordChatContext({
      userText: "contar users activos",
      operation: {
        action: "count",
        collection: "users",
        filter: { active: true }
      },
      mongoShell: "db.users.countDocuments({\"active\":true})",
      resolver: "deterministic"
    });

    const memory = getLastChatContext();
    expect(memory?.operation.action).toBe("count");
    expect(memory?.mongoShell).toContain("countDocuments");
  });
});

