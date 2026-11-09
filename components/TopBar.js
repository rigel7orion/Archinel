
"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: "Scanner awaiting connection",
    description:
      "Connect the Cloudflare scanning engine to enable live investigations.",
    type: "info",
  },
  {
    id: 2,
    title: "Threat intelligence pending",
    description:
      "External reputation sources have not been connected yet.",
    type: "warning",
  },
  {
    id: 3,
    title: "Community reports in demo mode",
    description:
      "Shared threat intelligence will appear when database storage is configured.",
    type: "info",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function BellIcon() {
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function TopBar({
  userName = "Jeet",
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close the notification panel with Escape.
  useEffect(() => {
    if (!notificationsOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

  function handleSearch(event) {
    event.preventDefault();

    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  }

  return (
    <header
      className="
        relative z-30 flex w-full flex-col gap-5
        border-b border-[var(--border)]
        px-4 py-5 sm:px-6 lg:flex-row
        lg:items-center lg:justify-between
        lg:px-8
      "
    >
      {/* Greeting */}
      <div className="min-w-0 pl-12 md:pl-0">
        <h1
          className="
            font-gothic text-3xl font-bold
            leading-tight tracking-wide
            text-[var(--foreground)]
            sm:text-4xl
          "
        >
          Hail, {userName}
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Here is your digital realm overview.
        </p>
      </div>

      {/* Top bar controls */}
      <div className="flex w-full items-center gap-2 lg:w-auto lg:gap-3">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="
            group flex h-11 min-w-0 flex-1
            items-center gap-2 rounded-lg
            border border-[var(--border)]
            bg-[var(--surface-glass)]
            px-3 backdrop-blur-md
            transition-colors duration-200
            focus-within:border-[var(--accent)]
            focus-within:ring-1
            focus-within:ring-[var(--accent-soft)]
            lg:w-[290px] lg:flex-none
          "
        >
          <span className="shrink-0 text-[var(--muted)]">
            <SearchIcon />
          </span>

          <label htmlFor="archinel-global-search" className="sr-only">
            Search scans, domains and IP addresses
          </label>

          <input
            id="archinel-global-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search scans, domains, IPs..."
            className="
              h-full min-w-0 flex-1 bg-transparent
              text-xs text-[var(--foreground)]
              outline-none placeholder:text-[var(--muted)]
            "
          />

          <kbd
            className="
              hidden shrink-0 rounded border
              border-[var(--border)] px-1.5 py-1
              text-[10px] text-[var(--muted)]
              sm:inline-block
            "
          >
            Enter
          </kbd>
        </form>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label={`Notifications, ${DEMO_NOTIFICATIONS.length} sample notifications`}
            aria-expanded={notificationsOpen}
            aria-controls="archinel-notifications"
            className="
              wax-press torch-glow relative
              grid h-11 w-11 place-items-center
              rounded-lg border border-[var(--border)]
              bg-[var(--surface-glass)]
              text-[var(--foreground)]
              focus-visible:outline-none
            "
          >
            <BellIcon />

            <span
              className="
                absolute -right-1 -top-1
                grid h-[18px] min-w-[18px]
                place-items-center rounded-full
                bg-[var(--accent)] px-1
                text-[10px] font-semibold
                text-[var(--accent-foreground)]
              "
              aria-hidden="true"
            >
              {DEMO_NOTIFICATIONS.length}
            </span>
          </button>

          {notificationsOpen && (
            <section
              id="archinel-notifications"
              role="region"
              aria-label="Sample notifications"
              className="
                scroll-unfurl absolute right-0 top-14
                z-50 w-[min(340px,calc(100vw-2rem))]
                rounded-xl border border-[var(--border)]
                bg-[var(--surface-elevated)]
                p-4 shadow-[var(--shadow-float)]
                backdrop-blur-xl
              "
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-gothic text-xl text-[var(--foreground)]">
                  The Messenger
                </h2>

                <span
                  className="
                    rounded border border-[var(--border)]
                    bg-[var(--accent-soft)] px-2 py-1
                    text-[9px] font-semibold uppercase
                    tracking-wider text-[var(--accent)]
                  "
                >
                  Demo
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {DEMO_NOTIFICATIONS.map((notification) => (
                  <div
                    key={notification.id}
                    className="
                      border-b border-[var(--border)]
                      pb-3 last:border-0 last:pb-0
                    "
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`
                          mt-1.5 h-2 w-2 shrink-0 rounded-full
                          ${
                            notification.type === "warning"
                              ? "bg-[var(--medium)]"
                              : "bg-[var(--accent)]"
                          }
                        `}
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--foreground)]">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Security emblem */}
        <div
          className="
            hidden h-11 w-11 shrink-0
            items-center justify-center
            rounded-lg border border-[var(--border)]
            bg-[var(--surface-glass)]
            text-[var(--accent)]
            sm:flex
          "
          title="Archinel digital trust"
          aria-label="Archinel digital trust"
        >
          <ShieldIcon />
        </div>

        {/* Theme switch */}
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
