"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { upsertGlobalSeoSettings } from "@/app/actions/seo";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { DEFAULT_ROBOTS_TXT } from "@/lib/seo-admin";

type RobotsFormSeed = {
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

function hasBlanketDisallow(robotsTxt: string) {
  return /(^|\n)\s*Disallow:\s*\/\s*(\n|$)/i.test(robotsTxt);
}

export function RobotsAdminClient({
  initial,
}: {
  initial: RobotsFormSeed;
}) {
  const [pending, startTransition] = useTransition();
  const [robotsTxt, setRobotsTxt] = useState(
    initial.robotsTxt || DEFAULT_ROBOTS_TXT
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const sitemapLine = `Sitemap: ${initial.siteUrl.replace(/\/+$/, "")}/sitemap.xml`;

  function saveConfirmed() {
    startTransition(async () => {
      const result = await upsertGlobalSeoSettings({
        ...initial,
        robotsTxt,
      });
      setConfirmOpen(false);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Robots.txt saved");
    });
  }

  function save() {
    if (hasBlanketDisallow(robotsTxt)) {
      setConfirmOpen(true);
      return;
    }
    saveConfirmed();
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Robots.txt"
        description="This file tells crawlers what they may access. Include a Sitemap line so search engines can find your sitemap."
      >
        <p className="mono text-xs text-[var(--color-muted)]">
          Suggested sitemap line: {sitemapLine}
        </p>
        <textarea
          value={robotsTxt}
          onChange={(event) => setRobotsTxt(event.target.value)}
          className="min-h-72 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
        />
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save robots.txt"}
        </Button>
      </SectionCard>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Block the whole site?"
        description="This robots.txt contains “Disallow: /”, which tells crawlers not to index any pages. Only continue if that is intentional."
        confirmLabel="Save anyway"
        onConfirm={saveConfirmed}
        loading={pending}
      />
    </div>
  );
}
