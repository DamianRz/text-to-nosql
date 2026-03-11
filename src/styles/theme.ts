export const appTheme = {
  colors: {
    background: "#f5f7fa",
    backgroundGlow: "rgba(0, 0, 0, 0)",
    backgroundGlowSecondary: "rgba(0, 0, 0, 0)",
    surface: "#ffffff",
    surfaceStrong: "#eef2f6",
    panel: "#ffffff",
    panelMuted: "#f7f9fc",
    border: "#d7dde4",
    borderStrong: "#b7c0cb",
    textPrimary: "#1b1f24",
    textSecondary: "#5f6b7a",
    accent: "#6750a4",
    accentStrong: "#4f378b",
    accentSoft: "rgba(103, 80, 164, 0.1)",
    codeBackground: "#1f1f1f",
    codeBorder: "#2d2d2d",
    codeText: "#f3f4f6",
    success: "#2e7d32",
    warning: "#b26a00",
    danger: "#b3261e"
  },
  radius: {
    card: "12px",
    control: "12px"
  },
  shadow: "0 1px 2px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.12)"
};

export type AppTheme = typeof appTheme;
