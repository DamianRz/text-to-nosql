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
  Tag,
  TagRow,
  Textarea,
  WorkflowCard,
  WorkflowGrid,
  WorkspaceSection
} from "../chatMongo.styles";
import type { CopyDictionary, DemoCase, Message } from "../chatMongo.types";

interface ChatMongoWorkspacePanelProps {
  copy: CopyDictionary;
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

export function ChatMongoWorkspacePanel({
  copy,
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
  const visibleLogs = isInteractive
    ? messages.slice(-6).reverse()
    : [
        { id: "hosted-demo-1", role: "user" as const, text: selectedDemo.text },
        { id: "hosted-demo-2", role: "assistant" as const, text: `${copy.queryReadyLabel}\n${selectedDemo.mongoShell}` },
        { id: "hosted-demo-3", role: "assistant" as const, text: JSON.stringify(selectedDemo.mockResult, null, 2) }
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
        {copy.flowSteps.slice(0, 5).map((step) => (
          <PipelineStep key={step.id}>
            <MutedText>{step.title}</MutedText>
          </PipelineStep>
        ))}
      </PipelineRail>

      <WorkflowGrid>
        <WorkflowCard>
          <WorkspaceSection>
            <SectionLabel>{copy.instructionTitle}</SectionLabel>
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
              <SectionLabel>{copy.generatedQueryTitle}</SectionLabel>
              {effectiveOperation ? <Tag>{`${effectiveOperation.action} · ${effectiveOperation.collection}`}</Tag> : null}
            </SectionHeader>
            <Code aria-label="generated-query">
              {effectiveMongoShell ? renderHighlightedMongoCode(effectiveMongoShell) : copy.noGeneratedQuery}
            </Code>
            <ActionRow>
              <Button
                type="button"
                $variant="secondary"
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
            <SectionLabel>{copy.resultTitle}</SectionLabel>
            <Result aria-label="execution-result">{effectiveResultView || copy.noResult}</Result>
          </WorkspaceSection>
        </WorkflowCard>

        <WorkflowCard>
          <WorkspaceSection>
            <SectionLabel>{copy.logsTitle}</SectionLabel>
            <LogList aria-label="activity-logs">
              {visibleLogs.map((message, index) => (
                <LogItem key={`${message.id}-${index}`}>
                  <LogBadge $role={message.role}>{message.role === "user" ? "user" : "system"}</LogBadge>
                  <DatabaseRecordPre>{message.text}</DatabaseRecordPre>
                </LogItem>
              ))}
            </LogList>
          </WorkspaceSection>
        </WorkflowCard>
      </WorkflowGrid>

      {error ? <ErrorText role="alert">{error}</ErrorText> : null}
    </Panel>
  );
}
