import {
  ABSOLUTE_MONTH_REGEX,
  ABSOLUTE_WITH_TIME_REGEX,
  MONTH_ONLY_REGEX,
  NUMERIC_DATE_REGEX,
  RANGE_NUMERIC_REGEX,
  RANGE_OF_MONTH_REGEX,
  RELATIVE_PATTERNS,
  TIME_ONLY_REGEX,
  WEEKDAY_REGEX
} from "./patterns";
import { parseTemporalExpression } from "./parseTemporalExpression";

export interface TemporalMatch {
  match: string;
  index: number;
}

const isFalseManana = (fullText: string, candidate: string, index: number): boolean => {
  if (candidate !== "manana") {
    return false;
  }

  const before = fullText.slice(Math.max(0, index - 10), index).trim();
  return /\ben\s+la$/i.test(before);
};

const isGarbage = (value: string): boolean => /^\d+$/.test(value.trim()) || /^\d+\s+[a-z]{1,3}$/i.test(value.trim());

const pushIfValid = (target: TemporalMatch[], fullText: string, raw: string, index: number): void => {
  const normalized = raw.trim();

  if (!normalized || isGarbage(normalized) || isFalseManana(fullText, normalized, index)) {
    return;
  }

  if (!parseTemporalExpression(normalized)) {
    return;
  }

  target.push({ match: normalized, index });
};

const collectMatches = (text: string, regex: RegExp, target: TemporalMatch[]): void => {
  regex.lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match) {
    pushIfValid(target, text, match[0], match.index);
    match = regex.exec(text);
  }
};

export const detectTemporalExpressions = (message: string): TemporalMatch[] => {
  const text = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const found: TemporalMatch[] = [];
  let hasDate = false;

  collectMatches(text, RANGE_OF_MONTH_REGEX, found);
  collectMatches(text, RANGE_NUMERIC_REGEX, found);
  collectMatches(text, ABSOLUTE_WITH_TIME_REGEX, found);
  collectMatches(text, ABSOLUTE_MONTH_REGEX, found);
  collectMatches(text, MONTH_ONLY_REGEX, found);
  collectMatches(text, NUMERIC_DATE_REGEX, found);
  collectMatches(text, WEEKDAY_REGEX, found);

  if (found.length > 0) {
    hasDate = true;
  }

  for (const pattern of RELATIVE_PATTERNS) {
    const regex = typeof pattern === "string" ? new RegExp(`\\b${pattern}\\b`, "gi") : pattern;
    collectMatches(text, regex, found);
    if (found.length > 0) {
      hasDate = true;
    }
  }

  if (!hasDate) {
    collectMatches(text, TIME_ONLY_REGEX, found);
  }

  found.sort((a, b) => a.index - b.index);

  const withoutOverlap: TemporalMatch[] = [];
  for (const item of found) {
    const overlaps = withoutOverlap.some((entry) => item.index >= entry.index && item.index < entry.index + entry.match.length);
    if (!overlaps) {
      withoutOverlap.push(item);
    }
  }

  return withoutOverlap.sort((a, b) => b.match.length - a.match.length);
};
