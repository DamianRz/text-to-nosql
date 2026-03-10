import type { JsonObject } from "@/types/mongo";

export interface EmbeddedJsonResult {
  json: JsonObject | null;
  remainingText: string;
}

const relaxJson = (value: string): string => {
  let relaxed = value.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  relaxed = relaxed.replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":');
  relaxed = relaxed.replace(/:\s*'([^']*)'/g, ': "$1"');
  return relaxed;
};

export const parseEmbeddedJson = (text: string): EmbeddedJsonResult => {
  if (!text) {
    return { json: null, remainingText: "" };
  }

  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  let startIndex = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIndex = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  if (startIndex === -1) {
    return { json: null, remainingText: text };
  }

  let endIndex = -1;
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        braceCount += 1;
      } else if (char === "}") {
        braceCount -= 1;
      } else if (char === "[") {
        bracketCount += 1;
      } else if (char === "]") {
        bracketCount -= 1;
      }

      if (braceCount === 0 && bracketCount === 0) {
        endIndex = index;
        break;
      }
    }
  }

  if (endIndex === -1) {
    return { json: null, remainingText: text };
  }

  const candidate = text.slice(startIndex, endIndex + 1);
  let parsed: JsonObject | null = null;

  try {
    parsed = JSON.parse(candidate) as JsonObject;
  } catch {
    try {
      parsed = JSON.parse(relaxJson(candidate)) as JsonObject;
    } catch {
      parsed = null;
    }
  }

  if (!parsed) {
    return { json: null, remainingText: text };
  }

  const remainingText = `${text.slice(0, startIndex)} ${text.slice(endIndex + 1)}`
    .replace(/\s+/g, " ")
    .trim();

  return {
    json: parsed,
    remainingText
  };
};

export const processPropertyRemoval = (json: JsonObject, text: string): JsonObject => {
  if (!text || !json || typeof json !== "object" || Array.isArray(json)) {
    return json;
  }

  const mutable: JsonObject = { ...json };
  const regex = /(?:eliminar|borrar|quitar|remover)\s+(?:la\s+)?(?:propiedad|campo|atributo)\s+([a-zA-Z_]\w*)/gi;

  let match: RegExpExecArray | null = regex.exec(text);
  while (match) {
    const target = match[1];
    if (target in mutable) {
      delete mutable[target];
    } else {
      const sameKey = Object.keys(mutable).find((key) => key.toLowerCase() === target.toLowerCase());
      if (sameKey) {
        delete mutable[sameKey];
      }
    }
    match = regex.exec(text);
  }

  return mutable;
};
