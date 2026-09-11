/**
 * Rate limiter with an optional shared Redis store.
 *
 * When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, limits are
 * enforced across all serverless instances via Upstash's REST API. Without
 * those variables it falls back to a per-instance in-memory counter, which is
 * only best-effort on distributed/serverless deployments.
 */

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memory = new Map<string, MemoryEntry>();

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = memory.get(key);

  if (!current || now > current.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count, retryAfterMs: 0 };
}

async function upstashLimit(
  url: string,
  token: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(2_000),
  });

  if (!response.ok) {
    throw new Error(`Upstash rate-limit error ${response.status}`);
  }

  const data = (await response.json()) as Array<{ result?: number }>;
  const count = Number(data?.[0]?.result ?? 0);

  if (count > limit) {
    return { ok: false, remaining: 0, retryAfterMs: windowMs };
  }
  return { ok: true, remaining: Math.max(0, limit - count), retryAfterMs: 0 };
}

export async function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      return await upstashLimit(url, token, `rl:${key}`, limit, windowMs);
    } catch {
      // Fail open to the in-memory limiter so a Redis outage cannot lock users out.
      return memoryLimit(key, limit, windowMs);
    }
  }

  return memoryLimit(key, limit, windowMs);
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

export async function assertLoginRateLimit(identifier: string) {
  const result = await checkRateLimit(`login:${identifier}`, {
    limit: LOGIN_MAX_ATTEMPTS,
    windowMs: LOGIN_WINDOW_MS,
  });

  if (!result.ok) {
    throw new Error("Too many login attempts. Try again later.");
  }
}
