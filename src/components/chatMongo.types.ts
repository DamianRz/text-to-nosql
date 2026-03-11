import type { ChatResolverMode, MongoAction, MongoOperation } from "@/types/mongo";
import type { JsonObject } from "@/types/mongo";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
}

export type Language = "es" | "en";
export type DemoId = string;
export type FlowIconName = "input" | "intent" | "llm" | "query" | "mongo" | "result";

export interface DemoCase {
  id: DemoId;
  action: MongoAction;
  label: string;
  text: string;
  operation: MongoOperation;
  mongoShell: string;
  mockResult: unknown;
  processTitle: string;
  processSteps: string[];
  llmMode: ChatResolverMode;
}

export interface FlowStep {
  id: string;
  icon: FlowIconName;
  title: string;
  detail: string;
}

export interface DatabaseCollectionView {
  name: string;
  documents: JsonObject[];
}

export interface CopyDictionary {
  title: string;
  subtitle: string;
  sidebarDemosTitle: string;
  sidebarSettingsTitle: string;
  instructionTitle: string;
  instructionHelper: string;
  logsTitle: string;
  historyEmpty: string;
  presentationHint: string;
  previewModeLabel: string;
  previewHostedLabel: string;
  previewLocalLabel: string;
  projectSlideLabel: string;
  demoSlideLabel: string;
  workspaceSlideLabel: string;
  aboutTitle: string;
  aboutBody: string;
  aboutItems: string[];
  llmTitle: string;
  llmBody: string;
  llmItems: string[];
  hostedTitle: string;
  hostedBody: string;
  localReadyTitle: string;
  localReadyBody: string;
  localOptionsTitle: string;
  localModelLabel: string;
  localModelsLoading: string;
  localModelsEmpty: string;
  localModelsError: string;
  hostedDemoNotice: string;
  hostedWorkspaceNotice: string;
  localModeTag: string;
  hostedModeTag: string;
  localOnlyTitle: string;
  localSimulationNotice: string;
  localSimulationTag: string;
  databaseViewerTitle: string;
  databaseViewerOutcomeTitle: string;
  databaseViewerDescription: string;
  databaseViewerOutcomeDescription: string;
  databaseCollectionsTitle: string;
  databaseRecordsTitle: string;
  databaseEmptyState: string;
  databaseEmptyCollection: string;
  diagramTitle: string;
  diagramBody: string;
  flowSteps: FlowStep[];
  languageLabel: string;
  languageSpanish: string;
  languageEnglish: string;
  demoTitle: string;
  demoDescription: string;
  demoProcessTitle: string;
  demoModeDeterministic: string;
  demoModeLlm: string;
  resolverTitle: string;
  resolverDeterministic: string;
  resolverLlm: string;
  demoLoadButton: string;
  demoRunButton: string;
  demoLoadedMessage: string;
  chatTitle: string;
  workspaceDescription: string;
  selectedDemoTitle: string;
  selectedDemoHelper: string;
  statusTitle: string;
  statusReady: string;
  statusWaiting: string;
  reviewHelper: string;
  reviewSummaryEmpty: string;
  safeExecutionHint: string;
  destructiveExecutionHint: string;
  initialMessage: string;
  placeholder: string;
  generateButton: string;
  generatingButton: string;
  executeButton: string;
  executingButton: string;
  generatedQueryTitle: string;
  noGeneratedQuery: string;
  resultTitle: string;
  noResult: string;
  genericGenerationError: string;
  genericExecutionError: string;
  queryReadyLabel: string;
}
