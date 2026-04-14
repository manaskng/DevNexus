import { Redis } from "@upstash/redis";

// ──────────────────────────────────────────────────────
// Redis Cache Layer (Upstash)
// Uses lazy initialization to ensure dotenv has loaded
// the environment variables before we try to connect.
// If credentials are missing or the service is unreachable,
// every method degrades gracefully — the app works without caching.
// ──────────────────────────────────────────────────────

let redis = null;
let initialized = false;

function getRedis() {
  if (initialized) return redis;
  initialized = true;

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      console.log("✓ Redis (Upstash) client initialized");
    } else {
      console.warn("⚠ Redis credentials missing — caching disabled");
    }
  } catch (err) {
    console.error("✗ Redis initialization failed:", err.message);
  }

  return redis;
}

// ── Cache helpers ────────────────────────────────────

/**
 * Get a value from cache.
 * Returns `null` if cache miss or Redis unavailable.
 */
export async function cacheGet(key) {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch (err) {
    console.warn(`Cache GET failed for "${key}":`, err.message);
    return null;
  }
}

/**
 * Set a value in cache with a TTL (in seconds).
 * Silently fails if Redis is unavailable.
 */
export async function cacheSet(key, value, ttlSeconds = 3600) {
  const client = getRedis();
  if (!client) return;
  try {
    await client.set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.warn(`Cache SET failed for "${key}":`, err.message);
  }
}

/**
 * Delete a key from cache.
 */
export async function cacheDel(key) {
  const client = getRedis();
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    console.warn(`Cache DEL failed for "${key}":`, err.message);
  }
}

export { redis };
export default redis;
