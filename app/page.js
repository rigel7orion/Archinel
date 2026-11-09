
"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import KPICards from "../components/KPICards";
import Charts from "../components/Charts";
import RecentScans from "../components/RecentScans";
import URLScanner from "../components/URLScanner";
import ScanResults from "../components/ScanResults";

import { mockScan } from "../lib/mockScan";

/* =========================================================
   ARCHINEL — URL VALIDATION
   ========================================================= */

function validateURL(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Please enter a website URL to investigate.");
  }

  // Automatically add HTTPS when no protocol is provided.
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsedURL;

  try {
    parsedURL = new URL(candidate);
  } catch {
    throw new Error(
      "That URL doesn't look valid. Please check the address and try again."
    );
  }

  if (!["http:", "https:"].includes(parsedURL.protocol)) {
    throw new Error(
      "Only HTTP and HTTPS website addresses are supported."
    );
  }

  if (
    !parsedURL.hostname ||
    !parsedURL.hostname.includes(".")
  ) {
    throw new Error(
      "Please enter a complete website domain, such as example.com."
    );
  }

  if (parsedURL.username || parsedURL.password) {
    throw new Error(
      "URLs containing embedded login credentials are not accepted."
    );
  }

  if (parsedURL.href.length > 2048) {
    throw new Error("The URL is too long to investigate.");
  }

  return parsedURL.href;
}

/* =========================================================
   ARCHINEL — ERROR STATE
   ========================================================= */

function ScanError({ message }) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="
        glass-panel ornate-frame
        scroll-unfurl overflow-hidden p-5
      "
    >
      <div className="flex items-start gap-3">
        <div className="
          grid h-11 w-11 shrink-0
          place-items-center rounded-lg
          border border-[var(--critical-border)]
          bg-[var(--critical-bg)]
          text-[var(--critical)]
        ">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 22 20H2z" />
            <path d="M12 9v5M12 17v.2" />
          </svg>
        </div>

        <div className="min-w-0">
          <h3 className="
            font-gothic text-2xl
            text-[var(--critical)]
          ">
            Investigation Interrupted
          </h3>

          <p className="
            mt-2 text-xs leading-6
            text-[var(--foreground)]
          ">
            {message}
          </p>

          <p className="
            mt-2 text-[10px] leading-5
            text-[var(--muted)]
          ">
            Check the website address or try another URL.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ARCHINEL — DASHBOARD PAGE
   ========================================================= */

