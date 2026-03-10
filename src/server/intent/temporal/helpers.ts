import { MONTH_NAME_TO_INDEX, WEEKDAY_NAME_TO_INDEX } from "../constants";

export const isValidDate = (value: unknown): value is Date => value instanceof Date && !Number.isNaN(value.getTime());

export const cloneDate = (date: Date): Date => new Date(date.getTime());

export const toStartOfDay = (date: Date): string =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString();

export const toEndOfDay = (date: Date): string =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).toISOString();

export const normalizeHour = (rawHour: number, rawMinute = 0): { hour: number; minute: number } => {
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  return {
    hour: Math.max(0, Math.min(23, Number.isNaN(hour) ? 0 : hour)),
    minute: Math.max(0, Math.min(59, Number.isNaN(minute) ? 0 : minute))
  };
};

export const applyTimeToDate = (base: Date, hour?: number, minute?: number): Date => {
  if (hour == null) {
    return base;
  }

  const next = cloneDate(base);
  const normalized = normalizeHour(hour, minute ?? 0);

  next.setHours(normalized.hour);
  next.setMinutes(normalized.minute);
  next.setSeconds(0);
  next.setMilliseconds(0);

  return next;
};

export const MONTHS = MONTH_NAME_TO_INDEX;
export const WEEKDAYS = WEEKDAY_NAME_TO_INDEX;
