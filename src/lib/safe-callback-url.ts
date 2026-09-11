/**
 * Allow only same-origin relative admin paths.
 * Rejects protocol-relative URLs, schemes, and encoded path tricks.
 */
export function getSafeCallbackUrl(value: string | undefined | null, fallback = "/admin") {
  if (!value) return fallback;

  let candidate = value.trim();
  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    return fallback;
  }

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const url = new URL(candidate);
      candidate = `${url.pathname}${url.search}`;
    } catch {
      return fallback;
    }
  }

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes(":") ||
    candidate.includes("\0")
  ) {
    return fallback;
  }

  return candidate.startsWith("/admin") ? candidate : fallback;
}
