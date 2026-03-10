import { chronoParse } from "./chronoParse";
import { parseAbsoluteDate } from "./parseAbsoluteDate";
import { semanticTemporalRules } from "./semanticTemporalRules";
import type { LegacyFilterPayload } from "./types";

const toIsoStart = (date: Date): string => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString();
const toIsoEnd = (date: Date): string => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).toISOString();

const emptyPayload = (): LegacyFilterPayload => ({
  filter: {},
  fields: {},
  values: {}
});

const mergeLegacyPayload = (base: LegacyFilterPayload, extra: LegacyFilterPayload): LegacyFilterPayload => ({
  filter: { ...base.filter, ...extra.filter },
  fields: { ...base.fields, ...extra.fields },
  values: { ...base.values, ...extra.values }
});

const detectConceptDeterministic = (text: string): string | null => {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const commonConcepts = [
    "comida",
    "hogar",
    "salud",
    "farmacia",
    "nafta",
    "transporte",
    "educacion",
    "ocio",
    "food",
    "health",
    "fuel"
  ];

  for (const concept of commonConcepts) {
    if (normalized.includes(concept)) {
      return concept;
    }
  }

  const match = normalized.match(/\b(?:de|en)\s+([a-z_]{3,})\b/);
  if (!match) {
    return null;
  }

  const candidate = match[1];
  const blocked = new Set(["transactions", "transacciones", "gastos", "movimientos", "users", "users"]);
  if (blocked.has(candidate)) {
    return null;
  }

  return candidate;
};

const toPayloadFromDateRange = (from: string, to: string): LegacyFilterPayload => ({
  filter: {
    date: {
      from,
      to
    }
  },
  fields: {},
  values: {}
});

export const detectFilters = async (userMessage: string): Promise<LegacyFilterPayload> => {
  let output = emptyPayload();

  const semantic = await semanticTemporalRules(userMessage);
  if (semantic) {
    output = mergeLegacyPayload(output, toPayloadFromDateRange(toIsoStart(semantic.from), toIsoEnd(semantic.to)));
  }

  const absolute = parseAbsoluteDate(userMessage);
  if (absolute?.filter?.date?.from && absolute.filter.date.to) {
    output = mergeLegacyPayload(output, toPayloadFromDateRange(absolute.filter.date.from, absolute.filter.date.to));
  }

  const chrono = await chronoParse(userMessage);
  if (chrono?.filter?.date?.from && chrono.filter.date.to) {
    output = mergeLegacyPayload(output, toPayloadFromDateRange(chrono.filter.date.from, chrono.filter.date.to));
  }

  const concept = detectConceptDeterministic(userMessage);
  if (concept) {
    output = mergeLegacyPayload(output, {
      filter: { concept },
      fields: {},
      values: {}
    });
  }

  return output;
};

