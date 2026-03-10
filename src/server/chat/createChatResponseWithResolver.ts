import { resolveMongoOperationWithLlm } from "@/server/llm/resolveMongoOperationWithLlm";
import { formatMongoShell } from "@/server/nl/formatMongoShell";
import { parseNaturalLanguageToMongo } from "@/server/nl/parseNaturalLanguage";
import type { ChatResolverMode, ChatResponse, MongoOperation } from "@/types/mongo";
import { getLastChatContext, isRepeatInstruction, recordChatContext } from "./contextMemory";

interface CreateChatResponseWithResolverOptions {
  llmMode?: ChatResolverMode;
  llmModel?: string;
}

const LOW_CONFIDENCE_THRESHOLD = 0.55;

const baseLlmMeta = (mode: ChatResolverMode) => ({
  mode,
  attempted: false,
  success: false
});

const buildSuccessResponse = (
  text: string,
  operation: MongoOperation,
  resolver: ChatResponse["resolver"],
  llm: ChatResponse["llm"],
  intent?: ChatResponse["intent"]
): ChatResponse => ({
  ok: true,
  userText: text,
  intent,
  operation,
  mongoShell: formatMongoShell(operation),
  resolver,
  llm
});

const buildErrorResponse = (text: string, errors: string[], llm: ChatResponse["llm"], intent?: ChatResponse["intent"]): ChatResponse => ({
  ok: false,
  userText: text,
  intent,
  errors,
  resolver: "deterministic",
  llm
});

const shouldAttemptLlm = (mode: ChatResolverMode, hasDeterministicOperation: boolean, confidence: number): boolean => {
  if (mode === "off") {
    return false;
  }

  if (mode === "force") {
    return true;
  }

  return !hasDeterministicOperation || confidence < LOW_CONFIDENCE_THRESHOLD;
};

const buildRepeatResponse = (text: string, mode: ChatResolverMode): ChatResponse | null => {
  if (!isRepeatInstruction(text)) {
    return null;
  }

  const remembered = getLastChatContext();
  if (!remembered) {
    return null;
  }

  return {
    ok: true,
    userText: text,
    intent: remembered.intent,
    operation: remembered.operation,
    mongoShell: remembered.mongoShell,
    resolver: remembered.resolver,
    llm: {
      mode,
      attempted: false,
      success: false
    }
  };
};

const persistSuccess = (text: string, response: ChatResponse): void => {
  if (!response.ok || !response.operation || !response.mongoShell || !response.resolver) {
    return;
  }

  recordChatContext({
    userText: text,
    intent: response.intent,
    operation: response.operation,
    mongoShell: response.mongoShell,
    resolver: response.resolver
  });
};

export const createChatResponseWithResolver = async (
  text: string,
  options: CreateChatResponseWithResolverOptions = {}
): Promise<ChatResponse> => {
  const llmMode = options.llmMode ?? "off";
  const repeatResponse = buildRepeatResponse(text, llmMode);
  if (repeatResponse) {
    return repeatResponse;
  }

  const parsed = await parseNaturalLanguageToMongo(text);
  const deterministicOperation = parsed.operation;
  const llmMeta = baseLlmMeta(llmMode);

  if (!shouldAttemptLlm(llmMode, Boolean(deterministicOperation), parsed.intent.confidence)) {
    if (deterministicOperation) {
      const response = buildSuccessResponse(text, deterministicOperation, "deterministic", llmMeta, parsed.intent);
      persistSuccess(text, response);
      return response;
    }

    return buildErrorResponse(text, parsed.errors, llmMeta, parsed.intent);
  }

  const llmResult = await resolveMongoOperationWithLlm(text, {
    forceEnabled: llmMode === "force",
    model: options.llmModel
  });
  const llmResultMeta = {
    mode: llmMode,
    attempted: true,
    success: llmResult.ok,
    provider: llmResult.provider,
    model: llmResult.model,
    error: llmResult.error
  } satisfies ChatResponse["llm"];

  if (llmResult.ok && llmResult.operation) {
    const response = buildSuccessResponse(text, llmResult.operation, "llm", llmResultMeta, parsed.intent);
    persistSuccess(text, response);
    return response;
  }

  if (deterministicOperation) {
    const response = buildSuccessResponse(text, deterministicOperation, "deterministic", llmResultMeta, parsed.intent);
    persistSuccess(text, response);
    return response;
  }

  const mergedErrors = [...parsed.errors];
  if (llmResult.error) {
    mergedErrors.push(llmResult.error);
  }

  return buildErrorResponse(text, mergedErrors, llmResultMeta, parsed.intent);
};
