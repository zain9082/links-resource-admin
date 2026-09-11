"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ensureRedirectOnSlugChange,
  upsertSeoSetting,
} from "@/app/actions/seo";
import { upsertResource } from "@/app/actions/resources";
import { FormField } from "@/components/admin/ui/FormField";
import { ImageUrlInput } from "@/components/admin/ui/ImageUrlInput";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { TagMultiSelect } from "@/components/admin/ui/TagMultiSelect";
import { SeoEditorPanel } from "@/components/admin/seo/SeoEditorPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  seoEditorToInput,
  seoRowToEditorValue,
  type SeoEditorValue,
} from "@/lib/seo-admin";
import { slugify } from "@/lib/utils";

type CategoryOption = { id: string; name: string };
type TagOption = { id: string; name: string };

type ResourceFormProps = {
  categories: CategoryOption[];
  tags: TagOption[];
  siteUrl?: string;
  initialSeo?: Parameters<typeof seoRowToEditorValue>[0];
  initial?: {
    id?: string;
    name: string;
    slug: string;
    websiteUrl: string;
    shortDescription: string;
    longDescription: string;
    categoryId: string;
    tags: string[];
    pricingTier: "FREE" | "FREEMIUM" | "PAID";
    logoUrl: string;
    featured: boolean;
    status: "DRAFT" | "PUBLISHED";
  };
};

export function ResourceForm({
  categories,
  tags,
  initial,
  initialSeo,
  siteUrl,
}: ResourceFormProps) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(
    initial ?? {
      name: "",
      slug: "",
      websiteUrl: "",
      shortDescription: "",
      longDescription: "",
      categoryId: categories[0]?.id ?? "",
      tags: [] as string[],
      pricingTier: "FREEMIUM" as const,
      logoUrl: "",
      featured: false,
      status: "DRAFT" as const,
    }
  );
  const [seo, setSeo] = useState<SeoEditorValue>(() =>
    seoRowToEditorValue(initialSeo)
  );
  const originalSlug = initial?.slug?.trim() ?? "";

  const slugPreview = useMemo(
    () => (form.slug.trim() ? form.slug : slugify(form.name)),
    [form.name, form.slug]
  );
  const routePath = `/resources/${slugPreview || "resource"}`;

  function save() {
    startTransition(async () => {
      const result = await upsertResource({
        ...form,
        slug: slugPreview,
      });
      if ("error" in result) {
        toast.error(`Failed to save resource: ${result.error}`);
        return;
      }

      if (
        originalSlug &&
        slugPreview &&
        originalSlug !== slugPreview &&
        form.status === "PUBLISHED"
      ) {
        const redirectResult = await ensureRedirectOnSlugChange(
          `/resources/${originalSlug}`,
          `/resources/${slugPreview}`
        );
        if ("error" in redirectResult) {
          toast.error(`Saved, but redirect failed: ${redirectResult.error}`);
        } else if ("warning" in redirectResult && redirectResult.warning) {
          toast.message(redirectResult.warning);
        }
      }

      const seoResult = await upsertSeoSetting(
        `/resources/${slugPreview}`,
        seoEditorToInput(seo)
      );
      if ("error" in seoResult) {
        toast.error(`Resource saved, but SEO failed: ${seoResult.error}`);
        return;
      }

      toast.success("Resource saved");
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Name" dirty>
          <Input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </FormField>
        <FormField label="Slug" dirty>
          <Input
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
          />
          <p className="mono text-xs text-[var(--color-muted)]">/{slugPreview}</p>
        </FormField>
      </div>
      <FormField label="Website URL" dirty>
        <Input
          value={form.websiteUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, websiteUrl: event.target.value }))}
        />
      </FormField>
      <FormField label="Short description" dirty>
        <Input
          value={form.shortDescription}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
          }
        />
      </FormField>
      <FormField label="Long description" dirty>
        <RichTextarea
          value={form.longDescription}
          onChange={(longDescription) => setForm((prev) => ({ ...prev, longDescription }))}
          rows={6}
        />
      </FormField>
      <div className="grid gap-3 md:grid-cols-3">
        <FormField label="Category" dirty>
          <select
            value={form.categoryId}
            className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-[var(--color-bg-sidebar)] text-[var(--color-foreground)]">
                {category.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Pricing tier" dirty>
          <select
            value={form.pricingTier}
            className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                pricingTier: event.target.value as "FREE" | "FREEMIUM" | "PAID",
              }))
            }
          >
            {["FREE", "FREEMIUM", "PAID"].map((tier) => (
              <option key={tier} value={tier} className="bg-[var(--color-bg-sidebar)] text-[var(--color-foreground)]">
                {tier}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Status" dirty>
          <select
            value={form.status}
            className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as "DRAFT" | "PUBLISHED",
              }))
            }
          >
            {["DRAFT", "PUBLISHED"].map((status) => (
              <option key={status} value={status} className="bg-[var(--color-bg-sidebar)] text-[var(--color-foreground)]">
                {status}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Tags" dirty>
        <TagMultiSelect
          options={tags.map((tag) => ({ id: tag.id, label: tag.name }))}
          value={form.tags}
          onChange={(nextTags) => setForm((prev) => ({ ...prev, tags: nextTags }))}
        />
      </FormField>
      <ImageUrlInput
        value={form.logoUrl}
        onChange={(logoUrl) => setForm((prev) => ({ ...prev, logoUrl }))}
        label="Logo URL"
      />

      <SeoEditorPanel
        value={seo}
        onChange={setSeo}
        routePath={routePath}
        siteUrl={siteUrl}
        dirty
      />

      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Resource"}
      </Button>
    </div>
  );
}
