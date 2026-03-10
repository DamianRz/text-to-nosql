import type { MongoIntent, MongoOperation } from "@/types/mongo";
import { buildMongoOperation } from "./buildMongoOperation";
import { detectMongoIntent } from "./detectMongoIntent";

export interface MongoIntentPipelineResult {
  ok: boolean;
  intent: MongoIntent;
  operation?: MongoOperation;
  errors: string[];
}

export const runMongoIntentPipeline = async (text: string): Promise<MongoIntentPipelineResult> => {
  const intent = await detectMongoIntent(text);
  const built = buildMongoOperation(intent);

  if (!built.operation) {
    return {
      ok: false,
      intent,
      errors: built.errors
    };
  }

  return {
    ok: true,
    intent,
    operation: built.operation,
    errors: []
  };
};
