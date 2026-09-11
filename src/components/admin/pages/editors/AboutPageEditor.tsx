"use client";

import { useState } from "react";
import { upsertSeoSetting } from "@/app/actions/seo";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { EditorTabs, Tabs } from "@/components/admin/pages/shared/EditorTabs";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { StringListEditor } from "@/components/admin/pages/shared/StringListEditor";
import { TitleBodyItemsEditor } from "@/components/admin/pages/shared/TitleBodyItemsEditor";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";
import { SeoEditorPanel } from "@/components/admin/seo/SeoEditorPanel";
import {
  seoEditorToInput,
  seoRowToEditorValue,
  type SeoEditorValue,
} from "@/lib/seo-admin";

type Stat = { value: string; label: string };
type TitleBody = { title: string; body: string };

type AboutPage = {
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    stats: Stat[];
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: { text: string; attribution: string };
  };
  values: {
    eyebrow: string;
    title: string;
    intro: string;
    items: TitleBody[];
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  team: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: string[];
  };
  cta: {
    title: string;
    body: string;
    button: string;
    href: string;
  };
};

const defaults: AboutPage = {
  hero: {
    title: "",
    subtitle: "",
    primaryCta: "Get Started",
    primaryHref: "/contact",
    secondaryCta: "Meet the team",
    secondaryHref: "#team",
    stats: [],
  },
  story: {
    eyebrow: "",
    title: "",
    paragraphs: [""],
    quote: { text: "", attribution: "" },
  },
  values: { eyebrow: "", title: "", intro: "", items: [] },
  process: { eyebrow: "", title: "", intro: "" },
  team: { eyebrow: "", title: "", intro: "" },
  services: { eyebrow: "", title: "", intro: "", items: [] },
  cta: { title: "", body: "", button: "", href: "/contact" },
};

function mergeAbout(raw: Record<string, any>): AboutPage {
  // New website shape
  if (raw?.story && typeof raw.story === "object") {
    const servicesItems = Array.isArray(raw.services?.items)
      ? raw.services.items.map((item: unknown) =>
          typeof item === "string" ? item : String((item as { title?: string })?.title ?? "")
        )
      : [];
    return {
      hero: {
        ...defaults.hero,
        ...raw.hero,
        subtitle: raw.hero?.subtitle ?? raw.hero?.intro ?? "",
        primaryCta: raw.hero?.primaryCta ?? raw.hero?.cta ?? defaults.hero.primaryCta,
        stats: Array.isArray(raw.hero?.stats) ? raw.hero.stats : [],
      },
      story: {
        ...defaults.story,
        ...raw.story,
        paragraphs: raw.story?.paragraphs?.length ? raw.story.paragraphs : [""],
        quote: { ...defaults.story.quote, ...(raw.story?.quote ?? {}) },
      },
      values: {
        ...defaults.values,
        ...raw.values,
        items: raw.values?.items ?? [],
      },
      process: { ...defaults.process, ...raw.process },
      team: { ...defaults.team, ...raw.team },
      services: {
        ...defaults.services,
        ...raw.services,
        items: servicesItems,
      },
      cta: { ...defaults.cta, ...raw.cta },
    };
  }

  // Legacy portal shape → website shape
  const servicesItems = Array.isArray(raw?.services?.items)
    ? raw.services.items.map((item: unknown) =>
        typeof item === "string" ? item : String((item as { title?: string })?.title ?? "")
      )
    : [];

  return {
    hero: {
      ...defaults.hero,
      title: raw?.hero?.title ?? "",
      subtitle: raw?.hero?.intro ?? raw?.hero?.subtitle ?? "",
      primaryCta: raw?.hero?.cta ?? raw?.hero?.primaryCta ?? defaults.hero.primaryCta,
      primaryHref: raw?.hero?.primaryHref ?? defaults.hero.primaryHref,
      secondaryCta: raw?.hero?.secondaryCta ?? defaults.hero.secondaryCta,
      secondaryHref: raw?.hero?.secondaryHref ?? defaults.hero.secondaryHref,
      stats: Array.isArray(raw?.hero?.stats) ? raw.hero.stats : [],
    },
    story: {
      eyebrow: raw?.whoWeAre?.eyebrow ?? "",
      title: raw?.whoWeAre?.title ?? "",
      paragraphs: raw?.whoWeAre?.paragraphs?.length ? raw.whoWeAre.paragraphs : [""],
      quote: {
        text: raw?.mission?.body ?? "",
        attribution: raw?.mission?.title ?? "",
      },
    },
    values: {
      eyebrow: raw?.whyChoose?.eyebrow ?? "",
      title: raw?.whyChoose?.title ?? "",
      intro: raw?.whyChoose?.intro ?? "",
      items: raw?.whyChoose?.items ?? [],
    },
    process: {
      eyebrow: raw?.approach?.eyebrow ?? "",
      title: raw?.approach?.title ?? "",
      intro: raw?.approach?.intro ?? "",
    },
    team: { ...defaults.team },
    services: {
      eyebrow: raw?.services?.eyebrow ?? "",
      title: raw?.services?.title ?? "",
      intro: raw?.services?.intro ?? "",
      items: servicesItems,
    },
    cta: {
      title: raw?.cta?.title ?? "",
      body: raw?.cta?.body ?? "",
      button: raw?.cta?.button ?? "",
      href: raw?.cta?.href ?? "/contact",
    },
  };
}

