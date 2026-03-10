import type { LegacyFilterPayload } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeDateField = (value: unknown): Record<string, unknown> | undefined => {
  if (typeof value === "string") {
    return {
      $gte: new Date(value).toISOString(),
      $lte: new Date(value).toISOString()
    };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  if (typeof value.$gte === "string" && typeof value.$lte === "string") {
    return { $gte: value.$gte, $lte: value.$lte };
  }

  if (typeof value.from === "string" && typeof value.to === "string") {
    return { $gte: value.from, $lte: value.to };
  }

  return undefined;
};

export const strictFilterSchema = (data: unknown): LegacyFilterPayload => {
  const output: LegacyFilterPayload = {
    filter: {},
    fields: {},
    values: {}
  };

  if (!isRecord(data)) {
    return output;
  }

  if (isRecord(data.filter)) {
    if (typeof data.filter.concept === "string" && data.filter.concept.trim()) {
      output.filter.concept = data.filter.concept.trim();
    }

    const normalizedDate = normalizeDateField(data.filter.date);
    if (normalizedDate) {
      output.filter.date = normalizedDate;
    }

    if (typeof data.filter.time === "string" && /^\d{2}:\d{2}$/.test(data.filter.time)) {
      output.filter.time = data.filter.time;
    }
  }

  if (isRecord(data.fields)) {
    output.fields = Object.fromEntries(Object.entries(data.fields).filter(([, value]) => value !== "" && value != null));
  }

  if (isRecord(data.values)) {
    output.values = Object.fromEntries(Object.entries(data.values).filter(([, value]) => value !== "" && value != null));
  }

  return output;
};

