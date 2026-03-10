import { chronoParse } from "./chronoParse";

export interface SemanticTemporalRange {
  from: Date;
  to: Date;
}

const asRange = (from: Date, to: Date): SemanticTemporalRange => ({ from, to });

export const semanticTemporalRules = async (message: string): Promise<SemanticTemporalRange | null> => {
  const text = message?.trim().toLowerCase();
  if (!text) {
    return null;
  }

  const chronoResult = await chronoParse(message);
  if (chronoResult?.filter?.date?.from && chronoResult?.filter?.date?.to) {
    return asRange(new Date(chronoResult.filter.date.from), new Date(chronoResult.filter.date.to));
  }

  const now = new Date();

  const offsetMatch = text.match(/\bhace\s+(\d+)\s+(dia|dias|semana|semanas|mes|meses|ano|anos)\b/);
  if (offsetMatch) {
    const amount = Number(offsetMatch[1]);
    const unit = offsetMatch[2];
    const from = new Date(now);
    const to = new Date(now);

    if (/dia/.test(unit)) {
      from.setDate(now.getDate() - amount);
      return asRange(from, to);
    }

    if (/semana/.test(unit)) {
      from.setDate(now.getDate() - amount * 7);
      return asRange(from, to);
    }

    if (/mes/.test(unit)) {
      from.setMonth(now.getMonth() - amount);
      return asRange(from, to);
    }

    from.setFullYear(now.getFullYear() - amount);
    return asRange(from, to);
  }

  if (/\b(pasado|pasada|anterior)\b/.test(text)) {
    const from = new Date(now);
    const to = new Date(now);

    if (text.includes("semana")) {
      const day = now.getDay();
      from.setDate(now.getDate() - (day + 7));
      to.setDate(from.getDate() + 6);
      return asRange(from, to);
    }

    if (text.includes("mes")) {
      from.setMonth(now.getMonth() - 1, 1);
      to.setMonth(now.getMonth(), 0);
      return asRange(from, to);
    }

    if (text.includes("ano")) {
      from.setFullYear(now.getFullYear() - 1, 0, 1);
      to.setFullYear(now.getFullYear() - 1, 11, 31);
      return asRange(from, to);
    }
  }

  if (/\b(que viene|proximo|proxima)\b/.test(text)) {
    const from = new Date(now);
    const to = new Date(now);

    if (text.includes("semana")) {
      const day = now.getDay();
      from.setDate(now.getDate() + (7 - day));
      to.setDate(from.getDate() + 6);
      return asRange(from, to);
    }

    if (text.includes("mes")) {
      from.setMonth(now.getMonth() + 1, 1);
      to.setMonth(now.getMonth() + 2, 0);
      return asRange(from, to);
    }

    if (text.includes("ano")) {
      from.setFullYear(now.getFullYear() + 1, 0, 1);
      to.setFullYear(now.getFullYear() + 1, 11, 31);
      return asRange(from, to);
    }
  }

  if (text.includes("ayer")) {
    const from = new Date(now);
    from.setDate(now.getDate() - 1);
    return asRange(from, new Date(from));
  }

  if (text.includes("anteayer")) {
    const from = new Date(now);
    from.setDate(now.getDate() - 2);
    return asRange(from, new Date(from));
  }

  return null;
};

