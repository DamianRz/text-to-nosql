import type { JsonObject, MongoOperation } from "@/types/mongo";

const parseScalar = (rawValue: string): unknown => {
  const value = rawValue.trim().replace(/^["']|["']$/g, "");
  const lower = value.toLowerCase();

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  const leadingNumber = value.match(/^-?\d+(\.\d+)?/);
  if (leadingNumber?.[0]) {
    return Number(leadingNumber[0]);
  }

  if (lower === "true") {
    return true;
  }

  if (lower === "false") {
    return false;
  }

  if (lower === "null") {
    return null;
  }

  return value;
};

const parseCondition = (token: string): JsonObject | null => {
  const match = token.trim().match(/^([a-zA-Z_][\w.]*)\s*(>=|<=|!=|==|=|>|<)\s*(.+)$/);
  if (!match) {
    return null;
  }

  const [, field, operator, rawValue] = match;
  const value = parseScalar(rawValue);

  if (operator === "=" || operator === "==") {
    return { [field]: value };
  }

  if (operator === "!=") {
    return { [field]: { $ne: value } };
  }

  if (operator === ">") {
    return { [field]: { $gt: value } };
  }

  if (operator === ">=") {
    return { [field]: { $gte: value } };
  }

  if (operator === "<") {
    return { [field]: { $lt: value } };
  }

  return { [field]: { $lte: value } };
};

export const mergeFilters = (base: JsonObject, extra: JsonObject): JsonObject => {
  const merged: JsonObject = { ...base };

  for (const [key, value] of Object.entries(extra)) {
    if (merged[key] === undefined) {
      merged[key] = value;
      continue;
    }

    const currentValue = merged[key];
    if (JSON.stringify(currentValue) === JSON.stringify(value)) {
      continue;
    }

    if (typeof currentValue === "object" && currentValue !== null && typeof value === "object" && value !== null) {
      merged[key] = { ...(currentValue as JsonObject), ...(value as JsonObject) };
      continue;
    }

    merged.$and = Array.isArray(merged.$and) ? [...(merged.$and as unknown[]), { [key]: value }] : [{ [key]: currentValue }, { [key]: value }];
    delete merged[key];
  }

  return merged;
};

export const parseWhereClause = (text: string): JsonObject => {
  const whereMatch = text.match(/\b(?:donde|where)\s+(.+)$/i);
  if (!whereMatch) {
    return {};
  }

  const rawClause = whereMatch[1]
    .replace(/\b(ordenad[oa]s?|sorted|solo|only|solamente|limite|limit|top|first|last)\b.*/i, "")
    .trim();
  if (!rawClause) {
    return {};
  }

  const orGroups = rawClause
    .split(/\s+(?:o|or)\s+/i)
    .map((group) => group.trim())
    .filter(Boolean);

  if (orGroups.length > 1) {
    const parsedOr = orGroups
      .map((group) => {
        const andConditions = group
          .split(/\s+(?:y|and)\s+/i)
          .map((part) => parseCondition(part))
          .filter((entry): entry is JsonObject => Boolean(entry));

        if (andConditions.length === 0) {
          return null;
        }

        return andConditions.reduce<JsonObject>((acc, item) => mergeFilters(acc, item), {});
      })
      .filter((entry): entry is JsonObject => Boolean(entry));

    if (parsedOr.length > 0) {
      return { $or: parsedOr };
    }
  }

  const andConditions = rawClause
    .split(/\s+(?:y|and)\s+/i)
    .map((part) => parseCondition(part))
    .filter((entry): entry is JsonObject => Boolean(entry));

  return andConditions.reduce<JsonObject>((acc, item) => mergeFilters(acc, item), {});
};

export const detectLimit = (text: string): number | undefined => {
  const match = text.match(/\b(?:limite|limit|top|primeros?|ultimos?|first|last)\s+(\d+)\b/i);
  if (!match) {
    return undefined;
  }

  const limit = Number(match[1]);
  return Number.isFinite(limit) && limit > 0 ? limit : undefined;
};

export const detectSort = (text: string): JsonObject | undefined => {
  const match = text.match(
    /\b(?:ordenad[oa]s?\s+por|sorted\s+by)\s+([a-zA-Z_][\w.]*)\s*(asc|desc|ascendente|descendente|ascending|descending)?\b/i
  );

  if (!match) {
    return undefined;
  }

  const direction = match[2] && /desc/i.test(match[2]) ? -1 : 1;
  return { [match[1]]: direction };
};

export const detectProjection = (text: string): JsonObject | undefined => {
  const match = text.match(
    /\b(?:solo|only|solamente|fields?|campos?)\s+([a-zA-Z0-9_,\s]+?)(?=\s+(?:ordenad[oa]s?|sorted|limite|limit|top|donde|where)\b|$)/i
  );

  if (!match) {
    return undefined;
  }

  const fields = match[1]
    .split(/,|\s(?:y|and)\s/i)
    .map((field) => field.trim())
    .filter((field) => /^[a-zA-Z_][\w.]*$/.test(field));

  if (fields.length === 0) {
    return undefined;
  }

  return fields.reduce<JsonObject>((projection, field) => ({ ...projection, [field]: 1 }), {});
};

export const confidenceFromSignals = (signals: string[], action: MongoOperation["action"] | undefined): number => {
  const base = action ? 0.45 : 0.15;
  const signalBonus = Math.min(0.5, signals.length * 0.1);
  return Number(Math.min(0.99, base + signalBonus).toFixed(2));
};
