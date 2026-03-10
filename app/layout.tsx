import type { Metadata } from "next";
import { AppThemeProvider } from "@/components/AppThemeProvider";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: {
    default: "Natural Language to MongoDB",
    template: "%s | Natural Language to MongoDB"
  },
  description: "A professional workflow for turning natural language into auditable MongoDB operations.",
  applicationName: "Natural Language to MongoDB",
  keywords: ["MongoDB", "Next.js", "NLP", "LLM", "query builder"],
  openGraph: {
    title: "Natural Language to MongoDB",
    description: "A controlled pipeline from natural language to MongoDB queries without losing traceability.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>
        <StyledComponentsRegistry>
          <AppThemeProvider>{children}</AppThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
