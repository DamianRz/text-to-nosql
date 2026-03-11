import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 40px 16px 64px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: var(--font-ui), "Inter", sans-serif;

  @media (max-width: 760px) {
    padding: 24px 16px 48px;
  }
`;

export const Container = styled.section`
  width: min(800px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 24px;
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
    order: 4;
  }

  @media (max-width: 760px) {
    padding: 16px;
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
  display: grid;
  gap: 6px;
`;

export const HeaderText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
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
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 760px) {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }
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

  @media (max-width: 760px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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

  @media (max-width: 760px) {
    width: 100%;
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

  @media (max-width: 760px) {
    width: 100%;
  }
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

  @media (max-width: 760px) {
    width: 100%;
    min-width: 0;
  }

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
