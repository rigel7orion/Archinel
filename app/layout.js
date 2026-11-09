
import {
  UnifrakturCook,
  Inter,
  IBM_Plex_Mono,
} from "next/font/google";

import { ThemeProvider } from "next-themes";
import "./globals.css";

// Gothic display typography
const gothic = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-unifraktur",
});

// Clean interface typography
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Technical typography
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: {
    default: "Archinel | Web Threat Intelligence",
    template: "%s | Archinel",
  },
  description:
    "Look beyond the padlock. Investigate website security, detect phishing threats and understand digital trust with Archinel.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${gothic.variable}
        ${inter.variable}
        ${plexMono.variable}
        h-full antialiased
      `}
      style={{
        "--font-gothic": "var(--font-unifraktur)",
        "--font-interface": "var(--font-inter)",
        "--font-technical": "var(--font-ibm-plex-mono)",
      }}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          storageKey="archinel-theme"
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
