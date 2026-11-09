
"use client";

import { Fragment, useState } from "react";

const SEVERITY_STYLES = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
};

function formatScannedAt(value) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const elapsed = Math.max(0, Date.now() - date.getTime());

  if (elapsed < 60_000) return "Just now";

  if (elapsed < 3_600_000) {
    return `${Math.floor(elapsed / 60_000)} min ago`;
  }

  if (elapsed < 86_400_000) {
    return `${Math.floor(elapsed / 3_600_000)} hr ago`;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function EyeIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {expanded ? (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A11 11 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-3.1 3.8" />
          <path d="M6.2 6.2C4.1 7.5 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.6" />
        </>
      ) : (
        <>
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function SeverityBadge({ severity, score }) {
  const normalisedSeverity = SEVERITY_STYLES[severity]
    ? severity
    : "Medium";

  return (
    <span
      className={`
        inline-flex min-w-[76px] items-center
        justify-center gap-1.5 rounded-md
        px-2.5 py-1 text-[10px] font-semibold
        uppercase tracking-wide
        ${SEVERITY_STYLES[normalisedSeverity]}
      `}
      title={`Risk score: ${score ?? "Unavailable"}/100`}
    >
      {normalisedSeverity === "Critical" && (
        <svg
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M10 2 18 17H2z" />
          <path d="M10 7v4M10 14v.5" />
        </svg>
      )}

      {normalisedSeverity}
    </span>
  );
}

function Verdict({ verdict }) {
  const isSafe = verdict === "Safe";
  const isRisky = verdict === "Risky";

  const color = isSafe
    ? "var(--low)"
    : isRisky
      ? "var(--critical)"
      : "var(--medium)";

  return (
    <span
      className="inline-flex items-center gap-2 text-xs font-semibold"
      style={{ color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {verdict || "Inconclusive"}
    </span>
  );
}

function ScanDetails({ scan }) {
  const isMock = scan.source === "Mock";

  return (
    <div
      id={`scan-details-${scan.id}`}
      className="
        scroll-unfurl rounded-lg
        border border-[var(--border)]
        bg-[var(--surface-elevated)]
        p-4 sm:p-5
      "
    >
      <div className="
        flex flex-wrap items-center
        justify-between gap-3
      ">
        <div>
          <h3 className="
            font-gothic text-xl
            text-[var(--foreground)]
          ">
            Investigation Evidence
          </h3>

          <p className="
            url-text mt-1 break-all
            text-[10px] text-[var(--muted)]
          ">
            {scan.id} · {scan.domain}
          </p>
        </div>

        <span className="
          rounded-full border border-[var(--border)]
          bg-[var(--accent-soft)] px-2 py-1
          text-[9px] font-semibold uppercase
          tracking-wider text-[var(--accent)]
        ">
          {isMock ? "Mock data" : scan.source}
        </span>
      </div>

      <div className="mt-4">
        <p className="
          mb-3 text-xs font-semibold
          text-[var(--foreground)]
        ">
          Why was this website classified this way?
        </p>

        {Array.isArray(scan.reasons) && scan.reasons.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {scan.reasons.map((reason, index) => {
              const text =
                typeof reason === "string"
                  ? reason
                  : reason.title || reason.detail || "Security observation";

              return (
                <li
                  key={index}
                  className="
                    flex items-start gap-2.5
                    text-xs leading-5
                    text-[var(--muted)]
                  "
                >
                  <span
                    className="
                      mt-1.5 h-1.5 w-1.5
                      shrink-0 rounded-full
                      bg-[var(--accent)]
                    "
                    aria-hidden="true"
                  />
                  {text}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-[var(--muted)]">
            No additional evidence was provided.
          </p>
        )}
      </div>

      <div className="
        mt-4 flex flex-wrap
        items-center justify-between
        gap-2 border-t border-[var(--border)]
        pt-3
      ">
        <span className="text-[10px] text-[var(--muted)]">
          Source: {scan.source || "Unknown"}
        </span>

        <span className="text-[10px] text-[var(--muted)]">
          {formatScannedAt(scan.scannedAt)}
        </span>
      </div>

      {isMock && (
        <p className="
          mt-3 text-[10px] leading-5
          text-[var(--medium)]
        ">
          This is a simulated result. No live security
          investigation was performed.
        </p>
      )}
    </div>
  );
}

function EmptyScans() {
  return (
    <div className="
      flex min-h-[190px] flex-col
      items-center justify-center
      px-5 py-8 text-center
    ">
      <div className="
        mb-4 grid h-14 w-14
        place-items-center rounded-full
        border border-[var(--border)]
        bg-[var(--accent-soft)]
        text-[var(--accent)]
      ">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 3h10l4 4v14H3V3z" />
          <path d="M16 3v5h5" />
          <path d="M7 12h10M7 16h10" />
        </svg>
      </div>

      <h3 className="
        font-gothic text-xl
        text-[var(--foreground)]
      ">
        No Investigations Yet
      </h3>

      <p className="
        mt-2 max-w-[270px]
        text-xs leading-6
        text-[var(--muted)]
      ">
        Your recent website investigations
        will appear here once you scan your first URL.
      </p>
    </div>
  );
}

export default function RecentScans({ scans = [] }) {
  const [expandedScan, setExpandedScan] = useState(null);

  const recentScans = Array.isArray(scans) ? scans : [];

  function toggleDetails(id) {
    setExpandedScan((current) => (
      current === id ? null : id
    ));
  }

  return (
    <section
      aria-labelledby="recent-scans-heading"
      className="
        glass-panel stagger-in
        min-w-0 p-4 sm:p-5
      "
      style={{ "--stagger-index": 3 }}
    >
      {/* Section heading */}
      <div className="
        relative z-10 mb-5 flex flex-wrap
        items-center justify-between gap-3
      ">
        <div>
          <h2
            id="recent-scans-heading"
            className="
              font-gothic text-2xl
              text-[var(--foreground)]
            "
          >
            Recent Scans
          </h2>

          <p className="
            mt-1 text-xs text-[var(--muted)]
          ">
            A record of recent website investigations
          </p>
        </div>

        <span className="
          rounded-full border border-[var(--border)]
          bg-[var(--accent-soft)] px-3 py-1
          text-[9px] font-semibold uppercase
          tracking-wider text-[var(--accent)]
        ">
          {recentScans.length} Records
        </span>
      </div>

      {/* Empty state */}
      {recentScans.length === 0 ? (
        <EmptyScans />
      ) : (
        <>
          {/* Responsive table */}
          <div className="relative z-10 overflow-x-auto">
            <table className="
              w-full min-w-[790px]
              border-collapse text-left
            ">
              <caption className="sr-only">
                Recent website investigations,
                severity, risk scores and verdicts.
              </caption>

              <thead>
                <tr className="
                  border-y border-[var(--border)]
                  bg-[var(--accent-soft)]
                ">
                  {[
                    "Risk",
                    "URL / Domain",
                    "Verdict",
                    "Scanned",
                    "Source",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="
                        whitespace-nowrap px-3 py-3
                        text-[10px] font-semibold
                        uppercase tracking-wider
                        text-[var(--muted)]
                      "
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentScans.map((scan, index) => {
                  const rowId = scan.id || `scan-${index}`;
                  const expanded = expandedScan === rowId;

                  return (
                    <Fragment key={rowId}>
                      <tr className="
                        border-b border-[var(--border)]
                        transition-colors duration-200
                        hover:bg-[var(--accent-soft)]
                      ">
                        {/* Severity and score */}
                        <td className="px-3 py-3.5">
                          <div className="flex flex-col items-start gap-1.5">
                            <SeverityBadge
                              severity={scan.severity}
                              score={scan.score}
                            />

                            <span className="
                              text-[10px] tabular-nums
                              text-[var(--muted)]
                            ">
                              {scan.score ?? "—"}/100
                            </span>
                          </div>
                        </td>

                        {/* Domain */}
                        <td className="px-3 py-3.5">
                          <div className="
                            url-text max-w-[230px]
                            break-all text-[11px]
                            text-[var(--foreground)]
                          ">
                            {scan.domain || scan.url || "Unknown domain"}
                          </div>

                          {scan.id && (
                            <div className="
                              url-text mt-1 text-[9px]
                              text-[var(--muted)]
                            ">
                              {scan.id}
                            </div>
                          )}
                        </td>

                        {/* Verdict */}
                        <td className="px-3 py-3.5">
                          <Verdict verdict={scan.verdict} />
                        </td>

                        {/* Timestamp */}
                        <td className="
                          whitespace-nowrap px-3 py-3.5
                          text-[11px] text-[var(--muted)]
                        ">
                          {formatScannedAt(scan.scannedAt)}
                        </td>

                        {/* Source */}
                        <td className="
                          px-3 py-3.5 text-[10px]
                          text-[var(--muted)]
                        ">
                          {scan.source || "Unknown"}
                        </td>

                        {/* Details action */}
                        <td className="px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleDetails(rowId)}
                            aria-expanded={expanded}
                            aria-controls={`scan-details-${rowId}`}
                            aria-label={`${expanded ? "Hide" : "View"} evidence for ${scan.domain || scan.url}`}
                            className="
                              wax-press torch-glow
                              inline-flex items-center
                              gap-1.5 rounded-md
                              border border-[var(--border)]
                              px-2.5 py-1.5 text-[10px]
                              font-semibold text-[var(--accent)]
                              hover:bg-[var(--accent-soft)]
                              focus-visible:outline-none
                            "
                          >
                            <EyeIcon expanded={expanded} />
                            {expanded ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded evidence */}
                      {expanded && (
                        <tr>
                          <td colSpan={6} className="px-2 py-3">
                            <ScanDetails scan={scan} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="
            relative z-10 mt-4 flex flex-wrap
            items-center justify-between gap-2
          ">
            <span className="text-[10px] text-[var(--muted)]">
              Showing {recentScans.length} investigations
            </span>

            <span className="text-[10px] text-[var(--muted)]">
              New investigations appear first.
            </span>
          </div>
        </>
      )}
    </section>
  );
}
