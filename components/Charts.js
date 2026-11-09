
const TREND_VALUES = [38, 52, 65, 41, 35, 49, 72, 57, 62, 38, 47, 61, 75];

const DAYS = [
  "Nov 03",
  "Nov 04",
  "Nov 05",
  "Nov 06",
  "Nov 07",
  "Nov 08",
  "Nov 09",
];

const SEVERITY_DATA = [
  {
    label: "Critical",
    percentage: 12,
    count: 87,
    variable: "--critical",
    badge: "severity-critical",
  },
  {
    label: "High",
    percentage: 28,
    count: 202,
    variable: "--high",
    badge: "severity-high",
  },
  {
    label: "Medium",
    percentage: 34,
    count: 245,
    variable: "--medium",
    badge: "severity-medium",
  },
  {
    label: "Low",
    percentage: 26,
    count: 188,
    variable: "--low",
    badge: "severity-low",
  },
];

const GRAPH = {
  left: 48,
  right: 690,
  top: 28,
  bottom: 196,
};

const graphWidth = GRAPH.right - GRAPH.left;
const graphHeight = GRAPH.bottom - GRAPH.top;

// Convert sample risk values into SVG coordinates.
const trendPoints = TREND_VALUES.map((value, index) => ({
  x: GRAPH.left + (index / (TREND_VALUES.length - 1)) * graphWidth,
  y: GRAPH.bottom - (value / 100) * graphHeight,
  value,
}));

const trendLinePath = trendPoints
  .map((point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  })
  .join(" ");

const trendAreaPath = [
  trendLinePath,
  `L ${GRAPH.right} ${GRAPH.bottom}`,
  `L ${GRAPH.left} ${GRAPH.bottom} Z`,
].join(" ");

function RiskTrendChart() {
  const horizontalValues = [100, 75, 50, 25, 0];

  const dayPositions = DAYS.map((day, index) => ({
    day,
    x: GRAPH.left + (index / (DAYS.length - 1)) * graphWidth,
  }));

  return (
    <article
      className="
        glass-panel panel-lift stagger-in
        min-w-0 p-4 sm:p-5
      "
      style={{ "--stagger-index": 1 }}
    >
      <div className="relative z-10 mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-gothic text-2xl text-[var(--foreground)]">
            Risk Score Trend
          </h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Average website risk over the last seven days
          </p>
        </div>

        <span
          className="
            rounded-full border border-[var(--border)]
            bg-[var(--accent-soft)] px-2.5 py-1
            text-[9px] font-semibold uppercase
            tracking-wider text-[var(--accent)]
          "
        >
          Demo data
        </span>
      </div>

      <figure className="relative z-10 min-w-0">
        <svg
          viewBox="0 0 720 252"
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-labelledby="risk-trend-title risk-trend-description"
          className="block h-auto w-full overflow-visible"
        >
          <title id="risk-trend-title">
            Illustrative risk score trend
          </title>

          <desc id="risk-trend-description">
            A sample line chart showing risk scores across thirteen
            observations between November 3 and November 9, 2026.
            The sample values range from 35 to 75.
          </desc>

          <defs>
            <linearGradient
              id="archinel-trend-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--accent)"
                stopOpacity="0.25"
              />
              <stop
                offset="100%"
                stopColor="var(--accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {horizontalValues.map((value) => {
            const y =
              GRAPH.bottom - (value / 100) * graphHeight;

            return (
              <g key={value}>
                <line
                  x1={GRAPH.left}
                  y1={y}
                  x2={GRAPH.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeOpacity="0.65"
                  strokeDasharray="3 5"
                />

                <text
                  x="34"
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--muted)"
                  fontSize="11"
                  fontFamily="var(--font-interface)"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Vertical grid lines */}
          {dayPositions.map((point) => (
            <line
              key={point.day}
              x1={point.x}
              y1={GRAPH.top}
              x2={point.x}
              y2={GRAPH.bottom}
              stroke="var(--border)"
              strokeOpacity="0.3"
              strokeDasharray="2 6"
            />
          ))}

          {/* Area beneath the line */}
          <path
            d={trendAreaPath}
            fill="url(#archinel-trend-gradient)"
          />

          {/* Trend line */}
          <path
            d={trendLinePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {trendPoints.map((point, index) => (
            <g key={index}>
              {index === trendPoints.length - 1 && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="9"
                  fill="var(--accent)"
                  opacity="0.15"
                />
              )}

              <circle
                cx={point.x}
                cy={point.y}
                r={index === trendPoints.length - 1 ? 4.5 : 3}
                fill="var(--surface-elevated)"
                stroke="var(--accent)"
                strokeWidth="2"
              >
                <title>{`Sample risk score: ${point.value}`}</title>
              </circle>
            </g>
          ))}

          {/* Date labels */}
          {dayPositions.map((point) => (
            <text
              key={point.day}
              x={point.x}
              y="229"
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
              fontFamily="var(--font-interface)"
            >
              {point.day}
            </text>
          ))}
        </svg>

        <figcaption className="mt-1 text-[10px] text-[var(--muted)]">
          Illustrative risk scores · Not live monitoring data
        </figcaption>
      </figure>
    </article>
  );
}

