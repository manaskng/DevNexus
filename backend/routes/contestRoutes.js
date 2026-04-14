import express from "express";
import axios from "axios";
import { cacheGet, cacheSet } from "../config/redis.js";

const router = express.Router();

// ──────────────────────────────────────────────────────
// Contest Aggregation Endpoint
// Fetches upcoming coding contests from multiple platforms
// via the Kontests API. Results are cached in Redis for
// 1 hour to avoid hammering the upstream API.
// ──────────────────────────────────────────────────────

const CACHE_KEY = "contests:upcoming";
const CACHE_TTL = 3600; // 1 hour in seconds

// Platform display metadata
const PLATFORM_META = {
  "codeforces.com":       { name: "Codeforces",   color: "#1F8ACB", shortName: "CF" },
  "codechef.com":         { name: "CodeChef",     color: "#5B4638", shortName: "CC" },
  "leetcode.com":         { name: "LeetCode",     color: "#FFA116", shortName: "LC" },
  "atcoder.jp":           { name: "AtCoder",      color: "#222222", shortName: "AC" },
  "hackerrank.com":       { name: "HackerRank",   color: "#00EA64", shortName: "HR" },
  "hackerearth.com":      { name: "HackerEarth",  color: "#2C3454", shortName: "HE" },
  "topcoder.com":         { name: "TopCoder",     color: "#29AAE1", shortName: "TC" },
  "codingninjas.com":     { name: "Coding Ninjas", color: "#F96D00", shortName: "CN" },
  "geeksforgeeks.org":    { name: "GeeksforGeeks", color: "#2E8D46", shortName: "GFG" },
  "naukri.com/code360":   { name: "Naukri360",    color: "#0052CC", shortName: "N360" },
};

/**
 * Detect platform from Clist resource and attach metadata.
 */
function enrichContest(raw) {
  const resource = raw.resource || "";
  let platform = { name: "Other", color: "#6366f1", shortName: "OTH" };

  for (const [domain, meta] of Object.entries(PLATFORM_META)) {
    if (resource.includes(domain) || (raw.href && raw.href.includes(domain))) {
      platform = meta;
      break;
    }
  }

  // Clist usually returns time in UTC without 'Z', appending 'Z' explicitly handles the parsing correctly.
  const startTime = new Date(raw.start.endsWith('Z') ? raw.start : raw.start + "Z");
  const endTime = new Date(raw.end.endsWith('Z') ? raw.end : raw.end + "Z");
  const durationSeconds = parseFloat(raw.duration) || 0;
  const durationHours = Math.round(durationSeconds / 3600);
  const now = new Date();
  
  // Status logic based on current time
  let status = "BEFORE";
  if (startTime <= now && endTime >= now) status = "CODING";

  return {
    name: raw.event,
    url: raw.href,
    platform,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationSeconds, // send precise seconds down to UI
    durationHours,
    status,
    resource: raw.resource
  };
}

/**
 * Fetch contests from CLIST API with error handling.
 */
async function fetchFromClist() {
  const now = new Date();
  const startGt = now.toISOString().substring(0, 19);
  
  const apiKey = process.env.CLIST_API_KEY || "ApiKey Mraj:c7b0616de8ee8dbb34fb9d91182c58ee31470da8";

  // Only fetch from major competitive programming platforms
  const majorPlatforms = [
    "codeforces.com",
    "leetcode.com",
    "codechef.com",
    "atcoder.jp",
    "hackerrank.com",
    "hackerearth.com",
    "topcoder.com",
    "geeksforgeeks.org",
    "naukri.com/code360"
  ].join(",");

  const url = `https://clist.by:443/api/v4/contest/?format=json&order_by=start&limit=100&end__gt=${startGt}&resource__in=${majorPlatforms}`;

  const response = await axios.get(url, {
    timeout: 10000,
    headers: { 
      "Accept": "application/json",
      "Authorization": apiKey
    },
  });

  if (!response.data || !Array.isArray(response.data.objects)) {
    console.error("Clist API error format:", response.data);
    throw new Error("Unexpected response format from CLIST API");
  }

  return response.data.objects;
}

// ── GET /api/contests ────────────────────────────────

router.get("/", async (req, res) => {
  try {
    // 1. Try cache first
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return res.json({
        contests: cached,
        source: "cache",
        cachedAt: await cacheGet(`${CACHE_KEY}:timestamp`),
      });
    }

    // 2. Fetch fresh data
    const rawContests = await fetchFromClist();

    // 3. Normalize and filter — clist end__gt handles mostly, we just map
    const now = new Date();
    const contests = rawContests
      .map(enrichContest)
      .filter((c) => new Date(c.endTime) > now) // extra check
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // 4. Cache the result
    const timestamp = new Date().toISOString();
    await cacheSet(CACHE_KEY, contests, CACHE_TTL);
    await cacheSet(`${CACHE_KEY}:timestamp`, timestamp, CACHE_TTL);

    return res.json({
      contests,
      source: "api",
      cachedAt: timestamp,
    });
  } catch (error) {
    console.error("Contest fetch error:", error.message);

    // If API fails, try serving stale cache (if Redis has it with no TTL check)
    const staleCache = await cacheGet(CACHE_KEY);
    if (staleCache) {
      return res.json({
        contests: staleCache,
        source: "stale-cache",
        cachedAt: await cacheGet(`${CACHE_KEY}:timestamp`),
        warning: "Serving cached data — live API is temporarily unavailable.",
      });
    }

    // No cache, no API — truly unavailable
    return res.status(503).json({
      message: "Contest data is currently unavailable. Please try again later.",
      contests: [],
    });
  }
});

export default router;
