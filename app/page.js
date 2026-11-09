"use client";

import { useRouter } from "next/navigation";

import KPICards from "../components/KPICards";
import Charts from "../components/Charts";
import RecentScans from "../components/RecentScans";
import URLScanner from "../components/URLScanner";
import ScanResults from "../components/ScanResults";
import { useScan } from "../components/ScanProvider";

function ScanError({ message }) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="glass-panel ornate-frame scroll-unfurl overflow-hidden p-5"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--critical-border)] bg-[var(--critical-bg)] text-[var(--critical)]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 22 20H2z" />
            <path d="M12 9v5M12 17v.2" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="font-gothic text-2xl text-[var(--critical)]">Investigation Interrupted</h3>
          <p className="mt-2 text-xs leading-6 text-[var(--foreground)]">{message}</p>
          <p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">
            Check the website address or try another URL.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const {
    url, setURL, isScanning, latestResult, error, setError,
    visibleScans, searchQuery, handleScan,
  } = useScan();

  return (
    <div className="mx-auto w-full max-w-[1900px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px] 2xl:gap-7">
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-label="Dashboard statistics"><KPICards /></section>
          <section aria-label="Threat analytics"><Charts /></section>

          <section aria-label="Recent website investigations">
            {searchQuery && (
              <p className="mb-3 text-xs text-[var(--muted)]">
                Search results for:{" "}
                <span className="font-semibold text-[var(--foreground)]">{searchQuery}</span>
              </p>
            )}
            <RecentScans scans={visibleScans} />
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-[10px] text-[var(--muted)]">
            <span>ARCHINEL Â· WEB THREAT INTELLIGENCE</span>
            <span>Prototype Â· Mock scanning mode</span>
          </footer>
        </div>

        <aside
          className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-5 xl:self-start"
          aria-label="Website investigation panel"
        >
          <URLScanner
            value={url}
            onChange={(value) => { setURL(value); setError(""); }}
            onScan={handleScan}
            isScanning={isScanning}
            error={error}
          />

          <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2.5">
            <span className="mt-0.5 text-[var(--accent)]">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor"
                strokeWidth="1.5" aria-hidden="true">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 9v5M10 6v.5" />
              </svg>
            </span>
            <p className="text-[10px] leading-5 text-[var(--muted)]">
              Live investigations use Cloudflare URL Scanner. Results may be inconclusive and are not a guarantee of safety.
            </p>
          </div>

          {error && !latestResult && !isScanning ? (
            <ScanError message={error} />
          ) : (
            <ScanResults
              result={latestResult}
              isScanning={isScanning}
              onViewFullReport={() => router.push("/reports")}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