function SeverityDonutChart() {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  let accumulatedLength = 0;

  return (
    <article
      className="
        glass-panel panel-lift stagger-in
        min-w-0 p-4 sm:p-5
      "
      style={{ "--stagger-index": 2 }}
    >
      <div className="relative z-10 mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-gothic text-2xl text-[var(--foreground)]">
            Severity Distribution
          </h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Breakdown of illustrative threat reports
          </p>
        </div>

        <span
          className="
            rounded-full border border-[var(--border)]
            bg-[var(--accent-soft)] px-2.5 py-1
            text-[9px] font-semibold uppercase
            tracking-wider text-[var(--accent)]
          "
        >
          Demo data
        </span>
      </div>

      <div className="
        relative z-10 flex flex-col items-center
        justify-center gap-6
        sm:flex-row sm:justify-around
      ">
        {/* Donut */}
        <figure className="relative h-[180px] w-[180px] shrink-0">
          <svg
            viewBox="0 0 160 160"
            width="100%"
            height="100%"
            role="img"
            aria-labelledby="severity-title severity-description"
          >
            <title id="severity-title">
              Severity distribution
            </title>

            <desc id="severity-description">
              Critical 12 percent, High 28 percent,
              Medium 34 percent and Low 26 percent.
              Illustrative sample data.
            </desc>

            <g transform="rotate(-90 80 80)">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeOpacity="0.45"
                strokeWidth="15"
              />

             
{/* Severity segments */}
{SEVERITY_DATA.map((item, index) => {
  const segmentLength =
    (item.percentage / 100) * circumference;

  // Calculate the length of all previous segments.
  const currentOffset = SEVERITY_DATA
    .slice(0, index)
    .reduce(
      (total, previousItem) =>
        total +
        (previousItem.percentage / 100) * circumference,
      0
    );

  return (
    <circle
      key={item.label}
      cx="80"
      cy="80"
      r={radius}
      fill="none"
      stroke={`var(${item.variable})`}
      strokeWidth="15"
      strokeDasharray={`${segmentLength} ${circumference}`}
      strokeDashoffset={-currentOffset}
      strokeLinecap="butt"
    >
      <title>{`${item.label}: ${item.percentage}%`}</title>
    </circle>
  );
})}

            </g>
          </svg>

          {/* Donut center label */}
          <div className="
            pointer-events-none absolute inset-0
            flex flex-col items-center justify-center
          ">
            <span className="
              count-value text-3xl font-semibold
              text-[var(--foreground)]
            ">
              722
            </span>

            <span className="
              mt-1 text-[10px] font-medium
              uppercase tracking-wider text-[var(--muted)]
            ">
              Reports
            </span>
          </div>
        </figure>

        {/* Legend */}
        <div className="flex w-full max-w-[260px] flex-col gap-3">
          {SEVERITY_DATA.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`
                    h-2.5 w-2.5 shrink-0
                    rounded-full
                    ${
                      item.label === "Critical"
                        ? "bg-[var(--critical)]"
                        : item.label === "High"
                          ? "bg-[var(--high)]"
                          : item.label === "Medium"
                            ? "bg-[var(--medium)]"
                            : "bg-[var(--low)]"
                    }
                  `}
                  aria-hidden="true"
                />

                <span className="text-sm text-[var(--foreground)]">
                  {item.label}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="w-10 text-right text-sm font-semibold tabular-nums text-[var(--foreground)]">
                  {item.percentage}%
                </span>

                <span className="w-10 text-right text-xs tabular-nums text-[var(--muted)]">
                  ({item.count})
                </span>
              </div>
            </div>
          ))}

          <div className="
            mt-1 border-t border-[var(--border)]
            pt-3 text-[10px] text-[var(--muted)]
          ">
            Total: 722 illustrative reports
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Charts() {
  return (
    <section
      aria-label="Threat analytics"
      className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2"
    >
      <RiskTrendChart />
      <SeverityDonutChart />
    </section>
  );
}
