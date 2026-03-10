import type { JsonObject, MongoAction, MongoOperation } from "@/types/mongo";

interface LlmMongoResolutionResult {
  ok: boolean;
  operation?: MongoOperation;
  error?: string;
  provider?: string;
  model?: string;
}

interface ResolveMongoOperationWithLlmOptions {
  forceEnabled?: boolean;
  model?: string;
}

type LlmPayload = Record<string, unknown>;

const DEFAULT_LLM_URL = "http://127.0.0.1:11434/api/generate";
const DEFAULT_LLM_MODEL = "llama3.1:8b";
const DEFAULT_TIMEOUT_MS = 12000;

const allowedActions: Set<MongoAction> = new Set(["find", "count", "insertOne", "updateMany", "deleteMany"]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asJsonObject = (value: unknown): JsonObject | undefined => {
  if (!isObject(value)) {
    return undefined;
  }
  return value;
};

const asAction = (value: unknown): MongoAction | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  if (!allowedActions.has(value as MongoAction)) {
    return undefined;
  }
  return value as MongoAction;
};

const asCollection = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const cleaned = value.trim();
  if (!/^[a-zA-Z_][\w.-]*$/.test(cleaned)) {
    return undefined;
  }
  return cleaned;
};

const asLimit = (value: unknown): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const normalized = Math.floor(value);
  if (normalized <= 0) {
    return undefined;
  }
  return Math.min(normalized, 500);
};

const unwrapMarkdownJson = (value: string): string => value.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

const extractPayload = (value: unknown): LlmPayload | null => {
  if (!isObject(value)) {
    return null;
  }

  if (isObject(value.operation)) {
    return value.operation;
  }

  return value;
};

export const buildMongoOperationFromLlmPayload = (payload: unknown): MongoOperation | null => {
  const operationPayload = extractPayload(payload);
  if (!operationPayload) {
    return null;
  }

  const action = asAction(operationPayload.action);
  const collection = asCollection(operationPayload.collection);
  if (!action || !collection) {
    return null;
  }

  if (action === "find") {
    return {
      action,
      collection,
      filter: asJsonObject(operationPayload.filter) ?? {},
      projection: asJsonObject(operationPayload.projection),
      sort: asJsonObject(operationPayload.sort),
      limit: asLimit(operationPayload.limit) ?? 50
    };
  }

  if (action === "count") {
    return {
      action,
      collection,
      filter: asJsonObject(operationPayload.filter) ?? {}
    };
  }

  if (action === "insertOne") {
    const document = asJsonObject(operationPayload.document);
    if (!document || Object.keys(document).length === 0) {
      return null;
    }
    return {
      action,
      collection,
      document
    };
  }

  if (action === "updateMany") {
    const filter = asJsonObject(operationPayload.filter) ?? {};
    const update = asJsonObject(operationPayload.update);
    if (!update || Object.keys(update).length === 0) {
      return null;
    }
    return {
      action,
      collection,
      filter,
      update
    };
  }

  const filter = asJsonObject(operationPayload.filter);
  if (!filter || Object.keys(filter).length === 0) {
    return null;
  }
  return {
    action,
    collection,
    filter
  };
};

const parseEnabledFlag = (value: string | undefined): boolean => {
  if (value == null) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return !(normalized === "false" || normalized === "0" || normalized === "no");
};

const getEnvConfig = (options: ResolveMongoOperationWithLlmOptions = {}) => {
  const enabled = options.forceEnabled ? true : parseEnabledFlag(process.env.LLM_ENABLED);
  const url = process.env.LLM_URL?.trim() || DEFAULT_LLM_URL;
  const model = options.model?.trim() || process.env.LLM_MODEL?.trim() || DEFAULT_LLM_MODEL;
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

  return {
    enabled,
    url,
    model,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS
  };
};

const buildTagsUrl = (llmUrl: string): string => {
  try {
    const parsed = new URL(llmUrl);
    parsed.pathname = "/api/tags";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "http://127.0.0.1:11434/api/tags";
  }
};

const buildPrompt = (input: string): string =>
  [
    "Convierte texto a una sola operacion MongoDB en JSON valido.",
    'Responde solo JSON, sin texto extra. Acciones permitidas: "find", "count", "insertOne", "updateMany", "deleteMany".',
    "Campos: action, collection y segun accion filter/projection/sort/limit/document/update.",
    "Si no puedes inferir con seguridad, devuelve un JSON vacio {}.",
    `Texto: ${input}`
  ].join("\n");

export const resolveMongoOperationWithLlm = async (
  input: string,
  options: ResolveMongoOperationWithLlmOptions = {}
): Promise<LlmMongoResolutionResult> => {
  const config = getEnvConfig(options);
  if (!config.enabled) {
    return {
      ok: false,
      error: "LLM deshabilitado. Configura LLM_ENABLED=true para habilitar demos con LLM."
    };
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        prompt: buildPrompt(input),
        stream: false,
        format: "json",
        options: {
          temperature: 0
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const message = await response.text();
      return {
        ok: false,
        error: `Error HTTP LLM (${response.status}): ${message || "sin detalle"}`
      };
    }

    const payload = (await response.json()) as { response?: string; error?: string };
    if (payload.error) {
      return {
        ok: false,
        error: `Error LLM: ${payload.error}`
      };
    }

    if (!payload.response) {
      return {
        ok: false,
        error: "El LLM no devolvio contenido."
      };
    }

    const jsonText = unwrapMarkdownJson(payload.response);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return {
        ok: false,
        error: "El LLM devolvio JSON invalido."
      };
    }

    const operation = buildMongoOperationFromLlmPayload(parsed);
    if (!operation) {
      return {
        ok: false,
        error: "No se pudo construir una operacion Mongo valida desde la salida del LLM."
      };
    }

    return {
      ok: true,
      operation,
      provider: "ollama",
      model: config.model
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        ok: false,
        error: "Timeout consultando el LLM."
      };
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido consultando el LLM."
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

export const listAvailableLlmModels = async (
  options: ResolveMongoOperationWithLlmOptions = {}
): Promise<{ ok: boolean; models: string[]; currentModel: string; error?: string }> => {
  const config = getEnvConfig(options);
  const tagsUrl = buildTagsUrl(config.url);

  try {
    const response = await fetch(tagsUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      return {
        ok: false,
        models: [],
        currentModel: config.model,
        error: `Error HTTP LLM (${response.status}) leyendo modelos locales.`
      };
    }

    const payload = (await response.json()) as { models?: Array<{ name?: string }> };
    const models =
      payload.models
        ?.map((entry) => entry.name?.trim() ?? "")
        .filter((entry) => entry.length > 0)
        .sort((left, right) => left.localeCompare(right)) ?? [];

    return {
      ok: true,
      models,
      currentModel: config.model
    };
  } catch (error) {
    return {
      ok: false,
      models: [],
      currentModel: config.model,
      error: error instanceof Error ? error.message : "No se pudieron cargar los modelos locales."
    };
  }
};
