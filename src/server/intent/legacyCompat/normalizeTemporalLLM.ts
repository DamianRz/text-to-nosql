interface NormalizeTemporalLlmOptions {
  forceEnabled?: boolean;
}

const DEFAULT_LLM_URL = "http://127.0.0.1:11434/api/generate";
const DEFAULT_LLM_MODEL = "llama3.1:8b";
const DEFAULT_TIMEOUT_MS = 8000;

const parseEnabledFlag = (value: string | undefined): boolean => {
  if (value == null) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return !(normalized === "false" || normalized === "0" || normalized === "no");
};

const looksTemporal = (text: string): boolean =>
  /\b(hoy|ayer|anteayer|manana|pasado manana|finde|fin de semana|weekend|last|next|ago|hace|semana|mes|ano|lunes|martes|miercoles|jueves|viernes|sabado|domingo|\d{1,2}[\/\-]\d{1,2})\b/i.test(
    text
  );

const unwrap = (value: string): string => value.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").replace(/^"|"$/g, "").trim();

export const normalizeTemporalLLM = async (input: string, options: NormalizeTemporalLlmOptions = {}): Promise<string> => {
  const original = input.trim();
  if (!original || !looksTemporal(original)) {
    return original;
  }

  const enabled = options.forceEnabled ? true : parseEnabledFlag(process.env.LLM_ENABLED);
  if (!enabled) {
    return original;
  }

  const controller = new AbortController();
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const timeoutHandle = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(process.env.LLM_URL?.trim() || DEFAULT_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.LLM_MODEL?.trim() || DEFAULT_LLM_MODEL,
        prompt: [
          "Extrae solo la expresion temporal del mensaje y devuelvela lista para parsear.",
          "No agregues texto adicional, solo una expresion temporal corta.",
          "Si no hay expresion temporal devuelve EMPTY.",
          `Mensaje: ${original}`
        ].join("\n"),
        stream: false,
        options: { temperature: 0 }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return original;
    }

    const payload = (await response.json()) as { response?: string };
    const normalized = unwrap(payload.response ?? "");
    if (!normalized || normalized.toLowerCase() === "empty") {
      return original;
    }

    return normalized;
  } catch {
    return original;
  } finally {
    clearTimeout(timeoutHandle);
  }
};