export default function Home() {
  /* -------------------------------------------------------
     CENTRAL SCANNER STATE
     ------------------------------------------------------- */

  const [url, setURL] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [error, setError] = useState("");

  // Dynamic scan history.
  const [recentScans, setRecentScans] = useState([]);

  // Dashboard search.
  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------------------------------------------
     SCAN HANDLER
     ------------------------------------------------------- */

  async function handleScan(input) {
    // Never allow simultaneous scans.
    if (isScanning) return;

    setError("");

    let normalizedURL;

    // Validate before starting the investigation.
    try {
      normalizedURL = validateURL(input);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    // Update controlled input with normalized URL.
    setURL(normalizedURL);

    // Start a fresh investigation.
    setIsScanning(true);
    setLatestResult(null);

    try {
      // Temporary mock engine.
      // This will later be replaced by the real API call.
      const result = await mockScan(normalizedURL);

      // Preserve the API response shape while adapting
      // its score field for the existing ScanResults UI.
      const resultForUI = {
        ...result,
        riskScore: result.score,
      };

      // Store the latest result.
      setLatestResult(resultForUI);

      // Add the new scan to the top of the history.
      // Prevent duplicate consecutive URL records.
      setRecentScans((previousScans) => [
        result,
        ...previousScans.filter(
          (scan) => scan.url !== result.url
        ),
      ].slice(0, 10));

    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "The investigation could not be completed. Please try again."
      );

    } finally {
      setIsScanning(false);
    }
  }

  /* -------------------------------------------------------
     DASHBOARD SEARCH
     ------------------------------------------------------- */

  function handleSearch(query) {
    setSearchQuery(query);
  }

  const visibleScans = recentScans.filter((scan) => {
    const query = searchQuery.toLowerCase();

    if (!query) return true;

    return [
      scan.url,
      scan.domain,
      scan.verdict,
      scan.severity,
      scan.source,
      scan.id,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toLowerCase().includes(query)
      );
  });

  /* =======================================================
     PAGE LAYOUT
     ======================================================= */

  return (
    <div className="
      app-atmosphere flex min-h-screen
      w-full bg-[var(--background)]
      text-[var(--foreground)]
    ">

      {/* LEFT: SIDEBAR */}
      <Sidebar />

      {/* MAIN APPLICATION */}
      <main className="min-w-0 flex-1">

        {/* TOP BAR AND GREETING */}
        <TopBar
          userName="Jeet"
          onSearch={handleSearch}
        />

        {/* DASHBOARD CONTENT */}
        <div className="
          mx-auto w-full max-w-[1900px]
          px-4 py-5 sm:px-6 sm:py-6
          lg:px-8 lg:py-7
        ">

          {/* 
            DESKTOP:
            Main dashboard + right investigation panel.

            TABLET AND MOBILE:
            Single column, investigation panel below dashboard.
          */}
          <div className="
            grid grid-cols-1 items-start
            gap-6 xl:grid-cols-[minmax(0,1fr)_350px]
            2xl:gap-7
          ">

            {/* =============================================
                CENTER: MAIN DASHBOARD
                ============================================= */}

            <div className="
              flex min-w-0 flex-col gap-6
            ">

              {/* 1. KPI CARDS */}
              <section aria-label="Dashboard statistics">
                <KPICards />
              </section>

              {/* 2. ANALYTICS CHARTS */}
              <section aria-label="Threat analytics">
                <Charts />
              </section>

              {/* 3. RECENT SCANS */}
              <section aria-label="Recent website investigations">
                {searchQuery && (
                  <p className="
                    mb-3 text-xs
                    text-[var(--muted)]
                  ">
                    Search results for:{" "}
                    <span className="
                      font-semibold text-[var(--foreground)]
                    ">
                      {searchQuery}
                    </span>
                  </p>
                )}

                <RecentScans
                  scans={visibleScans}
                />
              </section>

              {/* DASHBOARD FOOTER */}
              <footer className="
                flex flex-wrap items-center
                justify-between gap-2
                border-t border-[var(--border)]
                pt-4 text-[10px]
                text-[var(--muted)]
              ">
                <span>
                  ARCHINEL · WEB THREAT INTELLIGENCE
                </span>

                <span>
                  Prototype · Mock scanning mode
                </span>
              </footer>

            </div>

            {/* =============================================
                RIGHT: INVESTIGATION PANEL
                ============================================= */}

            <aside className="
              flex min-w-0 flex-col gap-5
              xl:sticky xl:top-5 xl:self-start
            "
              aria-label="Website investigation panel"
            >

              {/* 4. URL SCANNER */}
              <URLScanner
                value={url}
                onChange={(value) => {
                  setURL(value);
                  setError("");
                }}
                onScan={handleScan}
                isScanning={isScanning}
                error={error}
              />

              {/* MOCK DATA DISCLOSURE */}
              <div className="
                flex items-start gap-2
                rounded-lg border
                border-[var(--border)]
                bg-[var(--accent-soft)]
                px-3 py-2.5
              ">
                <span className="
                  mt-0.5 text-[var(--accent)]
                ">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 9v5M10 6v.5" />
                  </svg>
                </span>

                <p className="
                  text-[10px] leading-5
                  text-[var(--muted)]
                ">
                  Prototype mode: investigations currently
                  use simulated results. No real website
                  security verdicts are being generated.
                </p>
              </div>

              {/* 5. LATEST RESULT OR ERROR */}
              {error && !latestResult && !isScanning ? (
                <ScanError message={error} />
              ) : (
                <ScanResults
                  result={latestResult}
                  isScanning={isScanning}
                />
              )}

            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
