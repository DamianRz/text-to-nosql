import styled from "styled-components";

export const Panel = styled.section`
  display: grid;
  gap: 24px;
`;

export const ToolStack = styled.div`
  display: grid;
  gap: 24px;
`;

export const Card = styled.section`
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 760px) {
    padding: 18px;
  }
`;

export const HeroText = styled.div`
  display: grid;
  gap: 6px;
`;

export const HelperText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ExampleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ExampleChip = styled.button`
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const ResultFrame = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.codeText};
`;

export const ResultToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ToolbarActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const GhostButton = styled.button`
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid rgba(226, 232, 240, 0.18);
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.codeText};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(226, 232, 240, 0.08);
  }
`;

export const AdvancedDetails = styled.details`
  display: grid;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const AdvancedSummary = styled.summary`
  cursor: pointer;
  list-style: none;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  &::-webkit-details-marker {
    display: none;
  }
`;

export const AdvancedContent = styled.div`
  display: grid;
  gap: 20px;
  padding-top: 16px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DemoGrid = styled.div`
  display: grid;
  gap: 10px;
`;

export const DemoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surfaceStrong};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const DemoText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const SecondaryButton = styled.button`
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CodeOutput = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const MutedText = styled.span`
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorText = styled.p`
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(207, 34, 46, 0.18);
  border-radius: 12px;
  background: rgba(207, 34, 46, 0.06);
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.danger};
`;

export const Tag = styled.span<{ $tone?: "default" | "success" | "warning" | "danger" }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone, theme }) => {
      if ($tone === "success") {
        return "rgba(26, 127, 55, 0.2)";
      }

      if ($tone === "warning") {
        return "rgba(154, 103, 0, 0.22)";
      }

      if ($tone === "danger") {
        return "rgba(207, 34, 46, 0.2)";
      }

      return theme.colors.border;
    }};
  background: ${({ $tone, theme }) => {
    if ($tone === "success") {
      return "rgba(26, 127, 55, 0.08)";
    }

    if ($tone === "warning") {
      return "rgba(154, 103, 0, 0.08)";
    }

    if ($tone === "danger") {
      return "rgba(207, 34, 46, 0.08)";
    }

    return theme.colors.panelMuted;
  }};
  color: ${({ $tone, theme }) => {
    if ($tone === "success") {
      return theme.colors.success;
    }

    if ($tone === "warning") {
      return theme.colors.warning;
    }

    if ($tone === "danger") {
      return theme.colors.danger;
    }

    return theme.colors.textSecondary;
  }};
  font-size: 12px;
  font-weight: 600;
`;

export const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SectionLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const WorkspaceSection = styled.section`
  display: grid;
  gap: 12px;
`;

export const PipelineRail = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 820px) {
    grid-auto-flow: column;
    grid-auto-columns: minmax(190px, 1fr);
    overflow-x: auto;
    padding-bottom: 4px;
  }
`;

export const PipelineStep = styled.div<{ $active?: boolean }>`
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accentSoft : theme.colors.panelMuted)};
  box-shadow: ${({ $active }) => ($active ? "0 0 0 1px rgba(9, 105, 218, 0.06) inset" : "none")};
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const WorkflowMain = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

export const WorkflowSide = styled.aside`
  display: grid;
  gap: 16px;
  align-content: start;
  min-width: 0;
`;

export const WorkflowCard = styled.section`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  min-width: 0;

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

export const QuickStartCard = styled.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid rgba(9, 105, 218, 0.18);
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(9, 105, 218, 0.08), rgba(255, 255, 255, 0.96)),
    ${({ theme }) => theme.colors.surface};

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

export const InstructionList = styled.ol`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  line-height: 1.6;
`;

export const InstructionItem = styled.li`
  padding-left: 2px;
`;

