import type { JsonObject } from "@/types/mongo";

const tryParseJson = (raw: string): JsonObject | null => {
  try {
    return JSON.parse(raw) as JsonObject;
  } catch {
    return null;
  }
};

export const extractJsonBlocks = (input: string): JsonObject[] => {
  const blocks: JsonObject[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char === "\\" && inString && !escaped) {
      escaped = true;
      continue;
    }

    if (char === "\"" && !escaped) {
      inString = !inString;
    }

    escaped = false;

    if (inString) {
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        start = index;
      }
      depth += 1;
      continue;
    }

    if (char === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const raw = input.slice(start, index + 1);
        const parsed = tryParseJson(raw);
        if (parsed) {
          blocks.push(parsed);
        }
        start = -1;
      }
    }
  }

  return blocks;
};
