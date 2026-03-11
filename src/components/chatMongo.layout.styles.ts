import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 18px;
  background:
    radial-gradient(circle at top left, ${({ theme }) => theme.colors.backgroundGlow}, transparent 30%),
    linear-gradient(180deg, #fbfcfe 0%, ${({ theme }) => theme.colors.background} 100%);
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: var(--font-ui), "Inter", sans-serif;
`;

export const Container = styled.section`
  width: min(1440px, 100%);
  min-height: calc(100vh - 36px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  gap: 18px;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const Sidebar = styled.aside`
  grid-row: 1 / span 3;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 1040px) {
    grid-row: auto;
  }
`;

export const SidebarBrand = styled.div`
  display: grid;
  gap: 10px;
`;

export const SidebarLogo = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(9, 105, 218, 0.18);
  background: rgba(9, 105, 218, 0.08);
  color: ${({ theme }) => theme.colors.accentStrong};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const SidebarProject = styled.div`
  display: grid;
  gap: 6px;
`;

export const SidebarProjectName = styled.h1`
  margin: 0;
  font-size: 22px;
  line-height: 1.12;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SidebarSection = styled.section`
  display: grid;
  gap: 10px;
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
  gap: 8px;
  max-height: 420px;
  overflow: auto;
  padding-right: 2px;
`;

export const SidebarNavButton = styled.button<{ $active: boolean }>`
  display: grid;
  gap: 3px;
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accentSoft : theme.colors.panelMuted)};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const SidebarMetaList = styled.div`
  display: grid;
  gap: 8px;
`;

export const SidebarMetaItem = styled.div`
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.panelMuted};
`;

export const Header = styled.header`
  grid-column: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 1040px) {
    grid-column: 1;
  }

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const HeaderText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 30px;
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PreviewSwitch = styled.div`
  display: flex;
  align-items: flex-start;
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
  background: ${({ theme }) => theme.colors.panelMuted};
`;

export const PreviewPill = styled.button<{ $active: boolean }>`
  min-width: 82px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#59636e")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

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
  min-width: 176px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-family: var(--font-ui), "Inter", sans-serif;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }
`;

export const WorkspaceColumn = styled.section`
  grid-column: 2;
  min-width: 0;
  display: grid;
  align-content: start;

  @media (max-width: 1040px) {
    grid-column: 1;
  }
`;

export const ResultsColumn = styled.aside`
  grid-column: 2;
  min-width: 0;
  display: grid;
  align-content: start;

  @media (max-width: 1040px) {
    grid-column: 1;
  }
`;
