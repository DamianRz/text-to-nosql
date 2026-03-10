import { COLLECTION_ALIAS, COLLECTION_BLOCKLIST, COLLECTION_CANDIDATES } from "./constants";

const normalizeToken = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const blocklist = new Set(COLLECTION_BLOCKLIST.map(normalizeToken));
const dictionaryCollections = new Set(COLLECTION_CANDIDATES.map(normalizeToken));

const tokenize = (text: string): string[] =>
  text
    .split(/\s+/)
    .map((token) => normalizeToken(token.replace(/[^\w]/g, "")))
    .filter(Boolean);

const isValidCandidate = (value: string): boolean =>
  Boolean(value) &&
  !blocklist.has(value) &&
  !/^\d+$/.test(value) &&
  /[a-z]/i.test(value);

const semanticNounClassifier = (text: string): string | null => {
  const words = tokenize(text);

  for (let index = 0; index < words.length - 1; index += 1) {
    if (words[index] === "en" || words[index] === "de" || words[index] === "sobre") {
      const candidate = words[index + 1];
      if (isValidCandidate(candidate)) {
        return candidate;
      }
    }
  }

  const lastWord = words[words.length - 1];
  if (isValidCandidate(lastWord)) {
    return lastWord;
  }

  return words.find((token) => isValidCandidate(token)) ?? null;
};

export const classifyCollection = (text: string): string => {
  const normalized = normalizeToken(text);

  const explicit = normalized.match(/\b(?:en|de|sobre|coleccion|in|from)\s+([a-z_][\w-]*)\b/);
  if (explicit?.[1]) {
    return COLLECTION_ALIAS[explicit[1]] ?? explicit[1];
  }

  const tokens = tokenize(normalized);
  const dictionaryHit = tokens.find((token) => dictionaryCollections.has(token));
  if (dictionaryHit) {
    return COLLECTION_ALIAS[dictionaryHit] ?? dictionaryHit;
  }

  const semantic = semanticNounClassifier(normalized);
  if (semantic) {
    return COLLECTION_ALIAS[semantic] ?? semantic;
  }

  return "transactions";
};
