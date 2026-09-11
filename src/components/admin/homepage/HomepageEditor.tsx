"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { HeroEditor } from "@/components/admin/homepage/HeroEditor";
import { ServicesEditor } from "@/components/admin/homepage/ServicesEditor";
import { FaqEditor } from "@/components/admin/homepage/FaqEditor";
import { Button } from "@/components/ui/button";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { updateHomepageSection } from "@/app/actions/homepage";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { adminTabTrigger } from "@/lib/admin-styles";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { FormField } from "@/components/admin/ui/FormField";
import { Input } from "@/components/ui/input";

type HomepageEditorProps = {
  sections: Record<string, unknown>;
};

function JsonSectionEditor({
  section,
  value,
}: {
  section: string;
  value: unknown;
}) {
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(JSON.stringify(value, null, 2));

  return (
    <div className="space-y-3 admin-card rounded-2xl p-5">
      <RichTextarea value={content} onChange={setContent} rows={12} maxLength={10000} />
      <Button
        onClick={() =>
          startTransition(async () => {
            try {
              const parsed = JSON.parse(content) as unknown;
              const result = await updateHomepageSection(section, parsed);
              if ("error" in result) {
                toast.error(`✗ Failed to save ${section}: ${result.error}`);
                return;
              }
              toast.success(`✓ ${section} section saved`);
            } catch {
              toast.error("Invalid JSON");
            }
          })
        }
        disabled={pending}
      >
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

function CtaEditor({ value }: { value: unknown }) {
  const [pending, startTransition] = useTransition();
  const data = (value ?? {}) as {
    headline?: string;
    subtext?: string;
    buttonLabel?: string;
    buttonHref?: string;
  };
  const [draft, setDraft] = useState({
    headline: data.headline ?? "",
    subtext: data.subtext ?? "",
    buttonLabel: data.buttonLabel ?? "",
    buttonHref: data.buttonHref ?? "",
  });

  return (
    <SectionCard title="Call to action" description="Bottom banner on the homepage.">
      <FormField label="Headline" dirty>
        <Input
          value={draft.headline}
          onChange={(event) => setDraft((prev) => ({ ...prev, headline: event.target.value }))}
        />
      </FormField>
      <FormField label="Subtext" dirty>
        <RichTextarea
          value={draft.subtext}
          onChange={(subtext) => setDraft((prev) => ({ ...prev, subtext }))}
        />
      </FormField>
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Button label" dirty>
          <Input
            value={draft.buttonLabel}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, buttonLabel: event.target.value }))
            }
          />
        </FormField>
        <FormField label="Button href" dirty>
          <Input
            value={draft.buttonHref}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, buttonHref: event.target.value }))
            }
          />
        </FormField>
      </div>
      <Button
        onClick={() =>
          startTransition(async () => {
            const result = await updateHomepageSection("cta", draft);
            if ("error" in result) {
              toast.error(`✗ Failed to save cta: ${result.error}`);
              return;
            }
            toast.success("✓ CTA section saved");
          })
        }
        disabled={pending}
      >
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </SectionCard>
  );
}

export function HomepageEditor({ sections }: HomepageEditorProps) {
  return (
    <Tabs.Root defaultValue="hero" className="space-y-4">
      <Tabs.List className="flex flex-wrap gap-2">
        {[
          "hero",
          "services",
          "how-it-works",
          "why-choose-us",
          "metrics",
          "partners",
          "faq",
          "cta",
          "marquee",
          "featured-placements",
          "about-section",
          "consultation-banner",
        ].map((tab) => (
          <Tabs.Trigger
            key={tab}
            value={tab}
            className={adminTabTrigger}
          >
            {tab.replace(/-/g, " ")}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="hero">
        <HeroEditor
          initialData={
            (sections.hero as {
              badgeText: string;
              headlineLine1: string;
              headlineLine2: string;
              headlineLine3: string[];
              subheadline: string;
              bullets?: string[];
              ctaPrimary: { label: string; href: string };
              ctaSecondary: { label: string; href: string };
              stats: Array<{ value: string; label: string }>;
            }) ?? {
              badgeText: "",
              headlineLine1: "",
              headlineLine2: "",
              headlineLine3: [],
              subheadline: "",
              bullets: [],
              ctaPrimary: { label: "", href: "" },
              ctaSecondary: { label: "", href: "" },
              stats: [],
            }
          }
        />
      </Tabs.Content>
      <Tabs.Content value="services">
        <ServicesEditor initialData={(sections.services as never[]) ?? []} />
      </Tabs.Content>
      <Tabs.Content value="how-it-works">
        <JsonSectionEditor section="how-it-works" value={sections["how-it-works"]} />
      </Tabs.Content>
      <Tabs.Content value="why-choose-us">
        <JsonSectionEditor section="why-choose-us" value={sections["why-choose-us"]} />
      </Tabs.Content>
      <Tabs.Content value="metrics">
        <JsonSectionEditor section="metrics" value={sections.metrics} />
      </Tabs.Content>
      <Tabs.Content value="partners">
        <JsonSectionEditor section="partners" value={sections.partners} />
      </Tabs.Content>
      <Tabs.Content value="faq">
        <FaqEditor initialData={(sections.faq as Array<{ q: string; a: string }>) ?? []} />
      </Tabs.Content>
      <Tabs.Content value="cta">
        <CtaEditor value={sections.cta} />
      </Tabs.Content>
      <Tabs.Content value="marquee">
        <JsonSectionEditor section="marquee" value={sections.marquee ?? []} />
      </Tabs.Content>
      <Tabs.Content value="featured-placements">
        <JsonSectionEditor section="featured-placements" value={sections["featured-placements"] ?? []} />
      </Tabs.Content>
      <Tabs.Content value="about-section">
        <JsonSectionEditor section="about-section" value={sections["about-section"]} />
      </Tabs.Content>
      <Tabs.Content value="consultation-banner">
        <JsonSectionEditor section="consultation-banner" value={sections["consultation-banner"]} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
