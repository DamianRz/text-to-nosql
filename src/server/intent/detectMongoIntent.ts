import type { JsonObject, MongoIntent } from "@/types/mongo";
import { classifyAction } from "./actionClassifier";
import { classifyCollection } from "./collectionClassifier";
import { parseConditionalFilter } from "./conditionalFilterParser";
import { extractJsonBlocks } from "./jsonBlocks";
import { parseEmbeddedJson, processPropertyRemoval } from "./jsonEmbeddedParser";
import { preprocessInput } from "./preprocessInput";
import { detectFilters } from "./legacyCompat/detectFilters";
import { strictFilterSchema } from "./legacyCompat/strictFilterSchema";
import { detectTemporalExpressions } from "./temporal/detectTemporalExpressions";
import { parseTemporalExpression, type TemporalRange } from "./temporal/parseTemporalExpression";
import { confidenceFromSignals, detectLimit, detectProjection, detectSort, mergeFilters, parseWhereClause } from "./querySignalDetectors";

interface DetectionContext {
  temporalRange: TemporalRange | null;
  filter: JsonObject;
  projection?: JsonObject;
  sort?: JsonObject;
  limit?: number;
  embeddedJson: JsonObject | null;
  jsonBlocks: JsonObject[];
  signals: string[];
}

const detectTemporalRange = (text: string): TemporalRange | null => {
  const matches = detectTemporalExpressions(text);
  if (matches.length === 0) {
    return null;
  }

  return parseTemporalExpression(matches[0].match);
};

const buildContext = async (rawText: string, normalizedText: string): Promise<DetectionContext> => {
  const signals: string[] = [];
  const embedded = parseEmbeddedJson(rawText);
  const embeddedJson = embedded.json ? processPropertyRemoval(embedded.json, embedded.remainingText) : null;
  if (embeddedJson) {
    signals.push("embedded_json");
  }

  const jsonBlocks = embeddedJson ? [embeddedJson, ...extractJsonBlocks(rawText)] : extractJsonBlocks(rawText);
  if (jsonBlocks.length > 0) {
    signals.push("json_blocks");
  }

  const conditional = parseConditionalFilter(normalizedText);
  let filter: JsonObject = {};
  if (conditional.detected && conditional.filter) {
    filter = mergeFilters(filter, conditional.filter);
    signals.push("conditional_filter");
  } else {
    const whereFilter = parseWhereClause(normalizedText);
    if (Object.keys(whereFilter).length > 0) {
      filter = mergeFilters(filter, whereFilter);
      signals.push("where_clause");
    }
  }

  const legacyRawFilters = await detectFilters(rawText);
  const legacyFilters = strictFilterSchema(legacyRawFilters);
  const normalizedLegacyFilter: JsonObject = { ...(legacyFilters.filter as JsonObject) };
  if (typeof normalizedLegacyFilter.concept === "string") {
    if (normalizedLegacyFilter.category === undefined) {
      normalizedLegacyFilter.category = normalizedLegacyFilter.concept;
    }
    delete normalizedLegacyFilter.concept;
  }

  if (Object.keys(normalizedLegacyFilter).length > 0) {
    filter = mergeFilters(filter, normalizedLegacyFilter);
    signals.push("legacy_filter_parser");
  }

  const temporalRange = detectTemporalRange(normalizedText);
  if (temporalRange) {
    filter = mergeFilters(filter, {
      date: {
        $gte: temporalRange.from,
        $lte: temporalRange.to
      }
    });
    signals.push("temporal_range");
  }

  const projection = detectProjection(normalizedText);
  if (projection) {
    signals.push("projection");
  }

  const sort = detectSort(normalizedText);
  if (sort) {
    signals.push("sort");
  }

  const limit = detectLimit(normalizedText);
  if (limit) {
    signals.push("limit");
  }

  return {
    temporalRange,
    filter,
    projection,
    sort,
    limit,
    embeddedJson,
    jsonBlocks,
    signals
  };
};

export const detectMongoIntent = async (input: string): Promise<MongoIntent> => {
  const normalizedText = preprocessInput(input);
  const action = classifyAction(normalizedText) ?? undefined;
  const collection = classifyCollection(normalizedText) || "transactions";
  const context = await buildContext(input, normalizedText);

  return {
    domain: "mongo",
    rawText: input,
    normalizedText,
    action,
    collection,
    filter: context.filter,
    projection: context.projection,
    sort: context.sort,
    limit: context.limit,
    jsonBlocks: context.jsonBlocks,
    confidence: confidenceFromSignals(context.signals, action),
    signals: context.signals
  };
};
