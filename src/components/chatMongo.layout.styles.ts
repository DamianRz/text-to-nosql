import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 16px;
  background:
    radial-gradient(circle at top left, ${({ theme }) => theme.colors.backgroundGlow}, transparent 28%),
    linear-gradient(180deg, #030817 0%, ${({ theme }) => theme.colors.background} 100%);
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: var(--font-ui), "Inter", sans-serif;
`;

export const Container = styled.section`
  width: min(1400px, 100%);
  min-height: calc(100vh - 32px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 420px;
  grid-template-rows: 64px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 220px minmax(0, 1fr) 360px;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    min-height: auto;
  }
`;

export const Sidebar = styled.aside`
  grid-row: 1 / span 2;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 16px;
  padding: 16px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: #0b1220;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 980px) {
    grid-row: auto;
  }
`;

export const SidebarBrand = styled.div`
  display: grid;
  gap: 8px;
`;

export const SidebarLogo = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: ${({ theme }) => theme.colors.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const SidebarProject = styled.div`
  display: grid;
  gap: 4px;
`;

export const SidebarProjectName = styled.h1`
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SidebarSection = styled.section`
  display: grid;
  gap: 8px;
`;

export const SidebarSectionTitle = styled.h2`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SidebarNav = styled.div`
  display: grid;
  gap: 6px;
  max-height: 420px;
  overflow: auto;
  padding-right: 2px;
`;

export const SidebarNavButton = styled.button<{ $active: boolean }>`
  height: 36px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.borderStrong : "transparent")};
  border-radius: 6px;
  padding: 0 12px;
  background: ${({ $active, theme }) => ($active ? "rgba(59, 130, 246, 0.14)" : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease;

  &:hover {
    background: #1a2333;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const SidebarMetaList = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;
`;

export const SidebarMetaItem = styled.div`
  display: grid;
  gap: 3px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.9);
`;

export const Header = styled.header`
  grid-column: 2 / span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: #0f172a;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 980px) {
    grid-column: 1;
    padding: 16px;
    min-height: 64px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderText = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PreviewSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const PreviewLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PreviewPillGroup = styled.div`
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: #111827;
`;

export const PreviewPill = styled.button<{ $active: boolean }>`
  min-width: 74px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ $active, theme }) => ($active ? "#eff6ff" : theme.colors.textSecondary)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;

  &:hover {
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25) inset;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const LanguageField = styled.label`
  display: inline-grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Select = styled.select`
  min-width: 170px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #020617;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-family: var(--font-ui), "Inter", sans-serif;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }
`;

export const WorkspaceColumn = styled.section`
  min-width: 0;
  display: grid;
  align-content: start;
`;

export const ResultsColumn = styled.aside`
  min-width: 0;
  display: grid;
  align-content: start;
`;
