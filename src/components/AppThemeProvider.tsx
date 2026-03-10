"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { appTheme } from "@/styles/theme";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-ui), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, ${({ theme }) => theme.colors.backgroundGlow}, transparent 32%),
      radial-gradient(circle at top right, ${({ theme }) => theme.colors.backgroundGlowSecondary}, transparent 26%),
      linear-gradient(180deg, #09121f 0%, ${({ theme }) => theme.colors.background} 58%, #050b14 100%);
    color: ${({ theme }) => theme.colors.textPrimary};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderStrong};
    border-radius: 999px;
  }

  *::-webkit-scrollbar-track {
    background: rgba(5, 12, 24, 0.9);
  }

  pre,
  code {
    font-family: var(--font-mono), "IBM Plex Mono", monospace;
  }
`;

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={appTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
