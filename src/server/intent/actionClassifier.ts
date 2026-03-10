import type { MongoAction } from "@/types/mongo";
import { ACTION_VERB_MAP } from "./constants";
import { detectTemporalExpressions } from "./temporal/detectTemporalExpressions";

const normalizeToken = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tokenize = (value: string): string[] =>
  value
    .split(/\s+/)
    .map((token) => normalizeToken(token.replace(/[^\w]/g, "")))
    .filter(Boolean);

const detectByVerbMap = (text: string): MongoAction | null => {
  for (const action of Object.keys(ACTION_VERB_MAP) as MongoAction[]) {
    for (const verb of ACTION_VERB_MAP[action]) {
      const pattern = new RegExp(`\\b${normalizeToken(verb)}\\b`, "i");
      if (pattern.test(text)) {
        return action;
      }
    }
  }

  return null;
};

const detectByQuestionHeuristic = (text: string): MongoAction | null => {
  const hasQuestion = /\bcuanto|cuantos|cuantas|total\b/i.test(text);
  if (!hasQuestion) {
    return null;
  }

  if (/\bcuantos|cuantas\b/i.test(text)) {
    return "count";
  }

  return "find";
};

const detectNumericInsertHint = (text: string): MongoAction | null => {
  const temporalMatches = detectTemporalExpressions(text);
  const ranges = temporalMatches.map((entry) => ({
    from: entry.index,
    to: entry.index + entry.match.length
  }));

  const numericRegex = /\d+/g;
  let numericMatch: RegExpExecArray | null = numericRegex.exec(text);

  while (numericMatch) {
    const start = numericMatch.index;
    const end = start + numericMatch[0].length;
    const insideTemporal = ranges.some((range) => start >= range.from && end <= range.to);
    if (!insideTemporal) {
      return "insertOne";
    }
    numericMatch = numericRegex.exec(text);
  }

  return null;
};

export const classifyAction = (text: string): MongoAction | null => {
  const normalized = normalizeToken(text).trim();
  if (!normalized) {
    return null;
  }

  const byVerb = detectByVerbMap(normalized);
  if (byVerb) {
    return byVerb;
  }

  const byQuestion = detectByQuestionHeuristic(normalized);
  if (byQuestion) {
    return byQuestion;
  }

  const tokens = tokenize(normalized);
  if (tokens.includes("donde") || tokens.includes("filtra")) {
    return "find";
  }

  return detectNumericInsertHint(normalized);
};
