import type { FormEvent, ReactNode } from "react";
import type { ChatResolverSource, MongoOperation } from "@/types/mongo";
import {
  ActionRow,
  Button,
  Code,
  CodeLine,
  CodeTokenKey,
  CodeTokenMethod,
  CodeTokenNumber,
  CodeTokenPlain,
  CodeTokenString,
  DatabaseRecordPre,
  ErrorText,
  Form,
  LogBadge,
  LogItem,
  LogList,
  MutedText,
  Panel,
  PanelTitle,
  PipelineRail,
  PipelineStep,
  Result,
  SectionHeader,
  SectionLabel,
  SummaryCard,
  SummaryText,
  Tag,
  TagRow,
  Textarea,
  WorkflowCard,
  WorkflowGrid,
  WorkflowMain,
  WorkflowSide,
  WorkspaceSection
} from "../chatMongo.styles";
import type { CopyDictionary, DemoCase, Language, Message } from "../chatMongo.types";

interface ChatMongoWorkspacePanelProps {
  copy: CopyDictionary;
  language: Language;
  input: string;
  mongoShell: string;
  resultView: string;
  error: string;
  operation: MongoOperation | null;
  resolver: ChatResolverSource | null;
  isSending: boolean;
  isExecuting: boolean;
  isInteractive: boolean;
  messages: Message[];
  selectedDemo: DemoCase;
  onInputChange: (value: string) => void;
  onGenerate: (event: FormEvent) => Promise<void>;
  onExecute: () => Promise<void>;
}

const renderHighlightedMongoCode = (value: string): ReactNode => {
  if (!value) {
    return null;
  }

  const lines = value.split("\n");

  return lines.map((line, lineIndex) => {
    const fragments = line.split(/("(?:[^"\\]|\\.)*"|\b\d+(?:\.\d+)?\b|\bdb\b|\b[a-zA-Z_][\w]*(?=\()|\b[a-zA-Z_][\w]*(?=\s*:))/g);

    return (
      <CodeLine key={`${line}-${lineIndex}`}>
        {fragments.map((fragment, fragmentIndex) => {
          if (!fragment) {
            return null;
          }

          if (/^"(?:[^"\\]|\\.)*"$/.test(fragment)) {
            return <CodeTokenString key={`${fragment}-${fragmentIndex}`}>{fragment}</CodeTokenString>;
          }

          if (/^\d+(?:\.\d+)?$/.test(fragment)) {
            return <CodeTokenNumber key={`${fragment}-${fragmentIndex}`}>{fragment}</CodeTokenNumber>;
          }

          if (/^(db|find|insertOne|updateMany|deleteMany|countDocuments|aggregate|limit|sort)$/.test(fragment)) {
            return <CodeTokenMethod key={`${fragment}-${fragmentIndex}`}>{fragment}</CodeTokenMethod>;
          }

          if (/^[a-zA-Z_][\w]*$/.test(fragment) && line.includes(`${fragment}:`)) {
            return <CodeTokenKey key={`${fragment}-${fragmentIndex}`}>{fragment}</CodeTokenKey>;
          }

          return <CodeTokenPlain key={`${fragment}-${fragmentIndex}`}>{fragment}</CodeTokenPlain>;
        })}
      </CodeLine>
    );
  });
};

const stringifyValue = (value: unknown): string => JSON.stringify(value, null, 2);

const buildOperationSummary = (copy: CopyDictionary, language: Language, operation: MongoOperation | null): string => {
  if (!operation) {
    return copy.reviewSummaryEmpty;
  }

  if (operation.action === "find") {
    return language === "es"
      ? `Buscar en ${operation.collection} con el filtro ${JSON.stringify(operation.filter ?? {})}.`
      : `Find documents in ${operation.collection} using the filter ${JSON.stringify(operation.filter ?? {})}.`;
  }

  if (operation.action === "count") {
    return language === "es"
      ? `Contar documentos en ${operation.collection} usando el filtro ${JSON.stringify(operation.filter ?? {})}.`
      : `Count documents in ${operation.collection} using the filter ${JSON.stringify(operation.filter ?? {})}.`;
  }

  if (operation.action === "insertOne") {
    return language === "es"
      ? `Insertar un documento nuevo en ${operation.collection}.`
      : `Insert a new document into ${operation.collection}.`;
  }

  if (operation.action === "updateMany") {
    return language === "es"
      ? `Actualizar documentos en ${operation.collection} que cumplan ${JSON.stringify(operation.filter ?? {})}.`
      : `Update documents in ${operation.collection} that match ${JSON.stringify(operation.filter ?? {})}.`;
  }

  return language === "es"
    ? `Eliminar documentos en ${operation.collection} que cumplan ${JSON.stringify(operation.filter ?? {})}.`
    : `Delete documents in ${operation.collection} that match ${JSON.stringify(operation.filter ?? {})}.`;
};

