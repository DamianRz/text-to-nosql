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
    font-family: var(--font-ui), "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
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
    border-radius: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  pre,
  code {
    font-family: var(--font-mono), "Roboto Mono", monospace;
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
