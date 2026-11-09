
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "archinel-scans-v1";
const ScanContext = createContext(null);

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function validateURL(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Please enter a website URL to investigate.");
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed;

  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Please enter a valid website URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS are supported.");
  }

  if (
    !parsed.hostname ||
    !parsed.hostname.includes(".") ||
    parsed.hostname === "localhost" ||
    parsed.hostname.endsWith(".localhost") ||
    parsed.hostname.endsWith(".local")
  ) {
    throw new Error("Please enter a public website domain.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("URLs containing login credentials are not accepted.");
  }

  if (parsed.href.length > 2048) {
    throw new Error("The URL is too long.");
  }

  return parsed.href;
}

export function ScanProvider({ children }) {
  const [url, setURL] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [error, setError] = useState("");
  const [recentScans, setRecentScans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const scanningRef = useRef(false);

  // Load saved scan history.
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (Array.isArray(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentScans(saved.slice(0, 10));
      }
    } catch {
      // Ignore corrupted storage.
    }

    setHydrated(true);
  }, []);

  // Persist history after loading.
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recentScans)
      );
    } catch {
      // Storage unavailable.
    }
  }, [recentScans, hydrated]);

  // Real Cloudflare URL investigation.
  const handleScan = useCallback(async (input) => {
    if (scanningRef.current) return;

    setError("");

    let normalized;

    try {
      normalized = validateURL(input);
    } catch (e) {
      setError(e.message);
      return;
    }

    scanningRef.current = true;
    setURL(normalized);
    setIsScanning(true);
    setLatestResult(null);

    try {
      // Submit URL to our server-side Cloudflare route.
      const submitResponse = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalized }),
      });

      const submission = await submitResponse
        .json()
        .catch(() => ({}));

      if (!submitResponse.ok) {
        throw new Error(
          submission.error || "Cloudflare scan submission failed."
        );
      }

      if (!submission.scanId) {
        throw new Error("Cloudflare did not return a scan ID.");
      }

      let record = null;

      // Check immediately, then poll every 10 seconds.
      // Maximum wait: approximately 110 seconds.
      for (let attempt = 0; attempt < 12; attempt++) {
        if (attempt > 0) {
          await wait(10000);
        }

        const resultResponse = await fetch(
          `/api/scan?id=${encodeURIComponent(submission.scanId)}`,
          { cache: "no-store" }
        );

        const resultData = await resultResponse
          .json()
          .catch(() => ({}));

        if (
          resultResponse.status === 202 ||
          resultData.status === "pending"
        ) {
          continue;
        }

        if (!resultResponse.ok) {
          throw new Error(
            resultData.error || "Could not retrieve the scan report."
          );
        }

        if (typeof resultData.score !== "number") {
          throw new Error("Cloudflare returned an invalid scan report.");
        }

        const parsed = new URL(normalized);

        record = {
          ...resultData,
          url: resultData.url || normalized,
          domain: resultData.domain || parsed.hostname,
          riskScore: resultData.score,
        };

        break;
      }

      if (!record) {
        throw new Error(
          "Cloudflare is still processing this scan. Please try again shortly."
        );
      }

      setLatestResult(record);

      setRecentScans((previous) =>
        [
          record,
          ...previous.filter(
            (scan) => scan.url !== record.url
          ),
        ].slice(0, 10)
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "The investigation could not be completed."
      );
    } finally {
      scanningRef.current = false;
      setIsScanning(false);
    }
  }, []);

  const visibleScans = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (!query) return recentScans;

    return recentScans.filter((scan) =>
      [
        scan.url,
        scan.domain,
        scan.verdict,
        scan.severity,
        scan.source,
        scan.id,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [recentScans, searchQuery]);

  const value = {
    url,
    setURL,
    isScanning,
    latestResult,
    error,
    setError,
    recentScans,
    visibleScans,
    searchQuery,
    setSearchQuery,
    handleScan,
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);

  if (!context) {
    throw new Error("useScan must be used inside <ScanProvider>");
  }

  return context;
}
