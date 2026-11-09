
export default function URLScannerPage() {
  return (
    <main className="page-enter flex min-h-full w-full items-start justify-center p-5 md:p-8">
      <section className="glass-panel ornate-frame w-full max-w-5xl p-7 md:p-10">
        <div className="relative z-10 space-y-5">

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Archinel / Website Investigation
          </p>

          <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
            URL Scanner
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Investigate website reputation, security signals and
            certificate details before deciding whether to trust a link.
          </p>

          <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-6">
            <h2 className="font-gothic text-2xl text-[var(--foreground)]">
              Coming soon
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              The website investigation workspace is being prepared.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
