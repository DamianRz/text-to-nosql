import { detectTemporalExpressions } from "../temporal/detectTemporalExpressions";
import { parseTemporalExpression } from "../temporal/parseTemporalExpression";
import { normalizeTemporalLLM } from "./normalizeTemporalLLM";
import { parseAbsoluteDate } from "./parseAbsoluteDate";
import { temporalPostValidator } from "./temporalPostValidator";
import type { LegacyTemporalParseResult } from "./types";

const fromRange = (original: string, normalized: string, from: string, to: string): LegacyTemporalParseResult => ({
  original,
  normalized,
  filter: {
    date: {
      from,
      to
    }
  }
});

const parseFromText = (original: string, textToParse: string): LegacyTemporalParseResult | null => {
  const matches = detectTemporalExpressions(textToParse);
  for (const entry of matches) {
    const parsed = parseTemporalExpression(entry.match);
    if (parsed) {
      return fromRange(original, textToParse, parsed.from, parsed.to);
    }
  }

  const direct = parseTemporalExpression(textToParse);
  if (!direct) {
    return null;
  }

  return fromRange(original, textToParse, direct.from, direct.to);
};

export const chronoParse = async (input: string): Promise<LegacyTemporalParseResult | null> => {
  const absolute = parseAbsoluteDate(input);
  const absoluteValidated = temporalPostValidator(absolute);
  if (absoluteValidated) {
    return absoluteValidated;
  }

  const direct = parseFromText(input, input);
  const directValidated = temporalPostValidator(direct);
  if (directValidated) {
    return directValidated;
  }

  const normalizedByLlm = await normalizeTemporalLLM(input);
  if (normalizedByLlm !== input) {
    const llmParsed = parseFromText(input, normalizedByLlm);
    const llmValidated = temporalPostValidator(llmParsed);
    if (llmValidated) {
      return llmValidated;
    }
  }

  return null;
};

