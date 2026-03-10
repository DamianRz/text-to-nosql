import { MONTH_NAME_TO_INDEX } from "../constants";
import type { LegacyTemporalParseResult } from "./types";

const buildDayRange = (start: Date, end: Date): LegacyTemporalParseResult["filter"]["date"] => {
  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0).toISOString();
  const to = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).toISOString();
  return { from, to };
};

const monthToIndex = (token: string): number | null => {
  if (!token) {
    return null;
  }

  const normalized = token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  return MONTH_NAME_TO_INDEX[normalized] ?? null;
};

const parseYear = (raw: string | undefined, fallback: number): number => {
  if (!raw) {
    return fallback;
  }

  if (raw.length === 2) {
    return Number(`20${raw}`);
  }

  return Number(raw);
};

export const parseAbsoluteDate = (input: string): LegacyTemporalParseResult | null => {
  if (!input?.trim()) {
    return null;
  }

  const text = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const now = new Date();

  const yearOnly = text.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearOnly) {
    const year = Number(yearOnly[1]);
    return {
      original: input,
      normalized: text,
      filter: {
        date: buildDayRange(new Date(year, 0, 1), new Date(year, 11, 31))
      }
    };
  }

  let match = text.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = parseYear(match[3], now.getFullYear());
    const date = new Date(year, month, day);

    return {
      original: input,
      normalized: text,
      filter: {
        date: buildDayRange(date, date)
      }
    };
  }

  match = text.match(/\b(?:from|del?|entre)?\s*(\d{1,2})\s*(?:to|al|a|hasta|y)\s*(\d{1,2})\s*(?:de|of)?\s*([a-z]+)\b/i);
  if (match) {
    const startDay = Number(match[1]);
    const endDay = Number(match[2]);
    const month = monthToIndex(match[3]);
    if (month != null) {
      return {
        original: input,
        normalized: text,
        filter: {
          date: buildDayRange(new Date(now.getFullYear(), month, startDay), new Date(now.getFullYear(), month, endDay))
        }
      };
    }
  }

  match = text.match(/\b(\d{1,2})\s*(?:de|of)?\s*([a-z]+)(?:\s*(?:de)?\s*(\d{2,4}))?\b/i);
  if (match) {
    const day = Number(match[1]);
    const month = monthToIndex(match[2]);
    if (month != null) {
      const year = parseYear(match[3], now.getFullYear());
      const date = new Date(year, month, day);
      return {
        original: input,
        normalized: text,
        filter: {
          date: buildDayRange(date, date)
        }
      };
    }
  }

  match = text.match(/\b([a-z]+)\s+(19\d{2}|20\d{2})\b/);
  if (match) {
    const month = monthToIndex(match[1]);
    const year = Number(match[2]);
    if (month != null) {
      return {
        original: input,
        normalized: text,
        filter: {
          date: buildDayRange(new Date(year, month, 1), new Date(year, month + 1, 0))
        }
      };
    }
  }

  match = text.match(/\b([a-z]+)\b/);
  if (match) {
    const month = monthToIndex(match[1]);
    if (month != null) {
      return {
        original: input,
        normalized: text,
        filter: {
          date: buildDayRange(new Date(now.getFullYear(), month, 1), new Date(now.getFullYear(), month + 1, 0))
        }
      };
    }
  }

  match = text.match(/\b(\d{1,2})\s*(?:al|a|hasta|to|until)\s*(\d{1,2})\b/i);
  if (match) {
    const startDay = Number(match[1]);
    const endDay = Number(match[2]);
    return {
      original: input,
      normalized: text,
      filter: {
        date: buildDayRange(
          new Date(now.getFullYear(), now.getMonth(), startDay),
          new Date(now.getFullYear(), now.getMonth(), endDay)
        )
      }
    };
  }

  return null;
};

