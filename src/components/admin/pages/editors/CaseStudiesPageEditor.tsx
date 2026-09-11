"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type CaseStudiesHero = {
  eyebrow: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  imageAlt: string;
};

type CaseStudiesPage = {
  hero: CaseStudiesHero;
};

const heroDefaults: CaseStudiesHero = {
  eyebrow: "",
  titleLine1: "",
  titleHighlight: "",
  subtitle: "",
  cta: "",
  ctaHref: "/contact",
  imageAlt: "",
};

export function CaseStudiesPageEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<CaseStudiesPage>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    hero: { ...heroDefaults, ...raw.hero },
  });

  function updateHero(patch: Partial<CaseStudiesHero>) {
    markDirty();
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Hero section" description="Top banner on the case studies landing page.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Eyebrow" dirty={dirty}>
            <Input
              value={data.hero.eyebrow}
              onChange={(e) => updateHero({ eyebrow: e.target.value })}
            />
          </FormField>
          <FormField label="Image alt text" dirty={dirty}>
            <Input
              value={data.hero.imageAlt}
              onChange={(e) => updateHero({ imageAlt: e.target.value })}
            />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title line 1" dirty={dirty}>
            <Input
              value={data.hero.titleLine1}
              onChange={(e) => updateHero({ titleLine1: e.target.value })}
            />
          </FormField>
          <FormField label="Title highlight" dirty={dirty}>
            <Input
              value={data.hero.titleHighlight}
              onChange={(e) => updateHero({ titleHighlight: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Subtitle" dirty={dirty}>
          <RichTextarea
            value={data.hero.subtitle}
            onChange={(value) => updateHero({ subtitle: value })}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="CTA button text" dirty={dirty}>
            <Input value={data.hero.cta} onChange={(e) => updateHero({ cta: e.target.value })} />
          </FormField>
          <FormField label="CTA link" dirty={dirty}>
            <Input
              value={data.hero.ctaHref}
              onChange={(e) => updateHero({ ctaHref: e.target.value })}
              placeholder="/contact"
            />
          </FormField>
        </div>
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
