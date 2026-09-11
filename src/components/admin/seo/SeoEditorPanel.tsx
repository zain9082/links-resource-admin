"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FormField } from "@/components/admin/ui/FormField";
import { SerpPreview } from "@/components/admin/ui/SerpPreview";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { Input } from "@/components/ui/input";
import {
  SITEMAP_PRIORITY_OPTIONS,
  type SeoEditorValue,
} from "@/lib/seo-admin";

type SeoEditorPanelProps = {
  value: SeoEditorValue;
  onChange: (value: SeoEditorValue) => void;
  routePath: string;
  siteUrl?: string;
  dirty?: boolean;
  slugField?: React.ReactNode;
};

function CharCounter({
  value,
  warnMin,
  warnMax,
}: {
  value: string;
  warnMin: number;
  warnMax: number;
}) {
  const length = value.length;
  const outOfRange = length > 0 && (length < warnMin || length > warnMax);
  return (
    <p
      className={`text-xs ${
        outOfRange ? "text-amber-500" : "text-[var(--color-muted)]"
      }`}
    >
      {length} characters (aim {warnMin}–{warnMax})
    </p>
  );
}

function patch(
  value: SeoEditorValue,
  onChange: (value: SeoEditorValue) => void,
  partial: Partial<SeoEditorValue>
) {
  onChange({ ...value, ...partial });
}

export function SeoEditorPanel({
  value,
  onChange,
  routePath,
  siteUrl = "https://linksresource.com",
  dirty,
  slugField,
}: SeoEditorPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const previewUrl = `${siteUrl.replace(/\/+$/, "")}${routePath === "/" ? "" : routePath}`;

  return (
    <div className="space-y-4">
      <SectionCard
        title="Search listing"
        description="Title and description shown in search results for this page."
      >
        {slugField}
        <FormField label="Meta title" dirty={dirty}>
          <Input
            value={value.metaTitle}
            onChange={(event) =>
              patch(value, onChange, { metaTitle: event.target.value })
            }
            placeholder="Clear, specific page title"
            maxLength={70}
          />
          <CharCounter value={value.metaTitle} warnMin={50} warnMax={60} />
        </FormField>
        <FormField label="Meta description" dirty={dirty}>
          <textarea
            value={value.metaDesc}
            onChange={(event) =>
              patch(value, onChange, { metaDesc: event.target.value })
            }
            placeholder="One or two sentences summarizing the page"
            maxLength={320}
            className="min-h-24 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
          />
          <CharCounter value={value.metaDesc} warnMin={140} warnMax={160} />
        </FormField>
        <FormField label="H1 (optional override)" dirty={dirty}>
          <Input
            value={value.h1}
            onChange={(event) => patch(value, onChange, { h1: event.target.value })}
            placeholder="Leave blank to use the page headline"
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Search preview">
        <SerpPreview
          title={value.metaTitle}
          description={value.metaDesc}
          url={previewUrl}
        />
      </SectionCard>

      <SectionCard title="Social sharing">
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Open Graph title" dirty={dirty}>
            <Input
              value={value.ogTitle}
              onChange={(event) =>
                patch(value, onChange, { ogTitle: event.target.value })
              }
              placeholder="Defaults to meta title"
            />
          </FormField>
          <FormField label="Twitter card" dirty={dirty}>
            <select
              value={value.twitterCard}
              onChange={(event) =>
                patch(value, onChange, {
                  twitterCard: event.target.value as SeoEditorValue["twitterCard"],
                })
              }
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
            >
              <option value="summary_large_image">Large image</option>
              <option value="summary">Summary</option>
            </select>
          </FormField>
        </div>
        <FormField label="Open Graph description" dirty={dirty}>
          <textarea
            value={value.ogDescription}
            onChange={(event) =>
              patch(value, onChange, { ogDescription: event.target.value })
            }
            placeholder="Defaults to meta description"
            className="min-h-20 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
          />
        </FormField>
        <FormField label="Open Graph image" dirty={dirty}>
          <Input
            value={value.ogImage}
            onChange={(event) =>
              patch(value, onChange, { ogImage: event.target.value })
            }
            placeholder="/og.png or https://…"
          />
          <p className="text-xs text-[var(--color-muted)]">
            Recommended size: 1200×630 pixels.
          </p>
        </FormField>
      </SectionCard>

      <div className="admin-card rounded-2xl p-5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          <div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)]">
              Advanced indexing
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Canonical URL, robots, and sitemap options.
            </p>
          </div>
          {advancedOpen ? (
            <ChevronDown className="h-4 w-4 text-[var(--color-muted)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--color-muted)]" />
          )}
        </button>

        {advancedOpen ? (
          <div className="mt-4 space-y-3">
            <FormField label="Canonical URL or path" dirty={dirty}>
              <Input
                value={value.canonical}
                onChange={(event) =>
                  patch(value, onChange, { canonical: event.target.value })
                }
                placeholder="/about or https://…"
              />
            </FormField>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                <input
                  type="checkbox"
                  checked={value.indexed}
                  onChange={(event) =>
                    patch(value, onChange, { indexed: event.target.checked })
                  }
                />
                Allow search engines to index
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                <input
                  type="checkbox"
                  checked={value.robotsFollow}
                  onChange={(event) =>
                    patch(value, onChange, { robotsFollow: event.target.checked })
                  }
                />
                Allow following links
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                <input
                  type="checkbox"
                  checked={value.sitemapInclude}
                  onChange={(event) =>
                    patch(value, onChange, {
                      sitemapInclude: event.target.checked,
                    })
                  }
                />
                Include in sitemap
              </label>
              <FormField label="Sitemap priority" dirty={dirty}>
                <select
                  value={value.sitemapPriority}
                  onChange={(event) =>
                    patch(value, onChange, {
                      sitemapPriority: Number(event.target.value),
                    })
                  }
                  className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
                >
                  {SITEMAP_PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.toFixed(1)}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Schema type (optional)" dirty={dirty}>
              <Input
                value={value.schemaType}
                onChange={(event) =>
                  patch(value, onChange, { schemaType: event.target.value })
                }
                placeholder="WebPage, Service, FAQPage…"
              />
            </FormField>
            <FormField label="Custom JSON-LD (optional)" dirty={dirty}>
              <textarea
                value={value.customJsonLd}
                onChange={(event) =>
                  patch(value, onChange, { customJsonLd: event.target.value })
                }
                placeholder='{"@context":"https://schema.org",...}'
                className="min-h-28 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 font-mono text-xs text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
              />
            </FormField>
          </div>
        ) : null}
      </div>
    </div>
  );
}
