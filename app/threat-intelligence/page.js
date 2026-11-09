
"use client";

import { useScan } from "../../components/ScanProvider";

function IntelligenceCard({ title, value, description }) {
  return (
    <div className="glass-panel p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleString();
}

export default function ThreatIntelligencePage() {
  const { recentScans } = useScan();

  const scans = Array.isArray(recentScans) ? recentScans : [];

  const flagged = scans.filter(
    (scan) => scan.verdict === "Risky"
  );

  const inconclusive = scans.filter(
    (scan) => scan.verdict === "Inconclusive"
  );

  const notFlagged = scans.filter(
    (scan) => scan.verdict === "Safe"
  );

  const intelligence = [...scans].sort(
    (a, b) =>
      new Date(b.scannedAt || 0) - new Date(a.scannedAt || 0)
  );

  return (
    <main className="page-enter mx-auto w-full max-w-[1900px] p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
          Threat Intelligence
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Security observations collected from your Cloudflare website
          investigations. Only actual recorded scan results are displayed.
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <IntelligenceCard
          title="Cloudflare-flagged"
          value={flagged.length}
          description="Investigations returned a malicious verdict."
        />

        <IntelligenceCard
          title="Inconclusive"
          value={inconclusive.length}
          description="Investigations without a definitive verdict."
        />

        <IntelligenceCard
          title="No malicious verdict"
          value={notFlagged.length}
          description="Investigations Cloudflare did not flag as malicious."
        />
      </div>

      <section className="glass-panel min-w-0 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-gothic text-2xl text-[var(--foreground)]">
              Investigation Intelligence
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Latest recorded security observations
            </p>
          </div>

          <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--accent)]">
            {intelligence.length} RECORDS
          </span>
        </div>

        {intelligence.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <h3 className="font-gothic text-2xl text-[var(--foreground)]">
              No Intelligence Yet
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-6 text-[var(--muted)]">
              Investigate a website first. Its recorded Cloudflare findings
              will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {intelligence.map((scan) => {
              const isFlagged = scan.verdict === "Risky";
              const isInconclusive = scan.verdict === "Inconclusive";

              const status = isFlagged
                ? "Cloudflare flagged"
                : isInconclusive
                  ? "Inconclusive"
                  : "No malicious verdict";

              const statusColor = isFlagged
                ? "var(--critical)"
                : isInconclusive
                  ? "var(--medium)"
                  : "var(--low)";

              return (
                <article
                  key={scan.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-all text-sm font-semibold text-[var(--foreground)]">
                        {scan.domain || scan.url}
                      </h3>

                      <p className="mt-1 break-all text-xs text-[var(--muted)]">
                        {scan.url}
                      </p>
                    </div>

                    <span
                      className="shrink-0 rounded-md border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold"
                      style={{ color: statusColor }}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
                    <span>
                      Score: {scan.score ?? "N/A"}/100
                    </span>

                    <span>
                      Severity: {scan.severity || "Unknown"}
                    </span>

                    <span>
                      Source: {scan.source || "Unknown"}
                    </span>

                    <span>
                      {formatDate(scan.scannedAt)}
                    </span>
                  </div>

                  {Array.isArray(scan.reasons) && scan.reasons.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Recorded observations
                      </p>

                      <ul className="flex flex-col gap-2">
                        {scan.reasons.map((reason, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs leading-5 text-[var(--muted)]"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                            {typeof reason === "string"
                              ? reason
                              : reason.message || reason.title || "Security observation"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scan.reportUrl && (
                    <a
                      href={scan.reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-xs font-semibold text-[var(--accent)] underline"
                    >
                      Open Cloudflare investigation →
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">
        This feed represents your locally saved investigations, not a
        global threat intelligence database. No malicious verdict does
        not guarantee that a website is safe.
      </p>
    </main>
  );
}
