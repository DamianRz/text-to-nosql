"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ChatResolverMode, ChatResponse, ExecuteResponse, LocalLlmModelsResponse, MongoOperation } from "@/types/mongo";
import { copyByLanguage, demosByLanguage } from "./chatMongo.content";
import {
  AdvancedContent,
  AdvancedDetails,
  AdvancedSummary,
  Card,
  CodeOutput,
  Container,
  DemoGrid,
  DemoRow,
  DemoText,
  ExampleChip,
  ExampleList,
  FieldGrid,
  FieldGroup,
  GhostButton,
  Header,
  HeaderText,
  HelperText,
  LanguageField,
  Page,
  PanelTitle,
  ResultsColumn,
  ResultFrame,
  ResultToolbar,
  SecondaryButton,
  Select,
  Subtitle,
  Title,
  ToolbarActions,
  ToolStack,
  WorkspaceColumn,
  Button,
  DatabaseViewer,
  DatabaseViewerLayout,
  DatabaseSidebar,
  DatabaseCollectionButton,
  DatabaseCount,
  DatabaseRecords,
  DatabaseRecordItem,
  DatabaseRecordList,
  DatabaseRecordPre,
  InfoText,
  MutedText,
  SectionHeader,
  SectionLabel,
  SummaryText,
  Textarea,
  ActionRow,
  ErrorText
} from "./chatMongo.styles";
import { executeLocalMongoOperation, initializeSimulatedMongoDb, readSimulatedMongoDb } from "@/client/localDb/simulatedMongoDb";
import type { DatabaseCollectionView, DemoId, Language, Message, MessageRole } from "./chatMongo.types";

const stringify = (value: unknown): string => JSON.stringify(value, null, 2);
const DEFAULT_LOCAL_MODEL = "llama3.1:8b";

const buildInitialMessages = (language: Language): Message[] => [
  { id: `initial-${language}-0`, role: "assistant", text: copyByLanguage[language].initialMessage }
];

const createMessageId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const quickExamples: Record<Language, string[]> = {
  es: [
    "find users registered this week",
    "count orders from today",
    "get products cheaper than 20"
  ],
  en: [
    "find users registered this week",
    "count orders from today",
    "get products cheaper than 20"
  ]
};

const getDisplayResult = (mongoShell: string, result: unknown): string => {
  if (mongoShell) {
    return mongoShell;
  }

  if (result != null) {
    return stringify(result);
  }

  return "";
};

const detectHostedRuntime = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const hostname = window.location.hostname;
  return hostname !== "localhost" && hostname !== "127.0.0.1";
};

