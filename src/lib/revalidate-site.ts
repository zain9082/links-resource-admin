export async function revalidateWebsite(paths: string[]) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) {
    throw new Error(
      "Content was saved, but website revalidation is not configured."
    );
  }

  const results = await Promise.allSettled(
    [...new Set(paths)].map(async (path) => {
      const endpoint = new URL("/api/revalidate", base);
      endpoint.searchParams.set("path", path);
      const response = await fetch(endpoint, {
        method: "POST",
        cache: "no-store",
        headers: { authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Revalidation failed with status ${response.status}.`);
      }
    })
  );

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.error("Public website revalidation failed", {
      failed: failed.length,
      total: results.length,
    });
    throw new Error(
      "Content was saved, but the public website refresh failed. Please retry publishing."
    );
  }
}

/** Bust website in-memory redirect cache (best-effort per instance + updatedAt stamp). */
export async function revalidateWebsiteRedirects() {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) {
    console.error("[redirects] Cannot bust redirect cache — site URL/secret missing");
    return;
  }

  try {
    const endpoint = new URL("/api/redirects-revalidate", base);
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("[redirects] Redirect cache bust failed", response.status);
    }
  } catch (error) {
    console.error("[redirects] Redirect cache bust error", error);
  }
}
