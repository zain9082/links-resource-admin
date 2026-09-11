"use client";

import { useState } from "react";
import { upsertSeoSetting } from "@/app/actions/seo";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { PackagesEditor } from "@/components/admin/services/PackagesEditor";
import { HeaderFieldsEditor } from "@/components/admin/pages/shared/HeaderFieldsEditor";
import { FaqListEditor } from "@/components/admin/pages/shared/FaqListEditor";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { StringListEditor } from "@/components/admin/pages/shared/StringListEditor";
import { TitleBodyItemsEditor } from "@/components/admin/pages/shared/TitleBodyItemsEditor";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";
import { SeoEditorPanel } from "@/components/admin/seo/SeoEditorPanel";
import type { ServiceLandingContent } from "@/lib/service-landing-defaults";
import {
  seoEditorToInput,
  seoRowToEditorValue,
  type SeoEditorValue,
} from "@/lib/seo-admin";

const defaults: ServiceLandingContent = {
  header: { eyebrow: "", title: "", subtitle: "" },
  trustPoints: [],
  heroBullets: [],
  heroStats: [],
  features: [],
  processSteps: [],
  marquee: [],
  cta: { title: "", body: "", button: "", href: "/contact" },
  packages: [],
  faqs: [],
};

export function ServiceLandingPageEditor({
  slug,
  label,
  initialData,
  websitePath,
  initialSeo,
  siteUrl,
}: {
  slug: string;
  label: string;
  initialData: unknown;
  websitePath: string;
  initialSeo?: Parameters<typeof seoRowToEditorValue>[0];
  siteUrl?: string;
}) {
  const raw = (initialData ?? {}) as Partial<ServiceLandingContent>;
  const [seo, setSeo] = useState<SeoEditorValue>(() =>
    seoRowToEditorValue(initialSeo)
  );
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(
    slug,
    label,
    {
      header: { ...defaults.header, ...raw.header },
      trustPoints: raw.trustPoints ?? [],
      heroBullets: raw.heroBullets ?? [],
      heroStats: raw.heroStats ?? [],
      features: raw.features ?? [],
      processSteps: raw.processSteps ?? [],
      marquee: raw.marquee ?? [],
      cta: { ...defaults.cta, ...raw.cta },
      packages: raw.packages ?? [],
      faqs: raw.faqs ?? [],
    },
    {
      saveExtra: async () => {
        const result = await upsertSeoSetting(websitePath, seoEditorToInput(seo));
        if ("error" in result) return { error: result.error ?? "Failed to save SEO" };
        return { success: true as const };
      },
    }
  );

  function patch(partial: Partial<ServiceLandingContent>) {
    markDirty();
    setData((prev) => ({ ...prev, ...partial }));
  }

  function patchSeo(value: SeoEditorValue) {
    markDirty();
    setSeo(value);
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Page header">
        <HeaderFieldsEditor
          header={data.header}
          dirty={dirty}
          onChange={(header) => patch({ header })}
        />
      </SectionCard>

      <SectionCard
        title="Hero bullets"
        description="Checklist items shown under the hero headline."
      >
        <StringListEditor
          label="Hero bullets"
          items={data.heroBullets ?? []}
          dirty={dirty}
          onChange={(heroBullets) => patch({ heroBullets })}
        />
      </SectionCard>

      <SectionCard
        title="Hero stats"
        description="Short value/label pairs shown in the hero (e.g. Manual / Outreach)."
      >
        <div className="space-y-3">
          {(data.heroStats ?? []).map((stat, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <FormField label={`Value ${index + 1}`} dirty={dirty}>
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const heroStats = [...(data.heroStats ?? [])];
                    heroStats[index] = { ...heroStats[index], value: e.target.value };
                    patch({ heroStats });
                  }}
                />
              </FormField>
              <FormField label={`Label ${index + 1}`} dirty={dirty}>
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const heroStats = [...(data.heroStats ?? [])];
                    heroStats[index] = { ...heroStats[index], label: e.target.value };
                    patch({ heroStats });
                  }}
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-[var(--color-primary)] hover:underline"
            onClick={() =>
              patch({ heroStats: [...(data.heroStats ?? []), { value: "", label: "" }] })
            }
          >
            + Add stat
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Trust points"
        description="Optional bullet points highlighting your strengths."
      >
        <StringListEditor
          label="Trust points"
          items={data.trustPoints ?? []}
          dirty={dirty}
          onChange={(trustPoints) => patch({ trustPoints })}
        />
      </SectionCard>

      <SectionCard
        title="Marquee items"
        description="Scrolling trust strip. Leave empty to use homepage marquee."
      >
        <StringListEditor
          label="Marquee"
          items={data.marquee ?? []}
          dirty={dirty}
          onChange={(marquee) => patch({ marquee })}
        />
      </SectionCard>

      <SectionCard
        title="Features / why choose"
        description="Feature cards on this service page."
      >
        <TitleBodyItemsEditor
          label="Features"
          items={(data.features ?? []).map((f) => ({
            title: f.title,
            body: f.description,
          }))}
          dirty={dirty}
          onChange={(items) =>
            patch({
              features: items.map((item) => ({
                title: item.title,
                description: item.body,
              })),
            })
          }
        />
      </SectionCard>

      <SectionCard
        title="Process steps"
        description="How-it-works steps for this service."
      >
        <TitleBodyItemsEditor
          label="Process steps"
          items={(data.processSteps ?? []).map((step) => ({
            title: step.title,
            body: step.description,
          }))}
          dirty={dirty}
          onChange={(items) =>
            patch({
              processSteps: items.map((item, i) => ({
                title: item.title,
                description: item.body,
                index: String(i + 1).padStart(2, "0"),
              })),
            })
          }
        />
      </SectionCard>

      <SectionCard
        title="Pricing packages"
        description="Packages shown in the pricing section. Leave empty to use built-in defaults."
      >
        <PackagesEditor
          value={(data.packages ?? []).map((pkg, index) => ({
            id: pkg.id ?? `pkg-${index}`,
            name: pkg.name,
            price: pkg.price,
            period: pkg.period,
            features: pkg.features,
          }))}
          onChange={(packages) =>
            patch({
              packages: packages.map(({ id, name, price, period, features, isPopular }) => ({
                id,
                name,
                price,
                period,
                features,
                isPopular,
              })),
            })
          }
        />
      </SectionCard>

      <SectionCard
        title="Page FAQs"
        description="FAQs for this service page. Leave empty to use built-in defaults."
      >
        <FaqListEditor
          items={data.faqs ?? []}
          dirty={dirty}
          onChange={(faqs) => patch({ faqs })}
        />
      </SectionCard>

      <SectionCard title="Bottom CTA" description="Call-to-action banner at the bottom of the page.">
        <FormField label="Title" dirty={dirty}>
          <Input
            value={data.cta.title}
            onChange={(e) => patch({ cta: { ...data.cta, title: e.target.value } })}
          />
        </FormField>
        <FormField label="Body" dirty={dirty}>
          <RichTextarea
            value={data.cta.body}
            onChange={(value) => patch({ cta: { ...data.cta, body: value } })}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Button text" dirty={dirty}>
            <Input
              value={data.cta.button}
              onChange={(e) => patch({ cta: { ...data.cta, button: e.target.value } })}
            />
          </FormField>
          <FormField label="Button link" dirty={dirty}>
            <Input
              value={data.cta.href}
              onChange={(e) => patch({ cta: { ...data.cta, href: e.target.value } })}
            />
          </FormField>
        </div>
      </SectionCard>

      <SeoEditorPanel
        value={seo}
        onChange={patchSeo}
        routePath={websitePath}
        siteUrl={siteUrl}
        dirty={dirty}
      />

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
