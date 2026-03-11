import { createTheme } from "@mui/material/styles";

const legacyTokens = {
  colors: {
    background: "#f3f6fb",
    backgroundGlow: "rgba(0, 0, 0, 0)",
    backgroundGlowSecondary: "rgba(0, 0, 0, 0)",
    surface: "#ffffff",
    surfaceStrong: "#eef3f9",
    panel: "#ffffff",
    panelMuted: "#f7f9fc",
    border: "#dbe3ee",
    borderStrong: "#b4c1d1",
    textPrimary: "#132238",
    textSecondary: "#556579",
    accent: "#1f5eff",
    accentStrong: "#1447c7",
    accentSoft: "rgba(31, 94, 255, 0.12)",
    codeBackground: "#0f172a",
    codeBorder: "#1e293b",
    codeText: "#e2e8f0",
    success: "#2e7d32",
    warning: "#c97a10",
    danger: "#b3261e"
  },
  radius: {
    card: "8px",
    control: "8px"
  },
  shadow: "0 4px 12px rgba(15, 23, 42, 0.04)"
};

export const appTheme = Object.assign(
  createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f5eff",
      dark: "#1447c7",
      light: "#5b8bff",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#425466"
    },
    background: {
      default: "#f3f6fb",
      paper: "#ffffff"
    },
    text: {
      primary: "#132238",
      secondary: "#556579"
    },
    divider: "#dbe3ee",
    success: {
      main: "#2e7d32"
    },
    warning: {
      main: "#c97a10"
    },
    error: {
      main: "#b3261e"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: 'var(--font-ui), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 600
    },
    body1: {
      fontSize: "0.98rem",
      lineHeight: 1.7
    },
    body2: {
      fontSize: "0.92rem",
      lineHeight: 1.65
    },
    button: {
      fontWeight: 600,
      textTransform: "none"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%)",
          color: "#132238",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased"
        },
        "pre, code": {
          fontFamily: 'var(--font-mono), "Roboto Mono", monospace'
        },
        "::selection": {
          backgroundColor: "rgba(31, 94, 255, 0.16)"
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          border: "1px solid #dbe3ee",
          borderRadius: 8,
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 40,
          paddingInline: 16
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 26
        },
        label: {
          paddingInline: 10
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#ffffff"
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 12,
          borderRadius: 0
        }
      }
    }
  }
  }),
  legacyTokens
);

export type AppTheme = typeof appTheme;
