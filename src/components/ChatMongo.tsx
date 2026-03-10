"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ChatResolverMode, ChatResolverSource, ChatResponse, ExecuteResponse, LocalLlmModelsResponse, MongoOperation } from "@/types/mongo";
import { copyByLanguage, demosByLanguage } from "./chatMongo.content";
import {
  Container,
  Header,
  HeaderText,
  LanguageField,
  Page,
  PreviewLabel,
  PreviewPill,
  PreviewPillGroup,
  PreviewSwitch,
  ResultsColumn,
  Select,
  Subtitle,
  Title,
  WorkspaceColumn
} from "./chatMongo.styles";
import { ChatMongoDatabaseViewer } from "./chatMongo/ChatMongoDatabaseViewer";
import { ChatMongoSidebar } from "./chatMongo/ChatMongoSidebar";
import { ChatMongoWorkspacePanel } from "./chatMongo/ChatMongoWorkspacePanel";
import { executeLocalMongoOperation, initializeSimulatedMongoDb, readSimulatedMongoDb } from "@/client/localDb/simulatedMongoDb";
import type { DatabaseCollectionView, DemoId, Language, Message, MessageRole } from "./chatMongo.types";

const stringify = (value: unknown): string => JSON.stringify(value, null, 2);
const DEFAULT_LOCAL_MODEL = "llama3.1:8b";
const buildInitialMessages = (language: Language): Message[] => [
  { id: `initial-${language}`, role: "assistant", text: copyByLanguage[language].initialMessage }
];

export function ChatMongo() {
  const messageSequenceRef = useRef(0);
  const [language, setLanguage] = useState<Language>("es");
  const [selectedDemoId, setSelectedDemoId] = useState<DemoId>("query");
  const [input, setInput] = useState(demosByLanguage.es[0].text);
  const [operation, setOperation] = useState<MongoOperation | null>(null);
  const [mongoShell, setMongoShell] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => buildInitialMessages("es"));
  const [result, setResult] = useState<unknown>(null);
  const [resolver, setResolver] = useState<ChatResolverSource | null>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [experienceMode, setExperienceMode] = useState<"hosted" | "local">("local");
  const [isHostedRuntime, setIsHostedRuntime] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([DEFAULT_LOCAL_MODEL]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_LOCAL_MODEL);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelLoadError, setModelLoadError] = useState("");
  const [localCollections, setLocalCollections] = useState<DatabaseCollectionView[]>([]);

  const copy = copyByLanguage[language];
  const demoCases = demosByLanguage[language];
  const selectedDemo = demoCases.find((entry) => entry.id === selectedDemoId) ?? demoCases[0];
  const resultView = useMemo(() => (result == null ? "" : stringify(result)), [result]);
  const isBusy = isSending || isExecuting;
  const isInteractive = experienceMode === "local" && !isHostedRuntime;

  const appendMessage = (role: MessageRole, text: string): void => {
    messageSequenceRef.current += 1;
    setMessages((current) => [...current, { id: `${role}-${messageSequenceRef.current}-${Date.now()}`, role, text }]);
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
    setResolver(null);
    setError("");
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    const hostedRuntime = hostname !== "localhost" && hostname !== "127.0.0.1";
    setIsHostedRuntime(hostedRuntime);

    if (hostedRuntime) {
      setExperienceMode("hosted");
    }
  }, []);

  useEffect(() => {
    initializeSimulatedMongoDb();
    refreshLocalCollections();

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
    setResolver(null);

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
      setResolver(payload.resolver ?? "deterministic");
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

  const onExecute = async (): Promise<void> => {
    if (!operation) {
      return;
    }

    await executeOperation(operation);
  };

  const onLoadDemo = (): void => {
    if (!selectedDemo) {
      return;
    }

    setInput(selectedDemo.text);
    clearOperationState();
    appendMessage("assistant", copy.demoLoadedMessage);
  };

  const onRunDemo = async (): Promise<void> => {
    if (!isInteractive || !selectedDemo) {
      return;
    }

    setInput(selectedDemo.text);
    const operationFromDemo = await requestOperation(selectedDemo.text, { llmMode: selectedDemo.llmMode });
    if (operationFromDemo) {
      await executeOperation(operationFromDemo);
    }
  };

  const onSelectDemo = (demoId: DemoId): void => {
    setSelectedDemoId(demoId);
    const nextDemo = demoCases.find((entry) => entry.id === demoId);
    if (!nextDemo) {
      return;
    }

    setInput(nextDemo.text);
    clearOperationState();
  };

  const onLanguageChange = (nextLanguage: Language): void => {
    messageSequenceRef.current = 0;
    setLanguage(nextLanguage);
    setSelectedDemoId("query");
    setMessages(buildInitialMessages(nextLanguage));
    setInput(demosByLanguage[nextLanguage][0].text);
    clearOperationState();
  };

  return (
    <Page>
      <Container>
        <ChatMongoSidebar
          copy={copy}
          demos={demoCases}
          selectedDemoId={selectedDemoId}
          language={language}
          experienceMode={experienceMode}
          selectedModel={selectedModel}
          onSelectDemo={onSelectDemo}
          onLoadDemo={onLoadDemo}
          onRunDemo={onRunDemo}
          isBusy={isBusy}
          isInteractive={isInteractive}
        />

        <Header>
          <HeaderText>
            <Title>{copy.title}</Title>
            <Subtitle>{copy.subtitle}</Subtitle>
            {modelLoadError ? <Subtitle>{`${copy.localModelsError} ${modelLoadError}`}</Subtitle> : null}
          </HeaderText>
          <PreviewSwitch>
            <LanguageField>
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
            </LanguageField>
            <div>
              <PreviewLabel>{copy.previewModeLabel}</PreviewLabel>
              <PreviewPillGroup aria-label="preview-mode-switch">
                <PreviewPill type="button" $active={experienceMode === "local"} onClick={() => setExperienceMode("local")}>
                  {copy.previewLocalLabel}
                </PreviewPill>
                <PreviewPill type="button" $active={experienceMode === "hosted"} onClick={() => setExperienceMode("hosted")}>
                  {copy.previewHostedLabel}
                </PreviewPill>
              </PreviewPillGroup>
            </div>
            <LanguageField>
              {copy.languageLabel}
              <Select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} aria-label="language-select">
                <option value="es">{copy.languageSpanish}</option>
                <option value="en">{copy.languageEnglish}</option>
              </Select>
            </LanguageField>
          </PreviewSwitch>
        </Header>

        <WorkspaceColumn>
          <ChatMongoWorkspacePanel
            copy={copy}
            input={input}
            mongoShell={mongoShell}
            resultView={resultView}
            error={error}
            operation={operation}
            resolver={resolver}
            isSending={isSending}
            isExecuting={isExecuting}
            isInteractive={isInteractive}
            messages={messages}
            selectedDemo={selectedDemo}
            onInputChange={setInput}
            onGenerate={onGenerate}
            onExecute={onExecute}
          />
        </WorkspaceColumn>

        <ResultsColumn>
          <ChatMongoDatabaseViewer copy={copy} collections={localCollections} preferredCollectionName={selectedDemo.operation.collection} />
        </ResultsColumn>
      </Container>
    </Page>
  );
}
