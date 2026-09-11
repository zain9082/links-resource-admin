"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { upsertGlobalSeoSettings } from "@/app/actions/seo";
import { FormField } from "@/components/admin/ui/FormField";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GlobalSeoSettingsInput } from "@/lib/schemas";
import { DEFAULT_ROBOTS_TXT } from "@/lib/seo-admin";

type GlobalSeoForm = {
  siteUrl: string;
  siteName: string;
  titleTemplate: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  favicon: string;
  appleTouchIcon: string;
  defaultLocale: string;
  gscVerification: string;
  ga4Id: string;
  gtmId: string;
  robotsTxt: string;
  organizationSchemaJson: string;
};

export function GlobalSeoClient({ initial }: { initial: GlobalSeoForm }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);

  function update<K extends keyof GlobalSeoForm>(key: K, value: GlobalSeoForm[K]) {
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      const payload: GlobalSeoSettingsInput = { ...form };
      const result = await upsertGlobalSeoSettings(payload);
      if ("error" in result) {
        toast.error(`Failed to save: ${result.error}`);
        return;
      }
      setDirty(false);
      toast.success("Global SEO settings saved");
    });
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Site identity"
        description="Defaults used across the public website when a page does not override them."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Site URL" dirty={dirty}>
            <Input
              value={form.siteUrl}
              onChange={(event) => update("siteUrl", event.target.value)}
              placeholder="https://linksresource.com"
            />
          </FormField>
          <FormField label="Site name" dirty={dirty}>
            <Input
              value={form.siteName}
              onChange={(event) => update("siteName", event.target.value)}
            />
          </FormField>
          <FormField label="Title template" dirty={dirty}>
            <Input
              value={form.titleTemplate}
              onChange={(event) => update("titleTemplate", event.target.value)}
              placeholder="%page_title% | %site_name%"
            />
          </FormField>
          <FormField label="Default locale" dirty={dirty}>
            <Input
              value={form.defaultLocale}
              onChange={(event) => update("defaultLocale", event.target.value)}
              placeholder="en_GB"
            />
          </FormField>
        </div>
        <FormField label="Default meta description" dirty={dirty}>
          <textarea
            value={form.defaultMetaDescription}
            onChange={(event) =>
              update("defaultMetaDescription", event.target.value)
            }
            className="min-h-24 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Default images & icons"
        description="Open Graph image should be 1200×630 for best social previews."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Default OG image" dirty={dirty}>
            <Input
              value={form.defaultOgImage}
              onChange={(event) => update("defaultOgImage", event.target.value)}
              placeholder="/og.png"
            />
          </FormField>
          <FormField label="Favicon" dirty={dirty}>
            <Input
              value={form.favicon}
              onChange={(event) => update("favicon", event.target.value)}
              placeholder="/favicon.ico"
            />
          </FormField>
          <FormField label="Apple touch icon" dirty={dirty}>
            <Input
              value={form.appleTouchIcon}
              onChange={(event) => update("appleTouchIcon", event.target.value)}
              placeholder="/apple-touch-icon.png"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Verification & analytics"
        description="Paste the Google Search Console verification token only — meta tags are stripped automatically."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Google Search Console token" dirty={dirty}>
            <Input
              value={form.gscVerification}
              onChange={(event) => update("gscVerification", event.target.value)}
              placeholder="verification token"
            />
          </FormField>
          <FormField label="GA4 measurement ID" dirty={dirty}>
            <Input
              value={form.ga4Id}
              onChange={(event) => update("ga4Id", event.target.value)}
              placeholder="G-XXXXXXXX"
            />
          </FormField>
          <FormField label="Google Tag Manager ID" dirty={dirty}>
            <Input
              value={form.gtmId}
              onChange={(event) => update("gtmId", event.target.value)}
              placeholder="GTM-XXXXXXX"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Organization schema (optional)"
        description="Valid JSON-LD for Organization. Leave blank to skip."
      >
        <textarea
          value={form.organizationSchemaJson}
          onChange={(event) =>
            update("organizationSchemaJson", event.target.value)
          }
          className="min-h-32 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 font-mono text-xs text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
          placeholder='{"@context":"https://schema.org","@type":"Organization",...}'
        />
      </SectionCard>

      <SectionCard
        title="Robots.txt default"
        description="Edit the full robots file under SEO → Robots.txt. This field stays in sync."
      >
        <textarea
          value={form.robotsTxt || DEFAULT_ROBOTS_TXT}
          onChange={(event) => update("robotsTxt", event.target.value)}
          className="min-h-40 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 font-mono text-xs text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
        />
      </SectionCard>

      <div className="sticky bottom-4 z-10 flex justify-end pt-2">
        <Button onClick={save} disabled={pending} className="shadow-lg">
          {pending ? "Saving…" : dirty ? "Save Changes" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
