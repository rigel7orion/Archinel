
"use client";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    className: "severity-critical",
    color: "var(--critical)",
  },
  high: {
    label: "High",
    className: "severity-high",
    color: "var(--high)",
  },
  medium: {
    label: "Medium",
    className: "severity-medium",
    color: "var(--medium)",
  },
  low: {
    label: "Low",
    className: "severity-low",
    color: "var(--low)",
  },
};

function ShieldIcon({ dangerous = false }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-12 w-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 3 41 9v13c0 11-7.5 18.5-17 23C14.5 40.5 7 33 7 22V9z" />

      {dangerous ? (
        <>
          <path d="m18 18 12 12M30 18 18 30" strokeWidth="2.5" />
          <path d="M24 12v2M24 34v2" />
        </>
      ) : (
        <>
          <path d="m16 24 6 6 11-13" strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}

function getSeverity(severity) {
  if (!severity) return null;

  return SEVERITY_CONFIG[severity.toLowerCase()] || null;
}

function getVerdictStyle(verdict, severity) {
  const normalized = (verdict || "").toLowerCase();

  if (
    normalized.includes("safe") ||
    normalized.includes("no known threat")
  ) {
    return {
      label: verdict,
      color: "var(--low)",
      dangerous: false,
    };
  }

  if (
    normalized.includes("risky") ||
    normalized.includes("malicious") ||
    normalized.includes("phishing")
  ) {
    return {
      label: verdict,
      color: getSeverity(severity)?.color || "var(--critical)",
      dangerous: true,
    };
  }

  return {
    label: verdict || "Inconclusive",
    color: "var(--muted)",
    dangerous: false,
  };
}

function RiskGauge({ score, severity }) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;

  const progress =
    score === null ? 0 : (score / 100) * circumference;

  const severityInfo = getSeverity(severity);

  const strokeColor = severityInfo
    ? severityInfo.color
    : "var(--accent)";

  return (
    <figure
      className="relative h-[124px] w-[124px] shrink-0"
      aria-label={
        score === null
          ? "Risk score unavailable"
          : `Risk score ${score} out of 100`
      }
    >
      <svg
        viewBox="0 0 108 108"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx="54"
          cy="54"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="7"
          strokeOpacity="0.55"
        />

        {/* Score progress */}
        <circle
          cx="54"
          cy="54"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>

      <figcaption
        className="
          pointer-events-none absolute inset-0
          flex flex-col items-center justify-center
        "
      >
        <span
          className="
            count-value text-[2rem]
            font-semibold leading-none
            text-[var(--foreground)]
          "
        >
          {score === null ? "—" : score}
        </span>

        <span className="
          mt-1 text-[10px] font-medium
          uppercase tracking-wider
          text-[var(--muted)]
        ">
          / 100
        </span>
      </figcaption>
    </figure>
  );
}

function ReasonIcon({ severity }) {
  const config = getSeverity(severity);

  return (
    <span
      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center"
      style={{ color: config?.color || "var(--accent)" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6.5v4M10 13.5v.2" />
      </svg>
    </span>
  );
}

function EvidenceList({ reasons }) {
  if (!Array.isArray(reasons) || reasons.length === 0) {
    return (
      <p className="
        rounded-lg border border-[var(--border)]
        bg-[var(--surface-glass)] p-3
        text-xs leading-5 text-[var(--muted)]
      ">
        No detailed evidence was returned by the scanning service.
        This does not establish that the website is safe.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reasons.map((reason, index) => {
        const item =
          typeof reason === "string"
            ? { title: reason, severity: null }
            : reason;

        return (
          <li
            key={item.id || index}
            className="flex items-start gap-2.5"
          >
            <ReasonIcon severity={item.severity} />

            <div className="min-w-0 flex-1">
              <p className="
                text-xs font-semibold
                leading-5 text-[var(--foreground)]
              ">
                {item.title || "Security observation"}
              </p>

              {item.detail && (
                <p className="
                  mt-0.5 break-words
                  text-[11px] leading-5
                  text-[var(--muted)]
                ">
                  {item.detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function EmptyResult() {
  return (
    <div className="
      flex min-h-[310px] flex-col
      items-center justify-center
      px-5 py-8 text-center
    ">
      <div className="
        mb-5 grid h-20 w-20
        place-items-center rounded-full
        border border-[var(--border)]
        bg-[var(--accent-soft)]
        text-[var(--accent)]
      ">
        <ShieldIcon />
      </div>

      <h3 className="
        font-gothic text-2xl
        text-[var(--foreground)]
      ">
        Awaiting Investigation
      </h3>

      <p className="
        mt-2 max-w-[260px]
        text-xs leading-6
        text-[var(--muted)]
      ">
        No website has been investigated yet.
        Enter a URL above to uncover the evidence
        behind its digital identity.
      </p>

      <span className="
        mt-5 rounded-full border
        border-[var(--border)]
        bg-[var(--accent-soft)]
        px-3 py-1.5
        text-[9px] font-semibold
        uppercase tracking-wider
        text-[var(--muted)]
      ">
        No scan results available
      </span>
    </div>
  );
}

export default function ScanResults({
  result = null,
  isScanning = false,
  onViewFullReport,
}) {
  if (!result && !isScanning) {
    return (
      <section
        aria-labelledby="latest-result-heading"
        className="glass-panel ornate-frame overflow-hidden"
      >
        <div className="
          relative z-10 border-b
          border-[var(--border)] p-5
        ">
          <h2
            id="latest-result-heading"
            className="
              font-gothic text-2xl
              text-[var(--foreground)]
            "
          >
            Latest Result
          </h2>

          <p className="
            mt-1 text-xs text-[var(--muted)]
          ">
            Your latest website investigation
          </p>
        </div>

        <EmptyResult />
      </section>
    );
  }

  if (isScanning && !result) {
    return (
      <section
        aria-live="polite"
        aria-busy="true"
        className="
          glass-panel ornate-frame
          flex min-h-[310px] flex-col
          items-center justify-center p-6
          text-center
        "
      >
        <div className="
          mb-5 grid h-16 w-16
          place-items-center rounded-full
          border border-[var(--border)]
          bg-[var(--accent-soft)]
          text-[var(--accent)]
        ">
          <svg
            viewBox="0 0 48 48"
            className="h-9 w-9 animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r="19"
              strokeDasharray="10 5"
            />
            <path d="M24 5v7M43 24h-7" />
          </svg>
        </div>

        <h2 className="
          font-gothic text-2xl
          text-[var(--foreground)]
        ">
          The Investigation Begins
        </h2>

        <p className="
          mt-2 text-xs leading-6
          text-[var(--muted)]
        ">
          Examining threat intelligence,
          website behaviour and digital trust signals.
        </p>
      </section>
    );
  }

  const scoreValue = result?.riskScore;

  const score =
    scoreValue !== undefined &&
    scoreValue !== null &&
    Number.isFinite(Number(scoreValue))
      ? Math.max(0, Math.min(100, Math.round(Number(scoreValue))))
      : null;

  const severityInfo = getSeverity(result?.severity);

  const verdictInfo = getVerdictStyle(
    result?.verdict,
    result?.severity
  );

  const displayedURL = result?.url || result?.domain || "URL unavailable";

  return (
    <section
      aria-labelledby="latest-result-heading"
      aria-live="polite"
      className="
        glass-panel ornate-frame
        scroll-unfurl overflow-hidden
      "
    >
      {/* Header */}
      <div className="
        relative z-10 border-b
        border-[var(--border)] p-5
      ">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="latest-result-heading"
              className="
                font-gothic text-2xl
                text-[var(--foreground)]
              "
            >
              Latest Result
            </h2>

            <p className="
              mt-1 text-xs
              text-[var(--muted)]
            ">
              {result.scannedAt
                ? `Investigated ${result.scannedAt}`
                : "Investigation report"}
            </p>
          </div>

          <span className="
            rounded-full border
            border-[var(--border)]
            bg-[var(--accent-soft)]
            px-2.5 py-1
            text-[9px] font-semibold
            uppercase tracking-wider
            text-[var(--accent)]
          ">
            {result.source || "Source unspecified"}
          </span>
        </div>
      </div>

      <div className="relative z-10 p-5">

        {/* Scanned URL */}
        <div className="mb-5">
          <p className="
            mb-2 text-[10px]
            font-semibold uppercase
            tracking-wider text-[var(--muted)]
          ">
            Investigated address
          </p>

          <p className="
            url-text break-all rounded-lg
            border border-[var(--border)]
            bg-[var(--surface-glass)]
            p-3 text-[11px]
            leading-5 text-[var(--foreground)]
          ">
            {displayedURL}
          </p>
        </div>

        {/* Verdict and risk score */}
        <div className="
          flex flex-wrap items-center
          justify-between gap-4
          border-b border-[var(--border)]
          pb-5
        ">
          <div className="flex min-w-0 items-center gap-3">
            <div style={{ color: verdictInfo.color }}>
              <ShieldIcon dangerous={verdictInfo.dangerous} />
            </div>

            <div className="min-w-0">
              <span className="
                block text-[9px]
                font-semibold uppercase
                tracking-wider text-[var(--muted)]
              ">
                Website verdict
              </span>

              <p
                className="
                  mt-1 font-gothic
                  text-2xl font-bold
                  leading-tight
                "
                style={{ color: verdictInfo.color }}
              >
                {verdictInfo.label}
              </p>

              {severityInfo && (
                <span className={`
                  mt-2 inline-flex rounded-md
                  border px-2 py-1
                  text-[9px] font-semibold
                  uppercase tracking-wider
                  ${severityInfo.className}
                `}>
                  {severityInfo.label} severity
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="
                block text-[10px]
                text-[var(--muted)]
              ">
                Risk Score
              </span>

              <span className="
                count-value text-xl
                font-semibold text-[var(--foreground)]
              ">
                {score === null ? "—" : score}
                <span className="
                  text-xs font-normal
                  text-[var(--muted)]
                ">
                  {" "}/100
                </span>
              </span>
            </div>

            <RiskGauge
              score={score}
              severity={result?.severity}
            />
          </div>
        </div>

        {/* Evidence */}
        <div className="py-5">
          <h3 className="
            mb-4 font-gothic text-2xl
            text-[var(--foreground)]
          ">
            Why is it {verdictInfo.dangerous ? "risky" : "classified this way"}?
          </h3>

          <EvidenceList reasons={result.reasons} />
        </div>

        {/* Certificate reminder */}
        <div className="
          rounded-lg border
          border-[var(--border)]
          bg-[var(--accent-soft)]
          p-3
        ">
          <div className="flex items-start gap-2.5">
            <span className="
              mt-0.5 shrink-0
              text-[var(--accent)]
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
              A valid HTTPS certificate protects the connection.
              It does not guarantee that the website itself is legitimate.
            </p>
          </div>
        </div>

        {/* Full report action */}
        <div className="mt-5">
          <button
            type="button"
            disabled={typeof onViewFullReport !== "function"}
            onClick={() => onViewFullReport(result)}
            className="
              wax-press torch-glow
              flex min-h-11 w-full
              items-center justify-center
              gap-3 rounded-lg
              border border-[var(--accent)]
              bg-[var(--accent)]
              px-4 py-3 text-sm
              font-semibold text-[var(--accent-foreground)]
              transition-colors duration-200
              hover:bg-[var(--accent-hover)]
              focus-visible:outline-none
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title={
              typeof onViewFullReport === "function"
                ? "View the complete investigation report"
                : "Full report navigation is not connected yet"
            }
          >
            <span className="font-gothic text-lg">
              View Full Report
            </span>

            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Metadata */}
        {(result.scanId || result.scannedAt) && (
          <div className="
            mt-4 flex flex-wrap
            justify-between gap-2
            border-t border-[var(--border)]
            pt-3 text-[10px]
            text-[var(--muted)]
          ">
            {result.scanId && (
              <span className="url-text">
                Scan ID: {result.scanId}
              </span>
            )}

            {result.scannedAt && (
              <span>
                {result.scannedAt}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="
        border-t border-[var(--border)]
        px-5 py-2.5 text-center
        text-[9px] uppercase
        tracking-wider text-[var(--muted)]
      ">
        Evidence-based website investigation
      </div>
    </section>
  );
}
