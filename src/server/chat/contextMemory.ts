import type { ChatResolverSource, MongoIntent, MongoOperation } from "@/types/mongo";

interface ChatContextSnapshot {
  userText: string;
  intent?: MongoIntent;
  operation: MongoOperation;
  mongoShell: string;
  resolver: ChatResolverSource;
}

const globalMemory =
  (globalThis as { __chatContextMemory?: ChatContextSnapshot | null }).__chatContextMemory ??
  ((globalThis as { __chatContextMemory?: ChatContextSnapshot | null }).__chatContextMemory = null);

const repeatPatterns = [
  /\botra vez\b/i,
  /\brepite\b/i,
  /\bigual que antes\b/i,
  /\blo mismo\b/i,
  /\brepeti\b/i,
  /\brepetir\b/i
];

export const isRepeatInstruction = (text: string): boolean => repeatPatterns.some((pattern) => pattern.test(text));

export const getLastChatContext = (): ChatContextSnapshot | null =>
  (globalThis as { __chatContextMemory?: ChatContextSnapshot | null }).__chatContextMemory ?? globalMemory;

export const recordChatContext = (snapshot: ChatContextSnapshot): void => {
  (globalThis as { __chatContextMemory?: ChatContextSnapshot | null }).__chatContextMemory = snapshot;
};

export const clearChatContext = (): void => {
  (globalThis as { __chatContextMemory?: ChatContextSnapshot | null }).__chatContextMemory = null;
};

