
"use client";

import ThemeToggle from "../../components/ThemeToggle";

function SettingsCard({ title, description, children }) {
  return (
    <section className="glass-panel p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-gothic text-2xl text-[var(--foreground)]">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function SettingRow({ label, value, description }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-t border-[var(--border)] py-4 first:border-0 first:pt-0">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {label}
        </p>
        <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted)]">
          {description}
        </p>
      </div>
      <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--accent)]">
        {value}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="page-enter mx-auto w-full max-w-[1900px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-gothic text-4xl text-[var(--foreground)] md:text-5xl">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Manage Archinel&apos;s appearance, investigation preferences and
          privacy information.
        </p>
      </div>

      <SettingsCard
        title="Appearance"
        description="Choose how the Archinel interface looks."
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Interface theme
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Switch between the available light and dark themes.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Investigation Configuration"
        description="Current website investigation service and scan behaviour."
      >
        <SettingRow
          label="Scanning provider"
          value="Cloudflare"
          description="Website investigations are submitted to Cloudflare URL Scanner through the Archinel server."
        />

        <SettingRow
          label="Scan visibility"
          value="Unlisted"
          description="Archinel requests unlisted scan visibility. This is not a guarantee of confidentiality."
        />

        <SettingRow
          label="Transport"
          value="HTTPS"
          description="The investigation service communicates with Cloudflare using HTTPS."
        />
      </SettingsCard>

      <SettingsCard
        title="Privacy and Data"
        description="Understand how your investigation information is handled."
      >
        <SettingRow
          label="API credentials"
          value="Server-side"
          description="Cloudflare account credentials are read from environment variables and are not exposed to browser JavaScript."
        />

        <SettingRow
          label="Scan history"
          value="Local browser"
          description="Recent investigations are stored in this browser's local storage. Clearing browser data can remove them."
        />

        <SettingRow
          label="Third-party processing"
          value="Cloudflare"
          description="Submitted URLs are processed by Cloudflare. Never submit private links, authentication tokens or password-reset URLs."
        />
      </SettingsCard>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] p-4">
        <p className="text-xs leading-6 text-[var(--muted)]">
          Archinel is an informational website investigation tool.
          Its findings do not constitute a security certification,
          penetration test or guarantee that a website is safe.
          Inconclusive results must not be interpreted as safe.
        </p>
      </div>
    </main>
  );
}
