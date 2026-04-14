import { redis } from "../config/redis.js";

// ──────────────────────────────────────────────────────
// Sliding-Window Rate Limiter
// Uses Redis sorted sets for a clean sliding-window
// implementation. If Redis is unavailable, the limiter
// fails open (allows the request through).
// ──────────────────────────────────────────────────────

/**
 * Creates a rate-limiting middleware.
 *
 * @param {Object} opts
 * @param {number} opts.maxRequests  - Max requests allowed in the window
 * @param {number} opts.windowMs     - Window duration in milliseconds
 * @param {string} opts.prefix       - Redis key prefix (e.g. "rl:ai")
 */
export function rateLimiter({ maxRequests = 10, windowMs = 60000, prefix = "rl" } = {}) {
  return async (req, res, next) => {
    // If Redis isn't available, fail open — don't block the user
    if (!redis) return next();

    // Build a per-user key using their JWT-decoded user id
    const userId = req.user?._id || req.ip;
    const key = `${prefix}:${userId}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      // Pipeline: clean old entries, add current request, count, set expiry
      const pipeline = redis.pipeline();
      pipeline.zremrangebyscore(key, 0, windowStart);   // Remove expired entries
      pipeline.zadd(key, { score: now, member: `${now}` }); // Log this request
      pipeline.zcard(key);                                // Count requests in window
      pipeline.expire(key, Math.ceil(windowMs / 1000));  // Auto-cleanup

      const results = await pipeline.exec();
      const requestCount = results[2]; // zcard result

      // Set informational headers
      res.set("X-RateLimit-Limit", String(maxRequests));
      res.set("X-RateLimit-Remaining", String(Math.max(0, maxRequests - requestCount)));

      if (requestCount > maxRequests) {
        const retryAfter = Math.ceil(windowMs / 1000);
        res.set("Retry-After", String(retryAfter));
        return res.status(429).json({
          message: "Too many requests. Please slow down.",
          retryAfter,
        });
      }

      next();
    } catch (err) {
      // Redis error — fail open, don't block the user
      console.warn("Rate limiter error (failing open):", err.message);
      next();
    }
  };
}
