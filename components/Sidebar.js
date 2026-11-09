
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "URL Scanner", href: "/url-scanner", icon: "scanner" },
  { label: "Scan History", href: "/scan-history", icon: "history" },
  {
    label: "Threat Intelligence",
    href: "/threat-intelligence",
    icon: "threat",
  },
  { label: "Reports", href: "/reports", icon: "reports" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const shapes = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    scanner: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
        <path d="M10.5 7v3.5l2.5 2" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 2.7-6.4L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    threat: (
      <>
        <path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    reports: (
      <>
        <path d="M7 3h10l4 4v14H3V3z" />
        <path d="M16 3v5h5" />
        <path d="M7 12h10M7 16h10" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.1 1.8-1.8 3.1-2.1-.4a8 8 0 0 1-1.5.9l-.5 2.1h-3.6l-.5-2.1a8 8 0 0 1-1.5-.9l-2.1.4-1.8-3.1 1.1-1.8a8 8 0 0 1 0-1.8l-1.1-1.8 1.8-3.1 2.1.4a8 8 0 0 1 1.5-.9l.5-2.1h3.6l.5 2.1a8 8 0 0 1 1.5.9l2.1-.4 1.8 3.1-1.1 1.8a8 8 0 0 1 0 1.7z" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...common}
    >
      {shapes[name]}
    </svg>
  );
}

function CompassMark({ className = "h-11 w-11" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="25" />
      <circle cx="32" cy="32" r="20" strokeDasharray="2 4" />
      <path d="M32 3v10M32 51v10M3 32h10M51 32h10" />
      <path d="m32 13 5 19-5 19-5-19z" />
      <path d="m32 13-5 19 5 19 5-19z" opacity=".55" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
    </svg>
  );
}

function CastleMark() {
  return (
    <svg
      viewBox="0 0 140 105"
      className="absolute bottom-2 right-2 h-20 w-28 opacity-35"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 94h118M22 94V48l13-12 13 12v46" />
      <path d="M27 48V24h7v8l5-8 7 8v16" />
      <path d="M60 94V36l12-12 12 12v58" />
      <path d="M66 38V12h5v9l5-9 5 9v17" />
      <path d="M92 94V48l11-11 12 11v46" />
      <path d="M97 48V29h6v8l6-8v19" />
      <path d="M68 94V73h12v21" />
      <path d="M32 94V76h8v18M100 94V76h8v18" />
      <path d="M8 55h7M125 55h7M12 62h8M122 62h8" />
      <path d="M70 4v-3M36 18l-4-5M106 22l5-7" />
    </svg>
  );
}

function SidebarContent({ pathname, onNavigate }) {
    const getRouteKey = (path) =>
    path === "/" ? "dashboard" : path.slice(1);

  const currentTransitionType = `from-${getRouteKey(pathname)}`;
  return (
    <div className="flex h-full flex-col px-4 py-5">
      {/* Brand */}
      <Link
        href="/"
          transitionTypes={[currentTransitionType, "to-dashboard"]}
        onClick={onNavigate}
        className="group flex items-center gap-3 rounded-lg px-2 py-2 focus-visible:outline-offset-2"
        aria-label="Archinel home"
      >
        <span className="text-[var(--accent)] transition-transform duration-300 ease-out group-hover:rotate-12">
          <CompassMark />
        </span>

        <span className="flex min-w-0 flex-col">
          <span className="font-gothic text-[2rem] leading-none tracking-wide text-[var(--foreground)]">
            Archinel
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Web Threat Intelligence
          </span>
        </span>
      </Link>

      {/* Divider */}
      <div className="my-6 border-t border-[var(--border)]" />

      {/* Navigation */}
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-subtle)]">
        Navigation
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
                transitionTypes={[
    currentTransitionType,
    `to-${getRouteKey(item.href)}`,
  ]}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`
                nav-interactive wax-press torch-glow
                group relative flex min-h-11 items-center gap-3
                rounded-lg border px-3 py-2.5
                ${
                  active
                    ? "border-[var(--ornament)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                }
              `}
            >
              <Icon
                name={item.icon}
                className="relative z-10 h-[19px] w-[19px] shrink-0"
              />

              <span className="relative z-10 text-sm font-medium">
                {item.label}
              </span>

              {active && (
                <span
                  className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom tagline */}
      <div className="mt-auto pt-8">
        <div className="ornate-frame relative overflow-hidden bg-[var(--surface-glass)] p-4 shadow-[var(--shadow-panel)]">
          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-2 text-[var(--accent)]">
              <CompassMark className="h-6 w-6" />
              <span className="font-gothic text-lg">
                A Word of Caution
              </span>
            </div>

            <p className="max-w-[165px] text-xs leading-6 text-[var(--foreground)]">
              Look beyond the padlock. Understand what stands behind every link.
            </p>
          </div>

          <CastleMark />
          <div className="relative z-10 mt-4 border-t border-[var(--border)] pt-3">
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Investigate with confidence
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-[var(--muted-subtle)]">
          ARCHINEL · DIGITAL TRUST
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer after navigation.
  useEffect(() => {
  const frame = requestAnimationFrame(() => {
    setMobileOpen(false);
  });

  return () => cancelAnimationFrame(frame);
}, [pathname]);

  // Support Escape and prevent background scrolling.
  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        aria-label="Application sidebar"
        className="
          sticky top-0 hidden h-screen w-[260px] shrink-0
          border-r border-[var(--border)]
          bg-[var(--surface-glass)] backdrop-blur-xl
          md:flex
        "
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="archinel-mobile-sidebar"
        className="
          wax-press fixed left-4 top-4 z-[70]
          grid h-11 w-11 place-items-center
          rounded-lg border border-[var(--border)]
          bg-[var(--surface-elevated)] text-[var(--foreground)]
          shadow-[var(--shadow-panel)]
          focus-visible:outline-none md:hidden
        "
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {mobileOpen ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Mobile drawer and overlay */}
      <div className="md:hidden">
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          className={`
            fixed inset-0 z-[50] cursor-default
            bg-black/50 backdrop-blur-[2px]
            transition-opacity duration-300
            ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
          `}
        />

        <aside
          id="archinel-mobile-sidebar"
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
          inert={!mobileOpen}
          className={`
            fixed inset-y-0 left-0 z-[60]
            flex h-dvh w-[min(84vw,300px)] flex-col
            border-r border-[var(--border)]
            bg-[var(--surface)] shadow-[var(--shadow-float)]
            transition-transform duration-300 ease-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>
      </div>
    </>
  );
}
