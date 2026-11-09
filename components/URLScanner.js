
"use client";

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        opacity=".25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function URLScanner({
  value = "",
  onChange = () => {},
  onScan,
  isScanning = false,
  error = "",
}) {
  function handleSubmit(event) {
    event.preventDefault();

    if (isScanning) return;

    // The parent page owns validation and scanning.
    onScan?.(value);
  }

  function handleClear() {
    onChange("");
  }

  return (
    <section
      aria-labelledby="url-scanner-heading"
      className="
        glass-panel ornate-frame
        relative overflow-hidden
        p-5 sm:p-6
      "
    >
      {/* Decorative inner frame */}
      <div
        className="
          pointer-events-none absolute inset-1.5
          rounded-[9px] border border-[var(--ornament)]
          opacity-40
        "
        aria-hidden="true"
      />

      <div className="relative z-10">

        {/* Section identity */}
        <div className="
          mb-5 flex items-center
          justify-between gap-3
        ">
          <span className="
            inline-flex items-center gap-2
            text-[10px] font-semibold
            uppercase tracking-[0.16em]
            text-[var(--accent)]
          ">
            <LinkIcon />
            Website Investigation
          </span>

          <span className="
            rounded-full border border-[var(--border)]
            bg-[var(--accent-soft)]
            px-2.5 py-1 text-[9px]
            font-semibold uppercase tracking-wider
            text-[var(--muted)]
          ">
            Archinel Scanner
          </span>
        </div>

        {/* Gothic heading */}
        <h2
          id="url-scanner-heading"
          className="
            font-gothic text-3xl font-bold
            leading-tight text-[var(--foreground)]
            sm:text-4xl
          "
        >
          Investigate a URL
        </h2>

        <p className="
          mt-2 max-w-md text-sm leading-6
          text-[var(--muted)]
        ">
          Look beyond the padlock. Discover the security
          signals and potential threats behind a website.
        </p>

        {/* Controlled scanner form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="archinel-url"
              className="
                text-xs font-semibold
                text-[var(--foreground)]
              "
            >
              Website address
            </label>

            <div className="
              group flex min-h-[54px]
              items-center gap-3 rounded-lg
              border border-[var(--border)]
              bg-[var(--surface-elevated)]
              px-3.5
              transition-colors duration-200
              focus-within:border-[var(--accent)]
              focus-within:ring-2
              focus-within:ring-[var(--accent-soft)]
            ">
              <span className="shrink-0 text-[var(--muted)]">
                <LinkIcon />
              </span>

              <input
                id="archinel-url"
                name="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                maxLength={2048}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={isScanning}
                placeholder="https://example.com"
                aria-invalid={Boolean(error)}
                aria-describedby="archinel-url-help archinel-url-status"
                className="
                  url-text h-full min-w-0 flex-1
                  bg-transparent py-3 text-xs
                  text-[var(--foreground)]
                  outline-none placeholder:text-[var(--muted)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              {value && !isScanning && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear URL"
                  className="
                    wax-press shrink-0 rounded-md
                    px-2 py-1 text-xs
                    text-[var(--muted)]
                    hover:bg-[var(--accent-soft)]
                    hover:text-[var(--foreground)]
                    focus-visible:outline-none
                  "
                >
                  Clear
                </button>
              )}
            </div>

            <p
              id="archinel-url-help"
              className="text-[10px] leading-5 text-[var(--muted)]"
            >
              Enter a website address, with or without HTTPS.
            </p>
          </div>

          {/* Scan button */}
          <button
            type="submit"
            disabled={isScanning}
            className="
              wax-press torch-glow group
              relative flex min-h-[50px]
              items-center justify-center gap-3
              overflow-hidden rounded-lg
              border border-[var(--accent)]
              bg-[var(--accent)]
              px-5 py-3 text-sm font-semibold
              text-[var(--accent-foreground)]
              shadow-[var(--shadow-panel)]
              transition-colors duration-200
              hover:bg-[var(--accent-hover)]
              focus-visible:outline-none
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isScanning ? (
              <>
                <LoadingIcon />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <span className="font-gothic text-lg">
                  Scan Now
                </span>

                <span className="
                  transition-transform duration-200
                  group-hover:translate-x-1
                ">
                  <ArrowIcon />
                </span>
              </>
            )}
          </button>

          {/* Parent-controlled error and status */}
          <div
            id="archinel-url-status"
            role="status"
            aria-live="polite"
            className="min-h-5"
          >
            {error && (
              <p className="
                text-xs leading-5
                text-[var(--critical)]
              ">
                {error}
              </p>
            )}
          </div>
        </form>

        {/* Privacy notice */}
        <div className="
          mt-3 flex items-start gap-2
          border-t border-[var(--border)]
          pt-4
        ">
          <span className="mt-0.5 text-[var(--accent)]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>

          <p className="
            text-[10px] leading-5
            text-[var(--muted)]
          ">
            Never submit private, password-reset or
            access-token links. External scanning can
            expose submitted URLs to third-party services.
          </p>
        </div>
      </div>
    </section>
  );
}
