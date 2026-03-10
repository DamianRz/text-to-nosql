import { formatMongoShell } from "@/server/nl/formatMongoShell";
import { parseNaturalLanguageToMongo } from "@/server/nl/parseNaturalLanguage";
import type { ChatResponse } from "@/types/mongo";

export const createChatResponse = async (text: string): Promise<ChatResponse> => {
  const parsed = await parseNaturalLanguageToMongo(text);

  if (!parsed.operation) {
    return {
      ok: false,
      userText: text,
      intent: parsed.intent,
      errors: parsed.errors
    };
  }

  return {
    ok: true,
    userText: text,
    intent: parsed.intent,
    operation: parsed.operation,
    mongoShell: formatMongoShell(parsed.operation)
  };
};

