export interface LegacyFilterPayload {
  filter: Record<string, unknown>;
  fields: Record<string, unknown>;
  values: Record<string, unknown>;
}

export interface LegacyTemporalParseResult {
  original: string;
  normalized: string;
  filter: {
    date: {
      from: string;
      to: string;
    };
  };
}

