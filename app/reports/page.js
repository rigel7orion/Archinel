
export default function ReportsPage() {
  return (
    <main className="page-enter flex min-h-full w-full items-start justify-center p-5 md:p-8">
      <section className="glass-panel ornate-frame w-full max-w-5xl p-7 md:p-10">
        <div className="relative z-10 space-y-5">
          <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
            Reports
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review generated investigation reports and their supporting security evidence.
          </p>

          <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-6">
            <h2 className="font-gothic text-2xl text-[var(--foreground)]">
              Coming soon
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}
