
"use client";

import { useRouter } from "next/navigation";
import { useScan } from "../../components/ScanProvider";
import URLScanner from "../../components/URLScanner";
import ScanResults from "../../components/ScanResults";

export default function URLScannerPage() {
  const router = useRouter();

  const {
    url,
    setURL,
    isScanning,
    latestResult,
    error,
    setError,
    handleScan,
  } = useScan();

  return (
    <main className="page-enter mx-auto w-full max-w-[1900px] p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Archinel / Website Investigation
        </p>

        <h1 className="mt-3 font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
          URL Scanner
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Investigate website reputation, security signals and
          available evidence using Cloudflare URL Scanner.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="flex min-w-0 flex-col gap-5">
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

          <div className="rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] p-4">
            <h2 className="font-gothic text-xl text-[var(--foreground)]">
              Investigation Guidelines
            </h2>

            <ul className="mt-3 flex flex-col gap-2 text-xs leading-5 text-[var(--muted)]">
              <li>Only submit public websites you have permission to investigate.</li>
              <li>Never submit password-reset links, private URLs or access tokens.</li>
              <li>Scans are submitted with unlisted visibility.</li>
              <li>An inconclusive result does not establish that a website is safe.</li>
            </ul>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-5">
          {error && !latestResult && !isScanning && (
            <section className="glass-panel ornate-frame p-5" role="alert">
              <h2 className="font-gothic text-2xl text-[var(--critical)]">
                Investigation Interrupted
              </h2>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                {error}
              </p>
            </section>
          )}

          <ScanResults
            result={latestResult}
            isScanning={isScanning}
            onViewFullReport={() => router.push("/reports")}
          />

          <p className="text-[10px] leading-5 text-[var(--muted)]">
            Powered by Cloudflare URL Scanner. Archinel presents the
            available findings and does not guarantee website safety.
          </p>
        </aside>
      </div>
    </main>
  );
}
