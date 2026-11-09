
"use client";

import {
  ViewTransition,
  useSyncExternalStore,
} from "react";

/* =====================================================
   ARCHINEL — ROUTE TRANSITION MAPPING
   These names must match globals.css and Sidebar Links.
   ===================================================== */

// New page animations
const ENTER_TRANSITIONS = {
  "to-dashboard": "dashboard-enter",
  "to-url-scanner": "scanner-enter",
  "to-scan-history": "history-enter",
  "to-threat-intelligence": "intelligence-enter",
  "to-reports": "reports-enter",
  "to-settings": "settings-enter",

  // Explicit in-app back navigation
  "history-fade": "history-fade-enter",

  default: "none",
};

// Previous page animations
const EXIT_TRANSITIONS = {
  "from-dashboard": "dashboard-exit",
  "from-url-scanner": "scanner-exit",
  "from-scan-history": "history-exit",
  "from-threat-intelligence": "intelligence-exit",
  "from-reports": "reports-exit",
  "from-settings": "settings-exit",

  // Explicit in-app back navigation
  "history-fade": "history-fade-exit",

  default: "none",
};

/* =====================================================
   BROWSER BACK / FORWARD FALLBACK
   Native popstate skips React ViewTransitions.
   This small external store triggers a CSS-only fade
   on the incoming route content.
   ===================================================== */

const historySubscribers = new Set();

let historyFallbackActive = false;
let historyListenerAttached = false;
let historyResetTimer = null;

function notifyHistorySubscribers() {
  historySubscribers.forEach((callback) => callback());
}

function handleHistoryNavigation() {
  historyFallbackActive = true;
  notifyHistorySubscribers();

  if (historyResetTimer !== null) {
    window.clearTimeout(historyResetTimer);
  }

  historyResetTimer = window.setTimeout(() => {
    historyFallbackActive = false;
    historyResetTimer = null;

    notifyHistorySubscribers();
  }, 150);
}

function subscribeToHistoryFallback(callback) {
  historySubscribers.add(callback);

  if (
    typeof window !== "undefined" &&
    !historyListenerAttached
  ) {
    window.addEventListener(
      "popstate",
      handleHistoryNavigation
    );

    historyListenerAttached = true;
  }

  return () => {
    historySubscribers.delete(callback);

    if (
      typeof window !== "undefined" &&
      historySubscribers.size === 0 &&
      historyListenerAttached
    ) {
      window.removeEventListener(
        "popstate",
        handleHistoryNavigation
      );

      historyListenerAttached = false;
    }
  };
}

function getHistorySnapshot() {
  return historyFallbackActive;
}

function getServerSnapshot() {
  return false;
}

/* =====================================================
   ARCHINEL PAGE TEMPLATE
   ===================================================== */

export default function Template({ children }) {
  const isHistoryFallback = useSyncExternalStore(
    subscribeToHistoryFallback,
    getHistorySnapshot,
    getServerSnapshot
  );

  return (
    <ViewTransition
      default="none"
      enter={ENTER_TRANSITIONS}
      exit={EXIT_TRANSITIONS}
    >
      <div
        className={
          isHistoryFallback
            ? "history-fade-fallback"
            : undefined
        }
      >
        {children}
      </div>
    </ViewTransition>
  );
}
