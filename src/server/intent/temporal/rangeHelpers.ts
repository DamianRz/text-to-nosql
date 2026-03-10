import { applyTimeToDate, cloneDate, toEndOfDay, toStartOfDay } from "./helpers";

export interface TemporalRangeShape {
  from: string;
  to: string;
}

export const parseYear = (rawYear: string | undefined, fallbackYear: number): number => {
  if (!rawYear) {
    return fallbackYear;
  }

  if (rawYear.length === 4) {
    return Number(rawYear);
  }

  return Number(`20${rawYear}`);
};

export const normalizeUnit = (unit: string): "day" | "week" | "month" | "year" | null => {
  if (!unit) {
    return null;
  }

  if (unit.startsWith("dia") || unit.startsWith("da")) {
    return "day";
  }

  if (unit.startsWith("semana")) {
    return "week";
  }

  if (unit.startsWith("mes")) {
    return "month";
  }

  if (unit.startsWith("ano")) {
    return "year";
  }

  return null;
};

export const startOfWeek = (baseDate: Date): string => {
  const value = cloneDate(baseDate);
  const day = value.getDay();
  const diff = (day + 6) % 7;
  value.setDate(value.getDate() - diff);
  return toStartOfDay(value);
};

export const endOfWeek = (baseDate: Date): string => {
  const value = cloneDate(baseDate);
  const day = value.getDay();
  const diff = (day + 6) % 7;
  value.setDate(value.getDate() - diff + 6);
  return toEndOfDay(value);
};

export const startOfMonth = (year: number, month: number): string => toStartOfDay(new Date(year, month, 1));
export const endOfMonth = (year: number, month: number): string => toEndOfDay(new Date(year, month + 1, 0));

export const oneDay = (date: Date): TemporalRangeShape => ({ from: toStartOfDay(date), to: toEndOfDay(date) });
export const oneMoment = (date: Date): TemporalRangeShape => ({ from: date.toISOString(), to: date.toISOString() });
export const range = (fromDate: Date, toDate: Date): TemporalRangeShape => ({ from: toStartOfDay(fromDate), to: toEndOfDay(toDate) });

export const lastWeekendRange = (baseDate: Date): TemporalRangeShape => {
  const saturday = cloneDate(baseDate);
  const day = saturday.getDay();
  const daysSinceSaturday = (day + 1) % 7;

  saturday.setDate(saturday.getDate() - daysSinceSaturday);

  if (day === 6 || day === 0) {
    saturday.setDate(saturday.getDate() - 7);
  }

  const sunday = cloneDate(saturday);
  sunday.setDate(sunday.getDate() + 1);

  return {
    from: toStartOfDay(saturday),
    to: toEndOfDay(sunday)
  };
};

export const applyExtractedTime = (date: Date, hour: number | null, minute: number | null): TemporalRangeShape | null => {
  if (hour == null) {
    return null;
  }

  return oneMoment(applyTimeToDate(date, hour, minute ?? 0));
};
