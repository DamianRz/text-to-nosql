import { MONTHS, WEEKDAYS, applyTimeToDate, cloneDate, isValidDate, toEndOfDay } from "./helpers";
import {
  applyExtractedTime,
  endOfMonth,
  endOfWeek,
  lastWeekendRange,
  normalizeUnit,
  oneDay,
  oneMoment,
  parseYear,
  range,
  startOfMonth,
  startOfWeek,
  type TemporalRangeShape
} from "./rangeHelpers";

export type TemporalRange = TemporalRangeShape;

export const parseTemporalExpression = (text: string): TemporalRange | null => {
  if (!text) {
    return null;
  }

  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  const now = new Date();

  let extractedHour: number | null = null;
  let extractedMinute: number | null = null;

  const hourMatch =
    normalizedText.match(/\ba\s+las\s+(\d{1,2})(?::(\d{1,2}))?/) ?? normalizedText.match(/\b(\d{1,2}):(\d{1,2})\b/);

  if (hourMatch) {
    extractedHour = Number(hourMatch[1]);
    extractedMinute = hourMatch[2] ? Number(hourMatch[2]) : 0;
  }

  let match = normalizedText.match(
    /(?:entre|del)?\s*(?:el\s*)?(\d{1,2})\s*(?:al|a|hasta|y)\s*(\d{1,2})\s*de\s+([a-z]+)/i
  );
  if (match && MONTHS[match[3]] !== undefined) {
    const month = MONTHS[match[3]];
    return range(new Date(now.getFullYear(), month, Number(match[1])), new Date(now.getFullYear(), month, Number(match[2])));
  }

  match = normalizedText.match(
    /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\s*(?:al|a|hasta|y)\s*(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i
  );
  if (match) {
    const fromDate = new Date(parseYear(match[3], now.getFullYear()), Number(match[2]) - 1, Number(match[1]));
    const toDate = new Date(parseYear(match[6], now.getFullYear()), Number(match[5]) - 1, Number(match[4]));
    return range(fromDate, toDate);
  }

  if (normalizedText === "hoy") {
    return oneDay(now);
  }

  if (normalizedText === "ayer") {
    const date = cloneDate(now);
    date.setDate(date.getDate() - 1);
    return oneDay(date);
  }

  if (normalizedText === "anteayer") {
    const date = cloneDate(now);
    date.setDate(date.getDate() - 2);
    return oneDay(date);
  }

  if (normalizedText === "manana") {
    const date = cloneDate(now);
    date.setDate(date.getDate() + 1);
    const moment = applyExtractedTime(date, extractedHour, extractedMinute);
    return moment ?? oneDay(date);
  }

  if (normalizedText === "pasado manana") {
    const date = cloneDate(now);
    date.setDate(date.getDate() + 2);
    const moment = applyExtractedTime(date, extractedHour, extractedMinute);
    return moment ?? oneDay(date);
  }

  if (
    /\b(last\s+weekend|ultimo\s+finde|finde\s+pasado|ultimo\s+fin\s+de\s+semana|fin\s+de\s+semana\s+(pasado|anterior))\b/.test(
      normalizedText
    )
  ) {
    return lastWeekendRange(now);
  }

  if (normalizedText === "esta semana") {
    return { from: startOfWeek(now), to: endOfWeek(now) };
  }

  if (normalizedText === "semana pasada") {
    const date = cloneDate(now);
    date.setDate(date.getDate() - 7);
    return { from: startOfWeek(date), to: endOfWeek(date) };
  }

  if (normalizedText === "semana que viene") {
    const date = cloneDate(now);
    date.setDate(date.getDate() + 7);
    return { from: startOfWeek(date), to: endOfWeek(date) };
  }

  if (normalizedText === "este mes") {
    return { from: startOfMonth(now.getFullYear(), now.getMonth()), to: endOfMonth(now.getFullYear(), now.getMonth()) };
  }

  if (normalizedText === "mes pasado") {
    const date = cloneDate(now);
    date.setMonth(date.getMonth() - 1);
    return { from: startOfMonth(date.getFullYear(), date.getMonth()), to: endOfMonth(date.getFullYear(), date.getMonth()) };
  }

  if (normalizedText === "mes que viene") {
    const date = cloneDate(now);
    date.setMonth(date.getMonth() + 1);
    return { from: startOfMonth(date.getFullYear(), date.getMonth()), to: endOfMonth(date.getFullYear(), date.getMonth()) };
  }

  match = normalizedText.match(/hace\s+(un|una|\d+)\s+(dia|dias|semana|semanas|mes|meses|ano|anos)/);
  if (match) {
    const amount = match[1] === "un" || match[1] === "una" ? 1 : Number(match[1]);
    const unit = normalizeUnit(match[2]);
    const date = cloneDate(now);

    if (unit === "day") {
      date.setDate(date.getDate() - amount);
    } else if (unit === "week") {
      date.setDate(date.getDate() - amount * 7);
    } else if (unit === "month") {
      date.setMonth(date.getMonth() - amount);
    } else if (unit === "year") {
      date.setFullYear(date.getFullYear() - amount);
    }

    return oneDay(date);
  }

  match = normalizedText.match(/dentro\s+de\s+(un|una|\d+)\s+(dia|dias|semana|semanas|mes|meses|ano|anos)/);
  if (match) {
    const amount = match[1] === "un" || match[1] === "una" ? 1 : Number(match[1]);
    const unit = normalizeUnit(match[2]);
    const date = cloneDate(now);

    if (unit === "day") {
      date.setDate(date.getDate() + amount);
    } else if (unit === "week") {
      date.setDate(date.getDate() + amount * 7);
    } else if (unit === "month") {
      date.setMonth(date.getMonth() + amount);
    } else if (unit === "year") {
      date.setFullYear(date.getFullYear() + amount);
    }

    return oneDay(date);
  }

  if (normalizedText.startsWith("desde ")) {
    const inner = normalizedText.replace("desde ", "").trim();
    const parsed = parseTemporalExpression(inner);
    if (parsed) {
      return { from: parsed.from, to: toEndOfDay(now) };
    }
  }

  match = normalizedText.match(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)(?:\s+(pasado|proximo|este|esta))?\b/);
  if (match) {
    const day = WEEKDAYS[match[1]];
    const modifier = match[2];
    const date = cloneDate(now);
    const currentDay = date.getDay();
    let diff = day - currentDay;

    if (modifier === "pasado" && diff >= 0) {
      diff -= 7;
    } else if (modifier === "proximo" && diff <= 0) {
      diff += 7;
    } else if ((modifier === "este" || modifier === "esta") && diff < 0) {
      diff += 7;
    }

    date.setDate(date.getDate() + diff);
    const moment = applyExtractedTime(date, extractedHour, extractedMinute);
    return moment ?? oneDay(date);
  }

  match = normalizedText.match(/(\d{1,2})\s*(?:de)?\s*([a-z]+)(?:\s+(?:de\s*)?(\d{2,4}))?(?:\s+a\s+las\s+(\d{1,2})(?::(\d{1,2}))?)?/i);
  if (match && MONTHS[match[2]] !== undefined) {
    const date = new Date(parseYear(match[3], now.getFullYear()), MONTHS[match[2]], Number(match[1]));
    if (!isValidDate(date)) {
      return null;
    }

    if (match[4]) {
      return oneMoment(applyTimeToDate(date, Number(match[4]), match[5] ? Number(match[5]) : 0));
    }

    const moment = applyExtractedTime(date, extractedHour, extractedMinute);
    return moment ?? oneDay(date);
  }

  match = normalizedText.match(/\b([a-z]+)\b/);
  if (match && MONTHS[match[1]] !== undefined) {
    const month = MONTHS[match[1]];
    return { from: startOfMonth(now.getFullYear(), month), to: endOfMonth(now.getFullYear(), month) };
  }

  match = normalizedText.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
  if (match) {
    const date = new Date(parseYear(match[3], now.getFullYear()), Number(match[2]) - 1, Number(match[1]));
    if (!isValidDate(date)) {
      return null;
    }

    const moment = applyExtractedTime(date, extractedHour, extractedMinute);
    return moment ?? oneDay(date);
  }

  if (extractedHour != null) {
    return oneMoment(applyTimeToDate(now, extractedHour, extractedMinute ?? 0));
  }

  return null;
};
