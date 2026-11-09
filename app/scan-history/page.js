
"use client";

import { useScan } from "../../components/ScanProvider";
import RecentScans from "../../components/RecentScans";

export default function ScanHistoryPage() {
  const { recentScans, visibleScans, searchQuery } = useScan();

  return (
    <div className="page-enter mx-auto w-full max-w-[1900px] p-4 sm:p-6 lg:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
            Scan History
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Review your previous Cloudflare website investigations.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Saved investigations
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
            {recentScans.length}
          </p>
        </div>
      </div>

      {searchQuery && (
        <p className="mb-4 text-xs text-[var(--muted)]">
          Filtered by: {searchQuery}
        </p>
      )}

      <RecentScans scans={visibleScans} />

      <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">
        Scan history is stored locally in this browser. Clearing browser
        storage or switching devices may remove or hide these records.
      </p>
    </div>
  );
}
