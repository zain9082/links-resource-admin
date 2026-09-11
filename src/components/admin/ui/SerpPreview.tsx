type SerpPreviewProps = {
  title: string;
  description: string;
  url: string;
};

function PreviewCard({
  title,
  description,
  url,
  label,
  compact,
}: SerpPreviewProps & { label: string; compact?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <div
        className={`admin-panel overflow-hidden p-4 ${compact ? "max-w-[360px]" : ""}`}
      >
        <p className="truncate text-xs text-emerald-600 dark:text-emerald-300">{url}</p>
        <p
          className={`mt-1 line-clamp-2 text-blue-600 dark:text-blue-300 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {title || "Page title preview"}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
          {description || "Meta description preview appears here."}
        </p>
      </div>
    </div>
  );
}

export function SerpPreview({ title, description, url }: SerpPreviewProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--color-muted)]">
        Search preview is an approximation — Google may rewrite titles and snippets.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <PreviewCard
          label="Desktop"
          title={title}
          description={description}
          url={url}
        />
        <PreviewCard
          label="Mobile"
          title={title}
          description={description}
          url={url}
          compact
        />
      </div>
    </div>
  );
}
