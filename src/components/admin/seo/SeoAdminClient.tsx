"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { upsertSeoSetting } from "@/app/actions/seo";
import { SeoEditorPanel } from "@/components/admin/seo/SeoEditorPanel";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  seoEditorToInput,
  seoRowToEditorValue,
  type SeoEditorValue,
} from "@/lib/seo-admin";

type SeoSettingRow = {
  id: string;
  routePath: string;
  metaTitle: string | null;
  metaDesc: string | null;
  h1: string | null;
  indexed: boolean;
  robotsFollow: boolean;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string;
  schemaType: string | null;
  customJsonLd: string | null;
  sitemapInclude: boolean;
  sitemapPriority: number;
};

export function SeoAdminClient({
  settings,
  routes,
  siteUrl,
}: {
  settings: SeoSettingRow[];
  routes: string[];
  siteUrl: string;
}) {
  const [pending, startTransition] = useTransition();
  const [selectedPath, setSelectedPath] = useState(routes[0] ?? "/");
  const settingsByPath = useMemo(
    () => new Map(settings.map((row) => [row.routePath, row])),
    [settings]
  );
  const [drafts, setDrafts] = useState<Record<string, SeoEditorValue>>({});

  const current =
    drafts[selectedPath] ??
    seoRowToEditorValue(settingsByPath.get(selectedPath));

  function setCurrent(value: SeoEditorValue) {
    setDrafts((prev) => ({ ...prev, [selectedPath]: value }));
  }

  function save() {
    startTransition(async () => {
      const result = await upsertSeoSetting(
        selectedPath,
        seoEditorToInput(current)
      );
      if ("error" in result) {
        toast.error(`Save failed: ${result.error}`);
        return;
      }
      toast.success(`SEO saved for ${selectedPath}`);
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="admin-card max-h-[70vh] space-y-1 overflow-y-auto rounded-2xl p-3">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          Pages
        </p>
        {routes.map((routePath) => {
          const row = settingsByPath.get(routePath);
          const isSelected = routePath === selectedPath;
          return (
            <button
              key={routePath}
              type="button"
              onClick={() => setSelectedPath(routePath)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                isSelected
                  ? "bg-[var(--color-surface-strong)] text-[var(--color-foreground)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              <span className="mono truncate">{routePath}</span>
              <StatusBadge status={row?.indexed ?? true ? "PUBLISHED" : "DRAFT"} />
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="admin-panel flex items-center justify-between p-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              Editing {selectedPath}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Changes apply to the public page after save and revalidation.
            </p>
          </div>
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save page SEO"}
          </Button>
        </div>
        <SeoEditorPanel
          value={current}
          onChange={setCurrent}
          routePath={selectedPath}
          siteUrl={siteUrl}
          dirty
        />
      </div>
    </div>
  );
}