export const SummaryCard = styled.div<{ $tone?: "default" | "danger" }>`
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid
    ${({ $tone, theme }) => ($tone === "danger" ? "rgba(207, 34, 46, 0.18)" : theme.colors.border)};
  border-radius: 12px;
  background: ${({ $tone, theme }) => ($tone === "danger" ? "rgba(207, 34, 46, 0.05)" : theme.colors.panelMuted)};
`;

export const SummaryText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 156px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  font-family: var(--font-ui), "Inter", sans-serif;
  font-size: 14px;
  line-height: 1.6;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 760px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" | "ghost" | "danger" }>`
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid
    ${({ $variant, theme }) => {
      if ($variant === "secondary") {
        return theme.colors.border;
      }

      if ($variant === "ghost") {
        return theme.colors.border;
      }

      if ($variant === "danger") {
        return theme.colors.danger;
      }

      return theme.colors.accent;
    }};
  background: ${({ $variant, theme }) => {
    if ($variant === "secondary") {
      return theme.colors.surface;
    }

    if ($variant === "ghost") {
      return theme.colors.panelMuted;
    }

    if ($variant === "danger") {
      return theme.colors.danger;
    }

    return theme.colors.accent;
  }};
  color: ${({ $variant, theme }) => (($variant === "primary" || $variant === "danger") ? "#ffffff" : theme.colors.textPrimary)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) => {
      if ($variant === "secondary") {
        return theme.colors.panelMuted;
      }

      if ($variant === "ghost") {
        return theme.colors.surfaceStrong;
      }

      if ($variant === "danger") {
        return "#b62324";
      }

      return theme.colors.accentStrong;
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (max-width: 760px) {
    width: 100%;
    justify-content: center;
  }
`;

export const Code = styled.pre`
  margin: 0;
  min-height: 180px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.codeBorder};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.codeText};
  overflow: auto;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
`;

export const Result = styled.pre`
  margin: 0;
  min-height: 180px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.codeBorder};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.codeText};
  overflow: auto;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
`;

export const CodeLine = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

export const CodeTokenPlain = styled.span`
  color: ${({ theme }) => theme.colors.codeText};
`;

export const CodeTokenMethod = styled.span`
  color: ${({ theme }) => theme.colors.accentStrong};
  font-weight: 600;
`;

export const CodeTokenKey = styled.span`
  color: #8250df;
`;

export const CodeTokenString = styled.span`
  color: #0a7b83;
`;

export const CodeTokenNumber = styled.span`
  color: #9a6700;
`;

export const LogList = styled.div`
  display: grid;
  gap: 10px;

  @media (max-width: 760px) {
    gap: 8px;
  }
`;

export const LogItem = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.panelMuted};
`;

export const LogBadge = styled.span<{ $role: "user" | "assistant" }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${({ $role, theme }) => ($role === "user" ? theme.colors.accentSoft : theme.colors.surfaceStrong)};
  color: ${({ $role, theme }) => ($role === "user" ? theme.colors.accentStrong : theme.colors.textSecondary)};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const DatabaseViewer = styled.section`
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 760px) {
    gap: 14px;
    padding: 16px;
  }
`;

export const DatabaseViewerLayout = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const DatabaseSidebar = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;

  @media (max-width: 860px) {
    grid-auto-flow: column;
    grid-auto-columns: minmax(160px, 1fr);
    overflow-x: auto;
    padding-bottom: 4px;
  }
`;

export const DatabaseCollectionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: 10px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accentSoft : theme.colors.panelMuted)};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const DatabaseCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

export const DatabaseRecords = styled.section`
  display: grid;
  gap: 12px;
  min-width: 0;
`;

export const DatabaseRecordList = styled.div`
  display: grid;
  gap: 10px;
  max-height: 520px;
  overflow: auto;
`;

export const DatabaseRecordItem = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.panelMuted};
  overflow: hidden;
`;

export const DatabaseRecordPre = styled.pre`
  margin: 0;
  padding: 14px;
  color: ${({ theme }) => theme.colors.codeText};
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 12px;
  line-height: 1.6;
`;
