"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import type { ChatResolverMode, ChatResponse, ExecuteResponse, LocalLlmModelsResponse, MongoOperation } from "@/types/mongo";
import { copyByLanguage, demosByLanguage } from "./chatMongo.content";
import { executeLocalMongoOperation, initializeSimulatedMongoDb, readSimulatedMongoDb } from "@/client/localDb/simulatedMongoDb";
import type { DatabaseCollectionView, DemoCase, DemoId, Language, Message, MessageRole } from "./chatMongo.types";
import { ActionButton, CodePanel, PageFrame, StatusChip, SurfaceCard } from "./ui/MaterialBlocks";

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
  es: ["buscar usuarios creados hoy", "contar pedidos de hoy", "traer productos mas baratos que 20"],
  en: ["find users created today", "count orders from today", "get products cheaper than 20"]
};

const detectHostedRuntime = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const hostname = window.location.hostname;
  return hostname !== "localhost" && hostname !== "127.0.0.1";
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

const featuredDemoIds: DemoId[] = ["find_transactions_food", "count_users_active", "update_transactions_reviewed"];

const isMutatingAction = (action?: MongoOperation["action"]): boolean =>
  action === "insertOne" || action === "updateMany" || action === "deleteMany";

export function ChatMongo() {
  const messageSequenceRef = useRef(0);
  const [language, setLanguage] = useState<Language>("en");
  const [selectedDemoId, setSelectedDemoId] = useState<DemoId>(featuredDemoIds[0]);
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
  const featuredDemos = useMemo(
    () => featuredDemoIds.map((id) => demoCases.find((entry) => entry.id === id)).filter(Boolean) as DemoCase[],
    [demoCases]
  );
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

  const applyDemoPreview = (demo: DemoCase): void => {
    setSelectedDemoId(demo.id);
    setInput(demo.text);
    setOperation(demo.operation);
    setMongoShell(demo.mongoShell);
    setResult(demo.mockResult);
    setSelectedCollectionName(demo.operation.collection);
    setCopied(false);
    setError("");
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

      setResult(selectedDemo?.mockResult ?? null);
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
      if (selectedDemo) {
        applyDemoPreview(selectedDemo);
      }
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

  const onSelectDemo = (demoId: DemoId): void => {
    const demo = demoCases.find((entry) => entry.id === demoId);
    if (!demo) {
      return;
    }

    setSelectedDemoId(demo.id);
    if (!isInteractive) {
      applyDemoPreview(demo);
      return;
    }

    setInput(demo.text);
    clearOperationState();
  };

  const onRunDemo = async (): Promise<void> => {
    const demo = demoCases.find((entry) => entry.id === selectedDemoId);
    if (!demo) {
      return;
    }

    if (!isInteractive) {
      applyDemoPreview(demo);
      return;
    }

    setInput(demo.text);
    const operationFromDemo = await requestOperation(demo.text, { llmMode: demo.llmMode });
    if (operationFromDemo) {
      await executeOperation(operationFromDemo);
    }
  };

  const onLanguageChange = (nextLanguage: Language): void => {
    messageSequenceRef.current = 0;
    setLanguage(nextLanguage);
    setSelectedDemoId(featuredDemoIds[0]);
    setMessages(buildInitialMessages(nextLanguage));
    setInput("");
    clearOperationState();
  };

  const latestLogs = messages.slice(-3).reverse();

  const renderHeader = () => (
    <SurfaceCard
      title={copy.title}
      description={copy.subtitle}
      actions={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
          <StatusChip label={isInteractive ? copy.localModeTag : copy.hostedModeTag} color={isInteractive ? "success" : "primary"} />
          {!isHostedRuntime ? (
            <FormControl size="small" sx={{ minWidth: 132 }}>
              <InputLabel id="preview-mode-label">{copy.previewModeLabel}</InputLabel>
              <Select
                labelId="preview-mode-label"
                aria-label="preview-mode-select"
                value={experienceMode}
                label={copy.previewModeLabel}
                onChange={(event) => setExperienceMode(event.target.value as "hosted" | "local")}
              >
                <MenuItem value="local">{copy.previewLocalLabel}</MenuItem>
                <MenuItem value="hosted">{copy.previewHostedLabel}</MenuItem>
              </Select>
            </FormControl>
          ) : null}
          <FormControl size="small" sx={{ minWidth: 132 }}>
            <InputLabel id="language-label">{copy.languageLabel}</InputLabel>
            <Select
              labelId="language-label"
              aria-label="language-select"
              value={language}
              label={copy.languageLabel}
              onChange={(event) => onLanguageChange(event.target.value as Language)}
            >
              <MenuItem value="es">{copy.languageSpanish}</MenuItem>
              <MenuItem value="en">{copy.languageEnglish}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      }
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} useFlexGap flexWrap="wrap">
        <StatusChip label="Input -> Mongo Shell -> Review" />
        <StatusChip label="Deterministic parser first" />
        <StatusChip label="Execution requires confirmation" />
      </Stack>
    </SurfaceCard>
  );

  const renderHostedView = () => (
      <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SurfaceCard
          eyebrow={copy.aboutTitle}
          title={copy.hostedTitle}
          description={copy.hostedBody}
        >
          <Stack spacing={1.25}>
            {copy.quickStartSteps.map((step) => (
              <Alert key={step} severity="info" sx={{ alignItems: "center" }}>
                {step}
              </Alert>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {copy.hostedWorkspaceNotice}
          </Typography>
        </SurfaceCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SurfaceCard
          eyebrow={copy.demoTitle}
          title={copy.selectedDemoTitle}
          description={copy.selectedDemoHelper}
          actions={<StatusChip label={selectedDemo.action} color={isMutatingAction(selectedDemo.action) ? "warning" : "success"} />}
        >
          <Tabs
            value={featuredDemos.findIndex((entry) => entry.id === selectedDemo.id)}
            onChange={(_event, nextIndex) => onSelectDemo(featuredDemos[nextIndex].id)}
            variant="fullWidth"
            aria-label="demo-tabs"
          >
            {featuredDemos.map((demo) => (
              <Tab key={demo.id} label={demo.label.split("·")[0].trim()} />
            ))}
          </Tabs>
          <TextField
            aria-label="chat-input"
            label={copy.instructionTitle}
            value={selectedDemo.text}
            multiline
            minRows={4}
            InputProps={{ readOnly: true }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <ActionButton variant="contained" onClick={() => applyDemoPreview(selectedDemo)}>
              {copy.demoRunButton}
            </ActionButton>
            <ActionButton variant="outlined" onClick={() => void onCopyQuery()} disabled={!visibleOutput}>
              {copied ? "Copied" : copy.copyQueryButton}
            </ActionButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {copy.reviewHelper}
          </Typography>
        </SurfaceCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <SurfaceCard
            eyebrow={copy.generatedQueryTitle}
            title={selectedDemo.label}
            description={isMutatingAction(selectedDemo.action) ? copy.destructiveExecutionHint : copy.safeExecutionHint}
            compact
          >
            <CodePanel label="Mongo Shell" value={mongoShell} emptyText={copy.noGeneratedQuery} />
          </SurfaceCard>
          <SurfaceCard eyebrow={copy.resultTitle} title={copy.aboutTitle} description={copy.aboutBody} compact>
            <CodePanel label="Mock result" value={resultView} emptyText={copy.noResult} />
          </SurfaceCard>
        </Stack>
      </Grid>
    </Grid>
  );

  const renderLocalView = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Stack spacing={2.5}>
          <SurfaceCard eyebrow={copy.quickStartTitle} title={copy.chatTitle} description={copy.workspaceDescription}>
            <form onSubmit={(event) => void onGenerate(event)}>
              <Stack spacing={2}>
                <TextField
                  aria-label="chat-input"
                  label={copy.instructionTitle}
                  placeholder={copy.placeholder}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  multiline
                  minRows={5}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <ActionButton type="submit" disabled={isSending || !input.trim()}>
                    {isSending ? copy.generatingButton : copy.generateButton}
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    onClick={() => void (operation ? executeOperation(operation) : onRunDemo())}
                    disabled={isBusy || (!operation && !selectedDemo)}
                  >
                    {isExecuting ? copy.executingButton : copy.executeButton}
                  </ActionButton>
                </Stack>
              </Stack>
            </form>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {quickExamples[language].map((example) => (
                <ActionButton key={example} variant="text" onClick={() => setInput(example)}>
                  {example}
                </ActionButton>
              ))}
            </Stack>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {modelLoadError ? <Alert severity="warning">{modelLoadError}</Alert> : null}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl size="small" fullWidth>
                <InputLabel id="local-model-label">{copy.localModelLabel}</InputLabel>
                <Select
                  labelId="local-model-label"
                  aria-label="local-model-select"
                  value={selectedModel}
                  label={copy.localModelLabel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  disabled={isLoadingModels}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </SurfaceCard>

          <SurfaceCard eyebrow={copy.demoTitle} title={copy.demoDescription}>
            <Tabs
              value={demoCases.findIndex((entry) => entry.id === selectedDemo.id)}
              onChange={(_event, nextIndex) => onSelectDemo(demoCases[nextIndex].id)}
              variant="scrollable"
              allowScrollButtonsMobile
              aria-label="demo-tabs"
            >
              {demoCases.map((demo) => (
                <Tab key={demo.id} label={demo.label} />
              ))}
            </Tabs>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <ActionButton variant="outlined" onClick={() => setInput(selectedDemo.text)}>
                {copy.demoLoadButton}
              </ActionButton>
              <ActionButton variant="contained" onClick={() => void onRunDemo()}>
                {copy.demoRunButton}
              </ActionButton>
            </Stack>
          </SurfaceCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <Stack spacing={2.5}>
          <SurfaceCard
            eyebrow={copy.generatedQueryTitle}
            title={operation ? `${operation.action} · ${operation.collection}` : copy.statusWaiting}
            description={operation ? copy.reviewHelper : copy.reviewSummaryEmpty}
            actions={
              <Stack direction="row" spacing={1}>
                <ActionButton variant="text" onClick={() => void onCopyQuery()} disabled={!visibleOutput}>
                  {copied ? "Copied" : copy.copyQueryButton}
                </ActionButton>
                <ActionButton variant="text" onClick={clearOperationState} disabled={!visibleOutput && !resultView}>
                  Clear
                </ActionButton>
              </Stack>
            }
          >
            <CodePanel label="Mongo Shell" value={visibleOutput} emptyText={copy.noGeneratedQuery} />
            <CodePanel label="Execution result" value={resultView} emptyText={copy.noResult} />
          </SurfaceCard>

          <SurfaceCard
            eyebrow={copy.databaseViewerTitle}
            title={copy.databaseViewerOutcomeTitle}
            description={copy.databaseViewerOutcomeDescription}
            actions={<StatusChip label={copy.localSimulationTag} />}
          >
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {localCollections.map((collection) => (
                <ActionButton key={collection.name} variant={selectedCollection?.name === collection.name ? "contained" : "outlined"} onClick={() => setSelectedCollectionName(collection.name)}>
                  {collection.name}
                </ActionButton>
              ))}
            </Stack>
            <CodePanel
              label={selectedCollection?.name ?? copy.databaseRecordsTitle}
              value={selectedCollection ? stringify(selectedCollection.documents) : ""}
              emptyText={copy.databaseEmptyCollection}
            />
          </SurfaceCard>

          <SurfaceCard eyebrow={copy.logsTitle} title={copy.historyEmpty}>
            <Stack spacing={1.25}>
              {latestLogs.map((entry) => (
                <Alert key={entry.id} severity={entry.role === "assistant" ? "info" : "success"}>
                  <strong>{entry.role}</strong>: {entry.text}
                </Alert>
              ))}
            </Stack>
          </SurfaceCard>
        </Stack>
      </Grid>
    </Grid>
  );

  return (
    <PageFrame>
      <Stack spacing={2.5}>
        {renderHeader()}
        {isInteractive ? renderLocalView() : renderHostedView()}
      </Stack>
    </PageFrame>
  );
}
