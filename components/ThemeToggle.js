
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.42 1.42" />
      <path d="M17.65 17.65l1.42 1.42" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.42-1.42" />
      <path d="M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z" />
      <path d="M16.5 3v3" />
      <path d="M15 4.5h3" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch before the theme is resolved.
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme preference"
        className="inline-flex h-11 min-w-24 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-glass)] px-3 opacity-60"
      >
        <span className="h-5 w-5 rounded-full border border-[var(--border)]" />
        <span className="text-xs text-[var(--muted)]">Theme</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to parchment light theme"
          : "Switch to midnight dark theme"
      }
      aria-pressed={isDark}
      title={`Current theme: ${theme === "system" ? `System (${resolvedTheme})` : theme}. Click to switch.`}
      className="
        wax-press torch-glow
        inline-flex h-11 items-center justify-center gap-2
        rounded-full border border-[var(--border)]
        bg-[var(--surface-glass)]
        px-3 text-[var(--foreground)]
        shadow-[var(--shadow-panel)]
        backdrop-blur-md
        focus-visible:outline-none
      "
    >
      <span
        className="relative grid h-7 w-7 shrink-0 place-items-center"
        aria-hidden="true"
      >
        <span
          className={`theme-icon absolute ${
            isDark ? "is-inactive" : "is-active"
          }`}
        >
          <SunIcon />
        </span>

        <span
          className={`theme-icon absolute ${
            isDark ? "is-active" : "is-inactive"
          }`}
        >
          <MoonIcon />
        </span>
      </span>

      <span className="text-xs font-semibold tracking-wide">
        {isDark ? "Night" : "Daylight"}
      </span>
    </button>
  );
}
