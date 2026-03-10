import type { JsonObject } from "@/types/mongo";

export interface ConditionalFilterResult {
  filter: JsonObject | null;
  remainingText: string;
  detected: boolean;
}

const parseValue = (rawValue: string): number | string | boolean | null => {
  const trimmed = rawValue.trim().replace(/^["']|["']$/g, "");
  const normalized = trimmed.toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  if (normalized === "null") {
    return null;
  }

  const numericCandidate = trimmed.replace(/[^0-9.-]/g, "");
  if (numericCandidate && numericCandidate !== "-" && numericCandidate !== ".") {
    const value = Number(numericCandidate);
    if (!Number.isNaN(value)) {
      return value;
    }
  }

  return trimmed;
};

const buildMongoFilter = (field: string, operator: string, value: unknown): JsonObject => {
  if (operator === "=" || operator === "==") {
    return { [field]: value };
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

  if (operator === "<=") {
    return { [field]: { $lte: value } };
  }

  if (operator === "!=") {
    return { [field]: { $ne: value } };
  }

  return { [field]: value };
};

const mergeFilterObjects = (filters: JsonObject[]): JsonObject => {
  if (filters.length === 1) {
    return filters[0];
  }

  const merged: JsonObject = {};
  const collided: JsonObject[] = [];

  for (const filter of filters) {
    const [key] = Object.keys(filter);
    if (!key) {
      continue;
    }

    if (merged[key] !== undefined) {
      collided.push(filter);
    } else {
      merged[key] = filter[key];
    }
  }

  if (collided.length === 0) {
    return merged;
  }

  return { $and: [merged, ...collided] };
};

export const parseConditionalFilter = (text: string): ConditionalFilterResult => {
  if (!text) {
    return { filter: null, remainingText: "", detected: false };
  }

  const connectorMatch = text.match(/\b(?:cuando|donde|con|que|where|when|with)\s+(.+)$/i);
  if (!connectorMatch) {
    return { filter: null, remainingText: text, detected: false };
  }

  const clause = connectorMatch[1]
    .replace(/\b(?:ordenad[oa]s?|sorted|solo|only|solamente|limite|limit|top|first|last)\b.*$/i, "")
    .trim();
  if (!clause) {
    return { filter: null, remainingText: text, detected: false };
  }

  const parts = clause
    .split(/\s+(?:y|and)\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const matches: JsonObject[] = [];

  for (const part of parts) {
    const parsed = part.match(/^([a-zA-Z_][a-zA-Z0-9_.]*)\s*(>=|<=|==|!=|=|>|<)\s*(.+)$/);
    if (!parsed) {
      continue;
    }
    matches.push(buildMongoFilter(parsed[1], parsed[2], parseValue(parsed[3])));
  }

  if (matches.length === 0) {
    return { filter: null, remainingText: text, detected: false };
  }

  const remainingText = text.replace(connectorMatch[0], " ").replace(/\s+/g, " ").trim();

  return {
    filter: mergeFilterObjects(matches),
    remainingText,
    detected: true
  };
};
