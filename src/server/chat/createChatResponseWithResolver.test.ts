import { createChatResponseWithResolver } from "./createChatResponseWithResolver";
import { clearChatContext } from "./contextMemory";
import { resolveMongoOperationWithLlm } from "@/server/llm/resolveMongoOperationWithLlm";

jest.mock("@/server/llm/resolveMongoOperationWithLlm", () => ({
  resolveMongoOperationWithLlm: jest.fn()
}));

const mockedResolveMongoOperationWithLlm = resolveMongoOperationWithLlm as jest.MockedFunction<typeof resolveMongoOperationWithLlm>;

describe("createChatResponseWithResolver", () => {
  beforeEach(() => {
    mockedResolveMongoOperationWithLlm.mockReset();
    clearChatContext();
  });

  test("uses deterministic resolver when llmMode is off", async () => {
    const response = await createChatResponseWithResolver("contar en users donde active = true", { llmMode: "off" });

    expect(response.ok).toBe(true);
    expect(response.resolver).toBe("deterministic");
    expect(response.llm?.attempted).toBe(false);
    expect(mockedResolveMongoOperationWithLlm).not.toHaveBeenCalled();
  });

  test("uses LLM resolver when llmMode is force and returns valid output", async () => {
    mockedResolveMongoOperationWithLlm.mockResolvedValue({
      ok: true,
      operation: {
        action: "find",
        collection: "transactions",
        filter: { demoTag: "chat-demo" },
        limit: 10
      },
      provider: "ollama",
      model: "llama3.1:8b"
    });

    const response = await createChatResponseWithResolver("traeme lo importante del demo chat", { llmMode: "force" });

    expect(response.ok).toBe(true);
    expect(response.resolver).toBe("llm");
    expect(response.operation).toEqual({
      action: "find",
      collection: "transactions",
      filter: { demoTag: "chat-demo" },
      limit: 10
    });
    expect(response.llm?.attempted).toBe(true);
    expect(response.llm?.success).toBe(true);
  });

  test("passes selected local model to the LLM resolver", async () => {
    mockedResolveMongoOperationWithLlm.mockResolvedValue({
      ok: true,
      operation: {
        action: "find",
        collection: "transactions",
        filter: {},
        limit: 10
      },
      provider: "ollama",
      model: "mistral:7b"
    });

    await createChatResponseWithResolver("traeme transacciones", {
      llmMode: "force",
      llmModel: "mistral:7b"
    });

    expect(mockedResolveMongoOperationWithLlm).toHaveBeenCalledWith("traeme transacciones", {
      forceEnabled: true,
      model: "mistral:7b"
    });
  });

  test("adds LLM error when deterministic and LLM operations are unavailable", async () => {
    mockedResolveMongoOperationWithLlm.mockResolvedValue({
      ok: false,
      error: "LLM deshabilitado."
    });

    const response = await createChatResponseWithResolver("hola mundo", { llmMode: "fallback" });

    expect(response.ok).toBe(false);
    expect(response.errors).toContain("LLM deshabilitado.");
    expect(response.llm?.attempted).toBe(true);
    expect(response.llm?.success).toBe(false);
  });

  test("repeats last operation when receiving memory follow-up", async () => {
    const first = await createChatResponseWithResolver("contar en users donde active = true", { llmMode: "off" });
    const second = await createChatResponseWithResolver("otra vez", { llmMode: "off" });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.operation).toEqual(first.operation);
    expect(second.mongoShell).toEqual(first.mongoShell);
  });
});
