export type MongoAction = "find" | "count" | "insertOne" | "updateMany" | "deleteMany";
export type ChatResolverMode = "off" | "fallback" | "force";
export type ChatResolverSource = "deterministic" | "llm";

export type JsonObject = Record<string, unknown>;

export interface MongoOperation {
  action: MongoAction;
  collection: string;
  filter?: JsonObject;
  projection?: JsonObject;
  sort?: JsonObject;
  limit?: number;
  document?: JsonObject;
  update?: JsonObject;
}

export interface MongoIntent {
  domain: "mongo";
  rawText: string;
  normalizedText: string;
  action?: MongoAction;
  collection?: string;
  filter?: JsonObject;
  projection?: JsonObject;
  sort?: JsonObject;
  limit?: number;
  jsonBlocks: JsonObject[];
  confidence: number;
  signals: string[];
}

export interface ChatResponse {
  ok: boolean;
  userText: string;
  intent?: MongoIntent;
  operation?: MongoOperation;
  mongoShell?: string;
  errors?: string[];
  resolver?: ChatResolverSource;
  llm?: {
    mode: ChatResolverMode;
    attempted: boolean;
    success: boolean;
    provider?: string;
    model?: string;
    error?: string;
  };
}

export interface ExecuteResponse {
  ok: boolean;
  result?: unknown;
  errors?: string[];
}

export interface LocalLlmModelsResponse {
  ok: boolean;
  models: string[];
  currentModel: string;
  errors?: string[];
}
