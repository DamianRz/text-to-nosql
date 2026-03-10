import type { LegacyTemporalParseResult } from "./types";

const TEMPORAL_TOKENS = [
  "yesterday",
  "today",
  "tomorrow",
  "next",
  "last",
  "ago",
  "day",
  "days",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
  "ayer",
  "hoy",
  "manana",
  "anteayer",
  "semana",
  "mes",
  "ano",
  "finde",
  "weekend",
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

const FORBIDDEN_TOKENS = ["log", "register", "write", "coffee", "food", "expense", "items"];

const extractNumbers = (value: string): number[] => (value.match(/\d+/g) ?? []).map((item) => Number(item));

const looksTemporal = (value: string): boolean => {
  const normalized = value.toLowerCase();
  if (!TEMPORAL_TOKENS.some((token) => normalized.includes(token))) {
    return false;
  }
  return !FORBIDDEN_TOKENS.some((token) => normalized.includes(token));
};

const isValidRange = (from: string, to: string): boolean => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return false;
  }

  if (fromDate.getTime() > toDate.getTime()) {
    return false;
  }

  const diff = toDate.getTime() - fromDate.getTime();
  if (diff < 12 * 60 * 60 * 1000) {
    return false;
  }

  const maxRange = 5 * 365 * 24 * 60 * 60 * 1000;
  return diff <= maxRange;
};

export const temporalPostValidator = (raw: LegacyTemporalParseResult | null): LegacyTemporalParseResult | null => {
  if (!raw) {
    return null;
  }

  const normalized = raw.normalized?.toLowerCase() ?? "";
  const original = raw.original?.toLowerCase() ?? "";

  if (!looksTemporal(normalized) && !looksTemporal(original)) {
    return null;
  }

  const normalizedNumbers = extractNumbers(normalized);
  const originalNumbers = extractNumbers(original);
  const inventedNumber = normalizedNumbers.some((value) => !originalNumbers.includes(value));
  if (inventedNumber) {
    return null;
  }

  const dateRange = raw.filter?.date;
  if (!dateRange) {
    return null;
  }

  if (!isValidRange(dateRange.from, dateRange.to)) {
    return null;
  }

  return raw;
};

