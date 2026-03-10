import { runMongoIntentPipeline } from "@/server/intent/runMongoIntentPipeline";
import type { MongoIntent, MongoOperation } from "@/types/mongo";

export interface ParseResult {
  operation?: MongoOperation;
  intent: MongoIntent;
  errors: string[];
}

export const parseNaturalLanguageToMongo = async (input: string): Promise<ParseResult> => {
  const text = input.trim();

  const fallbackIntent: MongoIntent = {
    domain: "mongo",
    rawText: input,
    normalizedText: text,
    jsonBlocks: [],
    confidence: 0,
    signals: []
  };

  if (!text) {
    return {
      intent: fallbackIntent,
      errors: ["El texto no puede estar vacio."]
    };
  }

  const result = await runMongoIntentPipeline(text);

  return {
    operation: result.operation,
    intent: result.intent,
    errors: result.errors
  };
};