export function ChatMongo() {
  const messageSequenceRef = useRef(0);
  const [language, setLanguage] = useState<Language>("en");
  const [selectedDemoId, setSelectedDemoId] = useState<DemoId>("query");
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<MongoOperation | null>(null);
  const [mongoShell, setMongoShell] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => buildInitialMessages("en"));
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isHostedRuntime, setIsHostedRuntime] = useState<boolean>(() => detectHostedRuntime());
  const [experienceMode, setExperienceMode] = useState<"hosted" | "local">(() => (detectHostedRuntime() ? "hosted" : "local"));
  const [availableModels, setAvailableModels] = useState<string[]>([DEFAULT_LOCAL_MODEL]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_LOCAL_MODEL);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelLoadError, setModelLoadError] = useState("");
  const [localCollections, setLocalCollections] = useState<DatabaseCollectionView[]>([]);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = copyByLanguage[language];
  const demoCases = demosByLanguage[language];
  const selectedDemo = demoCases.find((entry) => entry.id === selectedDemoId) ?? demoCases[0];
  const resultView = useMemo(() => (result == null ? "" : stringify(result)), [result]);
  const visibleOutput = getDisplayResult(mongoShell, result);
  const isBusy = isSending || isExecuting;
  const isInteractive = experienceMode === "local" && !isHostedRuntime;
  const selectedCollection =
    localCollections.find((collection) => collection.name === selectedCollectionName) ??
    localCollections.find((collection) => collection.name === operation?.collection) ??
    localCollections[0];

  const appendMessage = (role: MessageRole, text: string): void => {
    messageSequenceRef.current += 1;
    setMessages((current) => [...current, { id: createMessageId(`${role}-${messageSequenceRef.current}`), role, text }]);
  };

  const refreshLocalCollections = (): void => {
    const state = readSimulatedMongoDb();
    const collections = Object.entries(state.collections).map(([name, documents]) => ({
      name,
      documents
    }));
    setLocalCollections(collections);
  };

  const clearOperationState = (): void => {
    setOperation(null);
    setMongoShell("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  useEffect(() => {
    const hostedRuntime = detectHostedRuntime();
    setIsHostedRuntime(hostedRuntime);

    if (hostedRuntime) {
      setExperienceMode("hosted");
    }
  }, []);

  useEffect(() => {
    initializeSimulatedMongoDb();
    refreshLocalCollections();
  }, []);

  useEffect(() => {
    if (selectedCollectionName) {
      return;
    }

    setSelectedCollectionName(operation?.collection ?? localCollections[0]?.name ?? "");
  }, [localCollections, operation?.collection, selectedCollectionName]);

  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    let cancelled = false;

    const loadModels = async () => {
      setIsLoadingModels(true);
      setModelLoadError("");

      try {
        const response = await fetch("/api/llm/models");
        const payload = (await response.json()) as LocalLlmModelsResponse;
        if (cancelled) {
          return;
        }

        if (!payload.ok) {
          setModelLoadError(payload.errors?.join("\n") ?? copy.localModelsError);
          setAvailableModels([payload.currentModel || DEFAULT_LOCAL_MODEL]);
          setSelectedModel((current) => current || payload.currentModel || DEFAULT_LOCAL_MODEL);
          return;
        }

        const models = payload.models.length > 0 ? payload.models : [payload.currentModel || DEFAULT_LOCAL_MODEL];
        setAvailableModels(models);
        setSelectedModel((current) => (current && models.includes(current) ? current : payload.currentModel || models[0]));
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setModelLoadError(requestError instanceof Error ? requestError.message : copy.localModelsError);
        setAvailableModels((current) => (current.length > 0 ? current : [DEFAULT_LOCAL_MODEL]));
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    };

    void loadModels();

    return () => {
      cancelled = true;
    };
  }, [copy.localModelsError, isInteractive]);

  const requestOperation = async (
    text: string,
    options: { appendUserMessage?: boolean; llmMode?: ChatResolverMode } = {}
  ): Promise<MongoOperation | null> => {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }

    setIsSending(true);
    setResult(null);
    setError("");
    setOperation(null);
    setMongoShell("");
    setCopied(false);

    if (options.appendUserMessage !== false) {
      appendMessage("user", trimmed);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          llmMode: options.llmMode ?? "off",
          llmModel: isInteractive ? selectedModel : undefined
        })
      });

      const payload = (await response.json()) as ChatResponse;
      if (!payload.ok || !payload.operation || !payload.mongoShell) {
        const message = payload.errors?.join("\n") ?? copy.genericGenerationError;
        setError(message);
        appendMessage("assistant", message);
        return null;
      }

      setOperation(payload.operation);
      setMongoShell(payload.mongoShell);
      setSelectedCollectionName(payload.operation.collection);
      appendMessage("assistant", `${copy.queryReadyLabel}\n${payload.mongoShell}`);
      return payload.operation;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : copy.genericGenerationError;
      setError(message);
      appendMessage("assistant", message);
      return null;
    } finally {
      setIsSending(false);
    }
  };

  const executeOperation = async (operationToRun: MongoOperation): Promise<void> => {
    setIsExecuting(true);
    setError("");

    try {
      if (isInteractive) {
        const localResult = await executeLocalMongoOperation(operationToRun);
        setResult(localResult);
        appendMessage("assistant", stringify(localResult));
        refreshLocalCollections();
        setSelectedCollectionName(operationToRun.collection);
        return;
      }

      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: operationToRun })
      });

      const payload = (await response.json()) as ExecuteResponse;
      if (!payload.ok) {
        const message = payload.errors?.join("\n") ?? copy.genericExecutionError;
        setResult(null);
        setError(message);
        appendMessage("assistant", message);
        return;
      }

      setResult(payload.result);
      appendMessage("assistant", stringify(payload.result));
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : copy.genericExecutionError;
      setResult(null);
      setError(message);
      appendMessage("assistant", message);
    } finally {
      setIsExecuting(false);
    }
  };

  const onGenerate = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!isInteractive) {
      return;
    }

    await requestOperation(input);
  };

  const onCopyQuery = async (): Promise<void> => {
    const value = visibleOutput;
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  const onRunDemo = async (demoId: DemoId): Promise<void> => {
    const demo = demoCases.find((entry) => entry.id === demoId);
    if (!demo) {
      return;
    }

    setSelectedDemoId(demo.id);
    setInput(demo.text);

    if (!isInteractive) {
      return;
    }

    const operationFromDemo = await requestOperation(demo.text, { llmMode: demo.llmMode });
    if (operationFromDemo) {
      await executeOperation(operationFromDemo);
    }
  };

  const onLoadDemo = (demoId: DemoId): void => {
    const demo = demoCases.find((entry) => entry.id === demoId);
    if (!demo) {
      return;
    }

    setSelectedDemoId(demo.id);
    setInput(demo.text);
    clearOperationState();
    appendMessage("assistant", copy.demoLoadedMessage);
  };

  const onLanguageChange = (nextLanguage: Language): void => {
    messageSequenceRef.current = 0;
    setLanguage(nextLanguage);
    setSelectedDemoId("query");
    setMessages(buildInitialMessages(nextLanguage));
    setInput("");
    clearOperationState();
  };

  const latestLogs = messages.slice(-4).reverse();

  return (
    <Page>
      <Container>
        <Header>
          <HeaderText>
            <Title>{copy.title}</Title>
            <Subtitle>{copy.subtitle}</Subtitle>
          </HeaderText>
        </Header>

        <WorkspaceColumn>
          <ToolStack>
            <Card>
              <SectionHeader>
                <div>
                  <SectionLabel>{copy.quickStartTitle}</SectionLabel>
                  <PanelTitle>{copy.workspaceDescription}</PanelTitle>
                </div>
              </SectionHeader>
              <HelperText>{copy.quickStartBody}</HelperText>
              <ExampleList aria-label="quick-start-instructions">
                {copy.quickStartSteps.map((step) => (
                  <ExampleChip key={step} as="span">
                    {step}
                  </ExampleChip>
                ))}
              </ExampleList>
              <HelperText>{copy.quickStartTip}</HelperText>
            </Card>

            <Card>
              <div>
                <SectionLabel>{copy.instructionTitle}</SectionLabel>
                <PanelTitle>{copy.chatTitle}</PanelTitle>
              </div>
              <HelperText>{copy.instructionHelper}</HelperText>
              <div>
                <MutedText>{copy.examplesTitle}</MutedText>
                <ExampleList>
                  {quickExamples[language].map((example) => (
                    <ExampleChip key={example} type="button" onClick={() => setInput(example)}>
                      {example}
                    </ExampleChip>
                  ))}
                </ExampleList>
              </div>
              <form onSubmit={onGenerate}>
                <Textarea
                  aria-label="chat-input"
                  placeholder={copy.placeholder}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={!isInteractive}
                />
                <ActionRow>
                  <Button type="submit" disabled={!isInteractive || isSending}>
                    {isSending ? copy.generatingButton : copy.generateButton}
                  </Button>
                  {operation ? (
                    <SecondaryButton type="button" onClick={() => void executeOperation(operation)} disabled={isExecuting || !isInteractive}>
                      {isExecuting ? copy.executingButton : copy.executeButton}
                    </SecondaryButton>
                  ) : null}
                </ActionRow>
              </form>
              {error ? <ErrorText role="alert">{error}</ErrorText> : null}
            </Card>

            <Card>
              <SectionHeader>
                <div>
                  <SectionLabel>{copy.generatedQueryTitle}</SectionLabel>
                  <PanelTitle>Result</PanelTitle>
                </div>
              </SectionHeader>
              <ResultFrame>
                <ResultToolbar>
                  <MutedText>{operation ? `${operation.action} · ${operation.collection}` : copy.noGeneratedQuery}</MutedText>
                  <ToolbarActions>
                    <GhostButton type="button" onClick={() => void onCopyQuery()} disabled={!visibleOutput}>
                      {copied ? "Copied" : copy.copyQueryButton}
                    </GhostButton>
                    <GhostButton type="button" onClick={clearOperationState} disabled={!visibleOutput && !resultView}>
                      {copy.clearQueryButton}
                    </GhostButton>
                  </ToolbarActions>
                </ResultToolbar>
                <CodeOutput aria-label="generated-query">{visibleOutput || copy.noGeneratedQuery}</CodeOutput>
              </ResultFrame>
              <div>
                <SectionLabel>{copy.resultTitle}</SectionLabel>
                <ResultFrame>
                  <CodeOutput aria-label="execution-result">{resultView || copy.noResult}</CodeOutput>
                </ResultFrame>
              </div>
            </Card>

            <AdvancedDetails>
              <AdvancedSummary>{copy.advancedOptionsLabel}</AdvancedSummary>
              <AdvancedContent>
                <FieldGrid>
                  <FieldGroup>
                    {copy.languageLabel}
                    <Select aria-label="language-select" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
                      <option value="es">{copy.languageSpanish}</option>
                      <option value="en">{copy.languageEnglish}</option>
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    {copy.previewModeLabel}
                    <Select
                      aria-label="preview-mode-select"
                      value={experienceMode}
                      onChange={(event) => setExperienceMode(event.target.value as "hosted" | "local")}
                    >
                      <option value="local">{copy.previewLocalLabel}</option>
                      <option value="hosted">{copy.previewHostedLabel}</option>
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    {copy.localModelLabel}
                    <Select
                      aria-label="local-model-select"
                      value={selectedModel}
                      onChange={(event) => setSelectedModel(event.target.value)}
                      disabled={!isInteractive || isLoadingModels}
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </Select>
                  </FieldGroup>
                </FieldGrid>

                {modelLoadError ? <HelperText>{`${copy.localModelsError} ${modelLoadError}`}</HelperText> : null}
                {!isInteractive ? <HelperText>{copy.hostedWorkspaceNotice}</HelperText> : null}

                <div>
                  <SectionLabel>{copy.sidebarDemosTitle}</SectionLabel>
                  <DemoGrid>
                    {demoCases.slice(0, 6).map((demo) => (
                      <DemoRow key={demo.id}>
                        <DemoText>
                          <strong>{demo.label}</strong>
                          <MutedText>{demo.text}</MutedText>
                        </DemoText>
                        <SecondaryButton type="button" onClick={() => onLoadDemo(demo.id)}>
                          {copy.demoLoadButton}
                        </SecondaryButton>
                        <Button type="button" onClick={() => void onRunDemo(demo.id)} disabled={isBusy || !isInteractive}>
                          {copy.demoRunButton}
                        </Button>
                      </DemoRow>
                    ))}
                  </DemoGrid>
                </div>

                <DatabaseViewer aria-label="local-database-viewer">
                  <SectionHeader>
                    <div>
                      <SectionLabel>{copy.databaseViewerTitle}</SectionLabel>
                      <PanelTitle>{copy.databaseViewerOutcomeTitle}</PanelTitle>
                    </div>
                  </SectionHeader>
                  <DatabaseViewerLayout>
                    <DatabaseSidebar>
                      {localCollections.map((collection) => (
                        <DatabaseCollectionButton
                          key={collection.name}
                          type="button"
                          $active={collection.name === selectedCollection?.name}
                          onClick={() => setSelectedCollectionName(collection.name)}
                        >
                          <span>{collection.name}</span>
                          <DatabaseCount>{collection.documents.length}</DatabaseCount>
                        </DatabaseCollectionButton>
                      ))}
                    </DatabaseSidebar>
                    <DatabaseRecords>
                      <SectionLabel>{selectedCollection ? `${copy.databaseRecordsTitle}: ${selectedCollection.name}` : copy.databaseRecordsTitle}</SectionLabel>
                      {!selectedCollection || selectedCollection.documents.length === 0 ? (
                        <InfoText>{copy.databaseEmptyCollection}</InfoText>
                      ) : (
                        <DatabaseRecordList>
                          {selectedCollection.documents.map((document, index) => (
                            <DatabaseRecordItem key={String(document._id ?? index)}>
                              <DatabaseRecordPre>{stringify(document)}</DatabaseRecordPre>
                            </DatabaseRecordItem>
                          ))}
                        </DatabaseRecordList>
                      )}
                    </DatabaseRecords>
                  </DatabaseViewerLayout>
                </DatabaseViewer>

                <Card>
                  <SectionLabel>{copy.logsTitle}</SectionLabel>
                  {latestLogs.length === 0 ? (
                    <InfoText>{copy.historyEmpty}</InfoText>
                  ) : (
                    latestLogs.map((message) => (
                      <div key={message.id}>
                        <MutedText>{message.role}</MutedText>
                        <CodeOutput>{message.text}</CodeOutput>
                      </div>
                    ))
                  )}
                </Card>
              </AdvancedContent>
            </AdvancedDetails>
          </ToolStack>
        </WorkspaceColumn>

        <ResultsColumn>
          <Card>
            <SectionLabel>{copy.aboutTitle}</SectionLabel>
            <PanelTitle>About this project</PanelTitle>
            <SummaryText>
              Text to NoSQL converts natural language into MongoDB queries using a local LLM pipeline. Built to explore
              AI-assisted database querying and developer tooling.
            </SummaryText>
          </Card>
        </ResultsColumn>
      </Container>
    </Page>
  );
}
