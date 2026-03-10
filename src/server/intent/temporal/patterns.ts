export const RELATIVE_PATTERNS: Array<RegExp | string> = [
  /\bpasado\s+manana\b/gi,
  /\b(?:ultimo|pasado)\s+finde\b/gi,
  /\bfinde\s+pasado\b/gi,
  /\b(?:ultimo|pasado)\s+fin\s+de\s+semana\b/gi,
  /\bfin\s+de\s+semana\s+(?:pasado|anterior)\b/gi,
  /\blast\s+weekend\b/gi,
  /\bsemana\s+pasada\b/gi,
  /\bsemana\s+que\s+viene\b/gi,
  /\besta\s+semana\b/gi,
  /\bmes\s+pasado\b/gi,
  /\bmes\s+que\s+viene\b/gi,
  /\beste\s+mes\b/gi,
  /\bhace\s+(\d+|un|una)\s+(dia|dias|semana|semanas|mes|meses|ano|anos)\b/gi,
  /\bdentro\s+de\s+(?:un|una|\d+)\s+(dia|dias|semana|semanas|mes|meses|ano|anos)\b/gi,
  /\bhoy\b/gi,
  /\bayer\b/gi,
  /\banteayer\b/gi,
  /\bmanana\b/gi
];

export const ABSOLUTE_MONTH_REGEX = /\b(\d{1,2})\s*(?:de)?\s*([a-z]+)(?:\s+(?:de\s*)?(\d{2,4}))?\b/gi;

export const ABSOLUTE_WITH_TIME_REGEX =
  /\b(\d{1,2})\s*(?:de)?\s*([a-z]+)(?:\s+(?:de\s*)?(\d{2,4}))?(?:\s+a\s+las\s+(\d{1,2})(?::(\d{1,2}))?)\b/gi;

export const MONTH_ONLY_REGEX =
  /\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/gi;

export const TIME_ONLY_REGEX = /\b(?:a\s+las\s+)?(\d{1,2})(?::(\d{1,2}))\b/gi;

export const NUMERIC_DATE_REGEX = /\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/gi;

export const RANGE_OF_MONTH_REGEX =
  /\b(?:entre|del)?\s*(?:el\s*)?(\d{1,2})\s*(?:al|a|hasta|y)\s*(\d{1,2})\s*(?:de\s+([a-z]+))\b/gi;

export const RANGE_NUMERIC_REGEX =
  /\b(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\s*(?:al|a|hasta|y)\s*(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\b/gi;

export const WEEKDAY_REGEX =
  /\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)(?:\s+(pasado|proximo|este|esta))?\b/gi;
