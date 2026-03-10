import { createChatResponse } from "./createChatResponse";

describe("createChatResponse", () => {
  test("returns ready query when input text is valid", async () => {
    const response = await createChatResponse("contar en users donde active = true");

    expect(response.ok).toBe(true);
    expect(response.operation?.action).toBe("count");
    expect(response.mongoShell).toContain("db.users.countDocuments");
  });

  test("returns errors when action is not recognized", async () => {
    const response = await createChatResponse("hola mundo");

    expect(response.ok).toBe(false);
    expect(response.errors?.length).toBeGreaterThan(0);
    expect(response.operation).toBeUndefined();
  });
});
