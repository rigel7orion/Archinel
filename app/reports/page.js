
"use client";

import { useState } from "react";
import { useScan } from "../../components/ScanProvider";

export default function ReportsPage() {
  const { recentScans, latestResult } = useScan();
  const [selectedId, setSelectedId] = useState("");

  const reports = recentScans.length
    ? recentScans
    : latestResult
      ? [latestResult]
      : [];

  const selectedReport =
    reports.find((scan) => scan.id === selectedId) ||
    reports[0] ||
    null;

  function downloadReport() {
    if (!selectedReport) return;

    const content = JSON.stringify(selectedReport, null, 2);
    const blob = new Blob([content], {
      type: "application/json",
    });

    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadURL;
    link.download = `archinel-report-${selectedReport.id}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadURL);
  }

  function printReport() {
    window.print();
  }

  return (
    <main className="page-enter mx-auto w-full max-w-[1900px] p-4 sm:p-6 lg:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
            Investigation Reports
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Review, export and print your website security investigations.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Available reports
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
            {reports.length}
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <section className="glass-panel ornate-frame p-8 text-center">
          <h2 className="font-gothic text-2xl text-[var(--foreground)]">
            No Reports Available
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Complete your first website investigation to generate a report.
          </p>
        </section>
      ) : (
        <>
          <section className="glass-panel mb-6 p-5">
            <label
              htmlFor="report-selector"
              className="mb-2 block text-xs font-semibold text-[var(--muted)]"
            >
              SELECT INVESTIGATION
            </label>

            <select
              id="report-selector"
              value={selectedReport?.id || ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none"
            >
              {reports.map((scan) => (
                <option key={scan.id} value={scan.id}>
                  {scan.domain || scan.url} | {scan.verdict || "Inconclusive"} | {scan.id}
                </option>
              ))}
            </select>
          </section>

          {selectedReport && (
            <section className="glass-panel ornate-frame p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
                    ARCHINEL SECURITY REPORT
                  </p>

                  <h2 className="mt-2 break-all font-gothic text-3xl text-[var(--foreground)]">
                    {selectedReport.domain || "Website Investigation"}
                  </h2>

                  <p className="mt-2 break-all text-xs text-[var(--muted)]">
                    {selectedReport.url}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadReport}
                    className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] px-4 text-xs font-semibold text-[var(--accent)]"
                  >
                    Download JSON
                  </button>

                  <button
                    type="button"
                    onClick={printReport}
                    className="min-h-10 rounded-lg border border-[var(--border)] px-4 text-xs font-semibold text-[var(--foreground)]"
                  >
                    Print Report
                  </button>
                </div>
              </div>

              <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-[10px] uppercase text-[var(--muted)]">
                    Risk Score
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                    {selectedReport.score ?? "N/A"}
                    <span className="text-sm font-normal text-[var(--muted)]">
                      {" "}/100
                    </span>
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-[10px] uppercase text-[var(--muted)]">
                    Severity
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {selectedReport.severity || "Unknown"}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-[10px] uppercase text-[var(--muted)]">
                    Website Verdict
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {selectedReport.verdict || "Inconclusive"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-gothic text-2xl text-[var(--foreground)]">
                    Investigation Evidence
                  </h3>

                  <ul className="mt-4 flex flex-col gap-3">
                    {(selectedReport.reasons || []).map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                        {typeof reason === "string"
                          ? reason
                          : reason.message || reason.title || reason.detail || "Security observation"}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase text-[var(--muted)]">
                      Investigation Source
                    </p>
                    <p className="mt-1 text-xs text-[var(--foreground)]">
                      {selectedReport.source || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-[var(--muted)]">
                      Investigation Date
                    </p>
                    <p className="mt-1 text-xs text-[var(--foreground)]">
                      {selectedReport.scannedAt
                        ? new Date(selectedReport.scannedAt).toLocaleString()
                        : "Unavailable"}
                    </p>
                  </div>

                  {selectedReport.reportUrl && (
                    <a
                      href={selectedReport.reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[var(--accent)] underline"
                    >
                      Open Cloudflare full report
                    </a>
                  )}
                </div>

                <p className="border-t border-[var(--border)] pt-4 text-[10px] leading-5 text-[var(--muted)]">
                  Archinel assessments are informational and do not guarantee
                  website safety. An inconclusive result must not be interpreted
                  as a safe verdict.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
