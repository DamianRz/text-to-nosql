"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

export function PageFrame({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 4 }
      }}
    >
      <Box sx={{ width: "min(1180px, 100%)", mx: "auto" }}>{children}</Box>
    </Box>
  );
}

export function SurfaceCard({
  eyebrow,
  title,
  description,
  actions,
  children,
  compact = false
}: PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
}>) {
  return (
    <Paper
      sx={{
        p: compact ? 2.25 : { xs: 2.25, md: 3 },
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)"
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Box>
          {eyebrow ? (
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.08em", fontWeight: 700 }}>
              {eyebrow}
            </Typography>
          ) : null}
          <Typography variant="h2" sx={{ fontSize: { xs: "1.2rem", md: "1.35rem" } }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {actions}
      </Stack>
      {children}
    </Paper>
  );
}

export function StatusChip({ label, color = "default" }: { label: string; color?: "default" | "primary" | "success" | "warning" }) {
  return <Chip label={label} color={color} size="small" variant={color === "default" ? "outlined" : "filled"} sx={{ fontWeight: 600 }} />;
}

export function ActionButton({
  children,
  variant = "contained",
  ...props
}: PropsWithChildren<{
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}>) {
  return (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  );
}

export function CodePanel({
  label,
  value,
  emptyText,
  actions
}: {
  label: string;
  value: string;
  emptyText: string;
  actions?: ReactNode;
}) {
  return (
    <Paper
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        bgcolor: "#0f172a",
        borderColor: "#0f172a"
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(226,232,240,0.8)", fontWeight: 700, letterSpacing: "0.08em" }}>
          {label}
        </Typography>
        {actions}
      </Stack>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          minHeight: 154,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "#e2e8f0",
          fontSize: 13,
          lineHeight: 1.7,
          fontFamily: 'var(--font-mono), "Roboto Mono", monospace'
        }}
      >
        {value || emptyText}
      </Box>
    </Paper>
  );
}
