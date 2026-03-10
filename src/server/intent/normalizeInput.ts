import { NORMALIZE_FILLER_WORDS, NORMALIZE_NUM_WORD_MAP } from "./constants";

export const normalizeInput = (raw: string): string => {
  if (!raw) {
    return "";
  }

  let text = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  for (const fillerWord of NORMALIZE_FILLER_WORDS) {
    const pattern = new RegExp(`\\b${fillerWord}\\b`, "gi");
    text = text.replace(pattern, " ").replace(/\s+/g, " ").trim();
  }

  text = text
    .replace(/\bluego\b/g, " y luego ")
    .replace(/\bdespues\b/g, " y despues ")
    .replace(/\$/g, " uy ")
    .replace(/\bpesos?\b/g, "uy")
    .replace(/\bdolares?\b/g, "usd")
    .replace(/\s+/g, " ")
    .trim();

  for (const [word, value] of Object.entries(NORMALIZE_NUM_WORD_MAP)) {
    const pattern = new RegExp(`\\b${word}\\b`, "gi");
    text = text.replace(pattern, value);
  }

  return text.replace(/\s+/g, " ").trim();
};
