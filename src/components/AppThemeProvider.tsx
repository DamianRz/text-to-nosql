"use client";

import type { PropsWithChildren } from "react";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { appTheme } from "@/styles/theme";

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*": {
            boxSizing: "border-box"
          },
          "*::-webkit-scrollbar": {
            width: 10,
            height: 10
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#b4c1d1",
            borderRadius: 999
          },
          "*::-webkit-scrollbar-track": {
            background: "#edf2f7"
          }
        }}
      />
      {children}
    </ThemeProvider>
  );
}
