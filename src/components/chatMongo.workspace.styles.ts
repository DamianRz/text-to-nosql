import styled from "styled-components";

export const Panel = styled.section`
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const MutedText = styled.span`
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.danger};
`;

export const Tag = styled.span<{ $tone?: "default" | "success" | "warning" }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone, theme }) =>
      $tone === "success" ? "rgba(34, 197, 94, 0.24)" : $tone === "warning" ? "rgba(245, 158, 11, 0.24)" : theme.colors.border};
  background: ${({ $tone, theme }) =>
    $tone === "success"
      ? "rgba(34, 197, 94, 0.12)"
      : $tone === "warning"
        ? "rgba(245, 158, 11, 0.12)"
        : "rgba(15, 23, 42, 0.84)"};
  color: ${({ $tone, theme }) =>
    $tone === "success" ? theme.colors.success : $tone === "warning" ? theme.colors.warning : theme.colors.textSecondary};
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
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const WorkspaceSection = styled.section`
  display: grid;
  gap: 12px;
`;

export const PipelineRail = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const PipelineStep = styled.div`
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #0b1220;
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const InstallList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

export const InstallItem = styled.li`
  display: grid;
  gap: 6px;
`;

export const WorkflowCard = styled.section`
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: #0b1220;
  min-width: 0;
  align-content: start;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const UtilityField = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #020617;
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.6;

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
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" | "ghost" }>`
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "secondary" ? "rgba(34, 197, 94, 0.28)" : $variant === "ghost" ? theme.colors.border : theme.colors.accent};
  background: ${({ $variant, theme }) =>
    $variant === "secondary"
      ? theme.colors.success
      : $variant === "ghost"
        ? "transparent"
        : theme.colors.accent};
  color: ${({ $variant }) => ($variant === "ghost" ? "#e6edf3" : "#eff6ff")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) =>
      $variant === "secondary" ? "#16a34a" : $variant === "ghost" ? "#0b1220" : theme.colors.accentStrong};
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02) inset, 0 10px 24px rgba(37, 99, 235, 0.16);
  }

  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Code = styled.pre`
  margin: 0;
  min-height: 220px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.codeBorder};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.codeText};
  overflow: auto;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
`;

export const Result = styled.pre`
  margin: 0;
  min-height: 220px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #020617;
  color: ${({ theme }) => theme.colors.textPrimary};
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
  color: #a78bfa;
`;

export const CodeTokenKey = styled.span`
  color: #60a5fa;
`;

export const CodeTokenString = styled.span`
  color: #34d399;
`;

export const CodeTokenNumber = styled.span`
  color: #f59e0b;
`;

export const DatabaseViewer = styled.section`
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: #020617;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const DatabaseViewerLayout = styled.div`
  display: grid;
  gap: 16px;
  grid-template-rows: auto minmax(0, 1fr);
`;

export const DatabaseSidebar = styled.div`
  display: grid;
  gap: 8px;
`;

export const DatabaseCollectionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.borderStrong : theme.colors.border)};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "rgba(59, 130, 246, 0.1)" : "#030b1a")};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;

  &:hover {
    background: #0b1220;
    color: ${({ theme }) => theme.colors.textPrimary};
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
  min-width: 30px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.14);
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  font-weight: 700;
`;

export const DatabaseRecords = styled.div`
  display: grid;
  gap: 10px;
`;

export const DatabaseRecordList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  max-height: 520px;
  overflow: auto;
`;

export const DatabaseRecordItem = styled.li`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #030b1a;
`;

export const DatabaseRecordPre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.55;
`;

export const LogList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  max-height: 220px;
  overflow: auto;
`;

export const LogItem = styled.li`
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #030b1a;
`;

export const LogBadge = styled.span<{ $role: "user" | "assistant" }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${({ $role }) => ($role === "user" ? "rgba(59, 130, 246, 0.14)" : "rgba(34, 197, 94, 0.12)")};
  color: ${({ $role, theme }) => ($role === "user" ? theme.colors.accent : theme.colors.success)};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;