export function ChatMongoWorkspacePanel({
  copy,
  language,
  input,
  mongoShell,
  resultView,
  error,
  operation,
  resolver,
  isSending,
  isExecuting,
  isInteractive,
  messages,
  selectedDemo,
  onInputChange,
  onGenerate,
  onExecute
}: ChatMongoWorkspacePanelProps) {
  const effectiveOperation = isInteractive ? operation : selectedDemo.operation;
  const effectiveMongoShell = isInteractive ? mongoShell : selectedDemo.mongoShell;
  const effectiveResultView = isInteractive ? resultView : JSON.stringify(selectedDemo.mockResult, null, 2);
  const effectiveResolver = isInteractive ? resolver : selectedDemo.llmMode === "force" ? "llm" : "deterministic";
  const effectiveInput = isInteractive ? input : selectedDemo.text;
  const hasOperation = effectiveOperation != null && effectiveMongoShell.length > 0;
  const isDestructive = effectiveOperation?.action === "updateMany" || effectiveOperation?.action === "deleteMany";
  const summaryText = buildOperationSummary(copy, language, effectiveOperation);
  const visibleLogs = isInteractive
    ? messages.slice(-6).reverse()
    : [
        { id: "hosted-demo-1", role: "user" as const, text: selectedDemo.text },
        { id: "hosted-demo-2", role: "assistant" as const, text: `${copy.queryReadyLabel}\n${selectedDemo.mongoShell}` },
        { id: "hosted-demo-3", role: "assistant" as const, text: stringifyValue(selectedDemo.mockResult) }
      ];

  return (
    <Panel>
      <SectionHeader>
        <PanelTitle>{copy.chatTitle}</PanelTitle>
        <TagRow>
          <Tag $tone={isInteractive ? "success" : "warning"}>{isInteractive ? copy.localSimulationTag : copy.hostedModeTag}</Tag>
        {effectiveResolver ? (
            <Tag>{`${copy.resolverTitle}: ${effectiveResolver === "llm" ? copy.resolverLlm : copy.resolverDeterministic}`}</Tag>
          ) : null}
        </TagRow>
      </SectionHeader>

      {!isInteractive ? (
        <WorkflowCard>
          <WorkspaceSection>
            <SectionLabel>{copy.hostedModeTag}</SectionLabel>
            <MutedText>{copy.hostedWorkspaceNotice}</MutedText>
          </WorkspaceSection>
        </WorkflowCard>
      ) : null}

      <PipelineRail aria-label="workflow-pipeline">
        {copy.flowSteps
          .filter((step) => ["input", "query", "mongo", "result"].includes(step.id))
          .map((step) => (
          <PipelineStep
            key={step.id}
            $active={
              (step.id === "input" && effectiveInput.trim().length > 0) ||
              (step.id === "query" && hasOperation) ||
              (step.id === "mongo" && (hasOperation || isExecuting)) ||
              (step.id === "result" && effectiveResultView.length > 0)
            }
          >
            <SectionLabel>{step.title}</SectionLabel>
            <MutedText>{step.detail}</MutedText>
          </PipelineStep>
        ))}
      </PipelineRail>

      <WorkflowGrid>
        <WorkflowMain>
          <WorkflowCard>
            <WorkspaceSection>
              <SectionHeader>
                <div>
                  <SectionLabel>{copy.instructionTitle}</SectionLabel>
                  <PanelTitle>{copy.chatTitle}</PanelTitle>
                </div>
                <Tag $tone={hasOperation ? "success" : "default"}>{hasOperation ? copy.statusReady : copy.statusWaiting}</Tag>
              </SectionHeader>
              <SummaryText>{copy.instructionHelper}</SummaryText>
              <Form onSubmit={onGenerate}>
                <Textarea
                  placeholder={copy.placeholder}
                  value={effectiveInput}
                  onChange={(event) => onInputChange(event.target.value)}
                  aria-label="chat-input"
                  disabled={!isInteractive}
                />
                <ActionRow>
                  <Button type="submit" disabled={isSending || !isInteractive}>
                    {isSending ? copy.generatingButton : copy.generateButton}
                  </Button>
                </ActionRow>
              </Form>
            </WorkspaceSection>
          </WorkflowCard>

          <WorkflowCard>
            <WorkspaceSection>
              <SectionHeader>
                <div>
                  <SectionLabel>{copy.generatedQueryTitle}</SectionLabel>
                  <PanelTitle>{copy.reviewHelper}</PanelTitle>
                </div>
                {effectiveOperation ? <Tag>{`${effectiveOperation.action} · ${effectiveOperation.collection}`}</Tag> : null}
              </SectionHeader>
              <SummaryCard $tone={isDestructive ? "danger" : "default"}>
                <SectionLabel>{copy.statusTitle}</SectionLabel>
                <SummaryText>{summaryText}</SummaryText>
                <MutedText>{isDestructive ? copy.destructiveExecutionHint : copy.safeExecutionHint}</MutedText>
              </SummaryCard>
              <Code aria-label="generated-query">
                {effectiveMongoShell ? renderHighlightedMongoCode(effectiveMongoShell) : copy.noGeneratedQuery}
              </Code>
              <ActionRow>
                <Button
                  type="button"
                  $variant={isDestructive ? "danger" : "secondary"}
                  onClick={() => void onExecute()}
                  disabled={!hasOperation || isExecuting || !isInteractive}
                >
                  {isExecuting ? copy.executingButton : copy.executeButton}
                </Button>
              </ActionRow>
            </WorkspaceSection>
          </WorkflowCard>

          <WorkflowCard>
            <WorkspaceSection>
              <SectionHeader>
                <div>
                  <SectionLabel>{copy.resultTitle}</SectionLabel>
                  <PanelTitle>{copy.databaseViewerOutcomeTitle}</PanelTitle>
                </div>
              </SectionHeader>
              <Result aria-label="execution-result">{effectiveResultView || copy.noResult}</Result>
            </WorkspaceSection>
          </WorkflowCard>
        </WorkflowMain>

        <WorkflowSide>
          <WorkflowCard>
            <WorkspaceSection>
              <SectionLabel>{copy.selectedDemoTitle}</SectionLabel>
              <PanelTitle>{selectedDemo.label}</PanelTitle>
              <SummaryText>{copy.selectedDemoHelper}</SummaryText>
              <SummaryCard>
                <SummaryText>{selectedDemo.text}</SummaryText>
              </SummaryCard>
            </WorkspaceSection>
          </WorkflowCard>

          <WorkflowCard>
            <WorkspaceSection>
              <SectionLabel>{copy.logsTitle}</SectionLabel>
              <LogList aria-label="activity-logs">
                {visibleLogs.length === 0 ? (
                  <SummaryCard>
                    <MutedText>{copy.historyEmpty}</MutedText>
                  </SummaryCard>
                ) : (
                  visibleLogs.map((message, index) => (
                    <LogItem key={`${message.id}-${index}`}>
                      <LogBadge $role={message.role}>{message.role === "user" ? "user" : "system"}</LogBadge>
                      <DatabaseRecordPre>{message.text}</DatabaseRecordPre>
                    </LogItem>
                  ))
                )}
              </LogList>
            </WorkspaceSection>
          </WorkflowCard>
        </WorkflowSide>
      </WorkflowGrid>

      {error ? <ErrorText role="alert">{error}</ErrorText> : null}
    </Panel>
  );
}
