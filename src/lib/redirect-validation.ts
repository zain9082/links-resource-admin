/**
 * Portal copy of safe redirect validation (keep in sync with
 * links-resource/src/lib/seo/redirect-rules.ts).
 */

export function normalizeRedirectPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  if (!trimmed.startsWith("/")) return `/${trimmed.replace(/^\/+/, "")}`;
  if (trimmed.startsWith("//")) return "/";
  const noTrail = trimmed === "/" ? "/" : trimmed.replace(/\/+$/, "");
  return noTrail || "/";
}

export function isSafeWildcardSource(source: string): boolean {
  if (source.length < 2 || source.length > 200) return false;
  if (!source.startsWith("/") || source.startsWith("//")) return false;
  if (/\s/.test(source)) return false;
  const starCount = (source.match(/\*/g) ?? []).length;
  if (starCount !== 1) return false;
  if (!source.endsWith("/*")) return false;
  const literal = source.slice(0, -1);
  if (/[\\^$+?()[\]{}|.]/.test(literal.replace(/\//g, ""))) return false;
  return true;
}

export function isExactLocalPath(source: string): boolean {
  if (!source.startsWith("/") || source.startsWith("//")) return false;
  if (source.length > 500) return false;
  if (/\s|\*/.test(source)) return false;
  if (/[\\^$+?()[\]{}|.]/.test(source.replace(/\//g, ""))) return false;
  return true;
}

export function wouldCreateRedirectLoop(
  source: string,
  destination: string,
  existing: Array<{ source: string; destination: string }>
): boolean {
  const src = normalizeRedirectPath(source);
  const dest = normalizeRedirectPath(destination);
  if (!dest || dest === src) return true;

  const map = new Map(
    existing.map((rule) => [
      normalizeRedirectPath(rule.source),
      normalizeRedirectPath(rule.destination),
    ])
  );
  map.set(src, dest);

  const visited = new Set<string>();
  let current: string | undefined = src;
  while (current) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = map.get(current);
    if (current === "") break;
  }
  return false;
}
