import { isIP } from "node:net";

const CLOUDFLARE_BASE =
  "https://api.cloudflare.com/client/v4/accounts";

function getConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials are not configured.");
  }

  return { accountId, apiToken };
}

function validateURL(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Please provide a website URL.");
  }

  const candidate = /^https?:\/\//i.test(input.trim())
    ? input.trim()
    : `https://${input.trim()}`;

  let parsed;

  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Please enter a valid website URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    !hostname.includes(".") ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    isIP(hostname)
  ) {
    throw new Error("Please enter a public website domain.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("URLs containing login credentials are not accepted.");
  }

  if (parsed.href.length > 2048) {
    throw new Error("The URL is too long.");
  }

  parsed.hash = "";

  return parsed;
}

async function cloudflareRequest(path, options = {}) {
  const { accountId, apiToken } = getConfig();

  const response = await fetch(
    `${CLOUDFLARE_BASE}/${encodeURIComponent(accountId)}/urlscanner/v2/${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    // Handle non-JSON error responses below.
  }

  return { response, data };
}

function getCloudflareError(data) {
  const errors = Array.isArray(data.errors)
    ? data.errors.map((item) => item.message).filter(Boolean)
    : [];

  return (
    errors.join("; ") ||
    data.message ||
    "Cloudflare could not process the request."
  );
}

// POST /api/scan
// Submit a new website investigation.
export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = validateURL(body.url);

    const { response, data } = await cloudflareRequest("scan", {
      method: "POST",
      body: JSON.stringify({
        url: parsed.href,
        visibility: "Unlisted",
      }),
    });

    if (!response.ok) {
      console.error("Cloudflare submission failed:", response.status);

      return Response.json(
        { error: getCloudflareError(data) },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const scanId = data.uuid ?? data.result?.uuid;

    if (!scanId) {
      return Response.json(
        { error: "Cloudflare did not return a scan ID." },
        { status: 502 }
      );
    }

    return Response.json(
      {
        status: "pending",
        scanId,
        url: parsed.href,
        message: "Investigation submitted successfully.",
      },
      { status: 202 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Scan submission failed.";

    const status = message.includes("credentials") ? 500 : 400;

    return Response.json({ error: message }, { status });
  }
}

// GET /api/scan?id=SCAN_ID
// Retrieve a completed investigation.
export async function GET(request) {
  try {
    const scanId = new URL(request.url).searchParams.get("id");

    if (
      !scanId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        scanId
      )
    ) {
      return Response.json(
        { error: "A valid scan ID is required." },
        { status: 400 }
      );
    }

    const { response, data } = await cloudflareRequest(
      `result/${encodeURIComponent(scanId)}`
    );

    // Cloudflare returns 404 while a scan is still processing.
    if (response.status === 404) {
      return Response.json(
        { status: "pending", scanId },
        { status: 202 }
      );
    }

    if (!response.ok) {
      return Response.json(
        { error: getCloudflareError(data) },
        { status: 502 }
      );
    }

    const report =
      data.result && typeof data.result === "object"
        ? data.result
        : data;

    const verdicts =
      report.verdicts?.overall ?? report.verdicts ?? {};

    const malicious = verdicts.malicious === true;

    const hasVerdicts =
      typeof verdicts.hasVerdicts === "boolean"
        ? verdicts.hasVerdicts
        : typeof verdicts.malicious === "boolean";

    // Do not call an inconclusive scan safe.
    const score = malicious ? 92 : hasVerdicts ? 8 : 50;

    const severity =
      score >= 85
        ? "Critical"
        : score >= 65
          ? "High"
          : score >= 40
            ? "Medium"
            : "Low";

    const verdict = malicious
      ? "Risky"
      : hasVerdicts
        ? "Safe"
        : "Inconclusive";

    const reasons = [];

    if (malicious) {
      reasons.push("Cloudflare classified this website as malicious.");
    } else if (hasVerdicts) {
      reasons.push(
        "Cloudflare did not flag this website as malicious."
      );
      reasons.push(
        "A clean verdict does not guarantee that a website is safe."
      );
    } else {
      reasons.push(
        "Cloudflare did not return a definitive security verdict."
      );
    }

    const categories = verdicts.categories ?? [];
    const tags = verdicts.tags ?? [];

    if (categories.length) {
      reasons.push(`Threat categories: ${categories.join(", ")}.`);
    }

    if (tags.length) {
      reasons.push(`Scanner tags: ${tags.slice(0, 5).join(", ")}.`);
    }

    if (reasons.length === 1) {
      reasons.push(
        `Cloudflare recorded ${report.data?.requests?.length ?? 0} network requests during the investigation.`
      );
    }

    const scannedURL =
      report.task?.url ??
      report.page?.url ??
      report.meta?.url ??
      "";

    let domain = "";

    try {
      domain = new URL(scannedURL).hostname;
    } catch {
      domain = "Unknown";
    }

    return Response.json({
      id: `CF-${scanId}`,
      scanId,
      url: scannedURL,
      domain,
      score,
      severity,
      verdict,
      reasons,
      scannedAt: report.task?.time ?? new Date().toISOString(),
      source: "Cloudflare URL Scanner",
      reportUrl: report.task?.reportURL ?? null,
      screenshotUrl: report.task?.screenshotURL ?? null,
    });
  } catch (error) {
    console.error("Cloudflare result error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve the scan report.",
      },
      { status: 502 }
    );
  }
}

