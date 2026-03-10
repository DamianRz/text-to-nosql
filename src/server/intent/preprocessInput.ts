import { normalizeInput } from "./normalizeInput";

type PreprocessStepName =
  | "normalizeInput"
  | "noiseFilter"
  | "semanticConnectorNormalizer"
  | "cleanTokens";

type PreprocessFn = (text: string) => string;

interface PreprocessOptions {
  steps?: PreprocessStepName[];
  overrides?: Partial<Record<PreprocessStepName, PreprocessFn>>;
  extraSteps?: PreprocessFn[];
}

const noiseFilter: PreprocessFn = (text) =>
  text
    .replace(/[\u0000-\u001f]/g, " ")
    .replace(/[^\w\s$%:./\\=<>-]/g, " ")
    .replace(/[!?]{2,}/g, "!")
    .replace(/[.]{2,}/g, ".")
    .replace(/\s+/g, " ")
    .trim();

const semanticConnectorNormalizer: PreprocessFn = (text) =>
  text
    .replace(/\bluego\b/g, "y luego")
    .replace(/\bdespues\b/g, "y despues")
    .replace(/\b(y\s+){2,}/g, "y ")
    .replace(/\s+/g, " ")
    .trim();

const cleanTokens: PreprocessFn = (text) => {
  const protectedTokens: string[] = [];

  const protect = (pattern: RegExp): void => {
    text = text.replace(pattern, (match) => {
      const token = `__KEEP_${protectedTokens.length}__`;
      protectedTokens.push(match);
      return token;
    });
  };

  const protectedPatterns: RegExp[] = [
    /\b([a-zA-Z_]\w*)\s*(>=|<=|==|=|>|<)\s*(\w+)\b/g,
    /\b\d[\d:/.\-]*\d\b/g,
    /[A-Za-z]:[\\\/][\w.\-\\\/]+/g,
    /\/[\w.\-/]+/g,
    /\b[\w\-.]+\.(?:zip|tar|gz|tgz|sh|mp3|mp4|wav|flac|txt|log|json|js|ts|py|bat)\b/gi
  ];

  for (const pattern of protectedPatterns) {
    protect(pattern);
  }

  const cleaned = text
    .replace(/[.,;:!?]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return protectedTokens.reduce((acc, token, index) => acc.replace(`__KEEP_${index}__`, token), cleaned);
};

const stepsMap: Record<PreprocessStepName, PreprocessFn> = {
  normalizeInput,
  noiseFilter,
  semanticConnectorNormalizer,
  cleanTokens
};

const defaultSteps: PreprocessStepName[] = ["normalizeInput", "noiseFilter", "semanticConnectorNormalizer", "cleanTokens"];

export const preprocessInput = (rawInput: string, options: PreprocessOptions = {}): string => {
  const { steps = defaultSteps, overrides = {}, extraSteps = [] } = options;
  const pipeline = [
    ...steps.map((step) => overrides[step] ?? stepsMap[step]),
    ...extraSteps
  ];
  return pipeline.reduce((current, fn) => fn(current), rawInput ?? "");
};