export function AboutPageEditor({
  slug,
  label,
  initialData,
  websitePath = "/about",
  initialSeo,
  siteUrl,
}: {
  slug: string;
  label: string;
  initialData: unknown;
  websitePath?: string;
  initialSeo?: Parameters<typeof seoRowToEditorValue>[0];
  siteUrl?: string;
}) {
  const [seo, setSeo] = useState<SeoEditorValue>(() =>
    seoRowToEditorValue(initialSeo)
  );
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(
    slug,
    label,
    mergeAbout((initialData ?? {}) as Record<string, any>),
    {
      saveExtra: async () => {
        const result = await upsertSeoSetting(websitePath, seoEditorToInput(seo));
        if ("error" in result) return { error: result.error ?? "Failed to save SEO" };
        return { success: true as const };
      },
    }
  );

  function update<K extends keyof AboutPage>(key: K, value: AboutPage[K]) {
    markDirty();
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const tabs = [
    { value: "hero", label: "Hero" },
    { value: "story", label: "Story" },
    { value: "values", label: "Values" },
    { value: "process", label: "Process" },
    { value: "team", label: "Team copy" },
    { value: "services", label: "Services" },
    { value: "cta", label: "CTA" },
  ];

  return (
    <div className="space-y-4">
      <EditorTabs tabs={tabs} defaultValue="hero">
        <Tabs.Content value="hero">
          <SectionCard title="Hero section">
            <FormField label="Title" dirty={dirty}>
              <Input
                value={data.hero.title}
                onChange={(e) => update("hero", { ...data.hero, title: e.target.value })}
              />
            </FormField>
            <FormField label="Subtitle" dirty={dirty}>
              <RichTextarea
                value={data.hero.subtitle}
                onChange={(value) => update("hero", { ...data.hero, subtitle: value })}
              />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Primary CTA label" dirty={dirty}>
                <Input
                  value={data.hero.primaryCta}
                  onChange={(e) =>
                    update("hero", { ...data.hero, primaryCta: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Primary CTA href" dirty={dirty}>
                <Input
                  value={data.hero.primaryHref}
                  onChange={(e) =>
                    update("hero", { ...data.hero, primaryHref: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Secondary CTA label" dirty={dirty}>
                <Input
                  value={data.hero.secondaryCta}
                  onChange={(e) =>
                    update("hero", { ...data.hero, secondaryCta: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Secondary CTA href" dirty={dirty}>
                <Input
                  value={data.hero.secondaryHref}
                  onChange={(e) =>
                    update("hero", { ...data.hero, secondaryHref: e.target.value })
                  }
                />
              </FormField>
            </div>
            <TitleBodyItemsEditor
              label="Stats (title = value, body = label)"
              items={data.hero.stats.map((s) => ({ title: s.value, body: s.label }))}
              dirty={dirty}
              onChange={(items) =>
                update("hero", {
                  ...data.hero,
                  stats: items.map((item) => ({ value: item.title, label: item.body })),
                })
              }
            />
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="story">
          <SectionCard title="Our story">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Eyebrow" dirty={dirty}>
                <Input
                  value={data.story.eyebrow}
                  onChange={(e) => update("story", { ...data.story, eyebrow: e.target.value })}
                />
              </FormField>
              <FormField label="Title" dirty={dirty}>
                <Input
                  value={data.story.title}
                  onChange={(e) => update("story", { ...data.story, title: e.target.value })}
                />
              </FormField>
            </div>
            <StringListEditor
              label="Paragraphs"
              items={data.story.paragraphs}
              dirty={dirty}
              onChange={(paragraphs) => update("story", { ...data.story, paragraphs })}
            />
            <FormField label="Quote text" dirty={dirty}>
              <RichTextarea
                value={data.story.quote.text}
                onChange={(value) =>
                  update("story", { ...data.story, quote: { ...data.story.quote, text: value } })
                }
              />
            </FormField>
            <FormField label="Quote attribution" dirty={dirty}>
              <Input
                value={data.story.quote.attribution}
                onChange={(e) =>
                  update("story", {
                    ...data.story,
                    quote: { ...data.story.quote, attribution: e.target.value },
                  })
                }
              />
            </FormField>
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="values">
          <SectionCard title="Values">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Eyebrow" dirty={dirty}>
                <Input
                  value={data.values.eyebrow}
                  onChange={(e) => update("values", { ...data.values, eyebrow: e.target.value })}
                />
              </FormField>
              <FormField label="Title" dirty={dirty}>
                <Input
                  value={data.values.title}
                  onChange={(e) => update("values", { ...data.values, title: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Intro" dirty={dirty}>
              <RichTextarea
                value={data.values.intro}
                onChange={(value) => update("values", { ...data.values, intro: value })}
              />
            </FormField>
            <TitleBodyItemsEditor
              label="Value items"
              items={data.values.items}
              dirty={dirty}
              onChange={(items) => update("values", { ...data.values, items })}
            />
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="process">
          <SectionCard title="Process copy">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Eyebrow" dirty={dirty}>
                <Input
                  value={data.process.eyebrow}
                  onChange={(e) =>
                    update("process", { ...data.process, eyebrow: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Title" dirty={dirty}>
                <Input
                  value={data.process.title}
                  onChange={(e) => update("process", { ...data.process, title: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Intro" dirty={dirty}>
              <RichTextarea
                value={data.process.intro}
                onChange={(value) => update("process", { ...data.process, intro: value })}
              />
            </FormField>
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="team">
          <SectionCard title="Team section copy">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Eyebrow" dirty={dirty}>
                <Input
                  value={data.team.eyebrow}
                  onChange={(e) => update("team", { ...data.team, eyebrow: e.target.value })}
                />
              </FormField>
              <FormField label="Title" dirty={dirty}>
                <Input
                  value={data.team.title}
                  onChange={(e) => update("team", { ...data.team, title: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Intro" dirty={dirty}>
              <RichTextarea
                value={data.team.intro}
                onChange={(value) => update("team", { ...data.team, intro: value })}
              />
            </FormField>
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="services">
          <SectionCard title="Services checklist">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Eyebrow" dirty={dirty}>
                <Input
                  value={data.services.eyebrow}
                  onChange={(e) =>
                    update("services", { ...data.services, eyebrow: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Title" dirty={dirty}>
                <Input
                  value={data.services.title}
                  onChange={(e) =>
                    update("services", { ...data.services, title: e.target.value })
                  }
                />
              </FormField>
            </div>
            <FormField label="Intro" dirty={dirty}>
              <RichTextarea
                value={data.services.intro}
                onChange={(value) => update("services", { ...data.services, intro: value })}
              />
            </FormField>
            <StringListEditor
              label="Service items"
              items={data.services.items}
              dirty={dirty}
              onChange={(items) => update("services", { ...data.services, items })}
            />
          </SectionCard>
        </Tabs.Content>

        <Tabs.Content value="cta">
          <SectionCard title="Bottom call-to-action">
            <FormField label="Title" dirty={dirty}>
              <Input
                value={data.cta.title}
                onChange={(e) => update("cta", { ...data.cta, title: e.target.value })}
              />
            </FormField>
            <FormField label="Body" dirty={dirty}>
              <RichTextarea
                value={data.cta.body}
                onChange={(value) => update("cta", { ...data.cta, body: value })}
              />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Button text" dirty={dirty}>
                <Input
                  value={data.cta.button}
                  onChange={(e) => update("cta", { ...data.cta, button: e.target.value })}
                />
              </FormField>
              <FormField label="Button href" dirty={dirty}>
                <Input
                  value={data.cta.href}
                  onChange={(e) => update("cta", { ...data.cta, href: e.target.value })}
                />
              </FormField>
            </div>
          </SectionCard>
        </Tabs.Content>
      </EditorTabs>

      <SeoEditorPanel
        value={seo}
        onChange={(value) => {
          markDirty();
          setSeo(value);
        }}
        routePath={websitePath}
        siteUrl={siteUrl}
        dirty={dirty}
      />

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
