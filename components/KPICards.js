
"use client";

import { useEffect, useState } from "react";

const METRICS = [
  {
    id: "scanned",
    label: "URLs Scanned",
    value: 4782,
    icon: "compass",
    change: "+12.6%",
    trend: "from last 7 days",
    trendType: "positive",
  },
  {
    id: "blocked",
    label: "Threats Blocked",
    value: 1263,
    icon: "shield",
    change: "+18.4%",
    trend: "from last 7 days",
    trendType: "positive",
  },
  {
    id: "risk",
    label: "Average Risk Score",
    value: 36,
    suffix: "/ 100",
    icon: "gauge",
    change: "-8.7%",
    trend: "from last 7 days",
    trendType: "positive",
  },
  {
    id: "alerts",
    label: "Active Alerts",
    value: 12,
    icon: "tower",
    change: "+2",
    trend: "from last 7 days",
    trendType: "warning",
  },
];

const numberFormatter = new Intl.NumberFormat("en-US");

function MetricIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    compass: (
      <>
        <circle cx="24" cy="24" r="17" />
        <circle cx="24" cy="24" r="12" strokeDasharray="2 4" />
        <path d="m24 10 4 14-4 14-4-14z" />
        <path d="M24 3v5M24 40v5M3 24h5M40 24h5" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </>
    ),
    shield: (
      <>
        <path d="M24 3 40 9v12c0 10-7 17-16 21C15 38 8 31 8 21V9z" />
        <path d="m16 24 5 5 11-12" />
      </>
    ),
    gauge: (
      <>
        <path d="M8 34a18 18 0 1 1 32 0" />
        <path d="M24 24 35 13" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <path d="M8 34h32" />
        <path d="M12 20l-3-2M36 20l3-2M24 7v4" />
      </>
    ),
    tower: (
      <>
        <path d="M12 42V16h24v26" />
        <path d="M12 16 17 8h14l5 8" />
        <path d="M19 8V4h10v4" />
        <path d="M19 42V29h10v13" />
        <path d="M17 20h4M27 20h4M17 26h4M27 26h4" />
        <path d="M24 4V1" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10"
      aria-hidden="true"
      {...common}
    >
      {icons[type]}
    </svg>
  );
}

function CountUp({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

   if (reducedMotion) {
  const frame = requestAnimationFrame(() => {
    setDisplayValue(value);
  });

  return () => cancelAnimationFrame(frame);
}

    const duration = 360;
    let animationFrame;
    let startTime = null;

    function animate(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve.
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value]);

  return (
    <span
      className="count-value inline-block whitespace-nowrap"
      aria-label={`${numberFormatter.format(value)} ${suffix}`}
    >
      {numberFormatter.format(displayValue)}
      {suffix && (
        <span className="ml-1 text-base font-normal text-[var(--muted)]">
          {suffix}
        </span>
      )}
    </span>
  );
}

function MetricCard({ metric, index }) {
  const trendIsWarning = metric.trendType === "warning";

  return (
    <article
      className="
        glass-panel panel-lift stagger-in
        relative overflow-hidden p-4 sm:p-5
      "
      style={{
        "--stagger-index": index,
      }}
      aria-label={`${metric.label}: ${numberFormatter.format(metric.value)}. Sample data.`}
    >
      {/* Decorative inner frame */}
      <div
        className="
          pointer-events-none absolute inset-1.5
          rounded-[9px] border border-[var(--ornament)]
          opacity-35
        "
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="
            text-xs font-semibold tracking-wide
            text-[var(--muted)] sm:text-sm
          ">
            {metric.label}
          </p>

          <div className="
            mt-3 flex items-baseline gap-1
            text-3xl font-semibold tracking-tight
            text-[var(--foreground)] tabular-nums
            sm:text-[2rem]
          ">
            <CountUp
              value={metric.value}
              suffix={metric.suffix}
            />
          </div>
        </div>

        {/* Emblem */}
        <div className="
          grid h-12 w-12 shrink-0 place-items-center
          rounded-xl border border-[var(--ornament)]
          bg-[var(--accent-soft)]
          text-[var(--accent)]
        ">
          <MetricIcon type={metric.icon} />
        </div>
      </div>

      {/* Trend */}
      <div className="
        relative z-10 mt-4 flex flex-wrap
        items-center gap-1.5 text-[11px]
      ">
        <span
          className={`
            font-semibold
            ${
              trendIsWarning
                ? "text-[var(--high)]"
                : "text-[var(--low)]"
            }
          `}
        >
          {metric.change}
        </span>

        <span className="text-[var(--muted)]">
          {metric.trend}
        </span>
      </div>

      {/* Sample data label */}
      <div className="
        relative z-10 mt-3 border-t
        border-[var(--border)] pt-2
      ">
        <span className="
          text-[9px] font-medium uppercase
          tracking-[0.16em] text-[var(--muted)]
        ">
          Illustrative demo data
        </span>
      </div>
    </article>
  );
}

export default function KPICards() {
  return (
    <section
      aria-labelledby="archinel-metrics-title"
      className="w-full"
    >
      <div className="
        mb-3 flex flex-wrap items-center
        justify-between gap-2
      ">
        <h2
          id="archinel-metrics-title"
          className="
            font-gothic text-xl
            text-[var(--foreground)]
          "
        >
          The Realm at a Glance
        </h2>

        <span className="
          rounded-full border border-[var(--border)]
          bg-[var(--accent-soft)] px-2.5 py-1
          text-[9px] font-semibold uppercase
          tracking-[0.13em] text-[var(--accent)]
        ">
          Sample Statistics
        </span>
      </div>

      <div className="
        grid grid-cols-1 gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      ">
        {METRICS.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
