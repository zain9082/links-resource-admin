"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { HeaderFieldsEditor } from "@/components/admin/pages/shared/HeaderFieldsEditor";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { StringListEditor } from "@/components/admin/pages/shared/StringListEditor";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type ContactPage = {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    badges: string[];
  };
  form: {
    title: string;
    subtitle: string;
    serviceOptions: string[];
    fields: {
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      websitePlaceholder: string;
      messagePlaceholder: string;
      submitLabel: string;
    };
  };
  sidebar: {
    email: { title: string; addresses: string[] };
    phone: { title: string; number: string; note: string };
    responseTime: { title: string; body: string };
    expertiseTitle: string;
  };
  expertise: string[];
  locations: {
    eyebrow: string;
    title: string;
    subtitle: string;
    headOfficeLabel: string;
    coverageLabel: string;
    coverageText: string;
  };
  cta: { title: string; body: string; button: string; href: string };
};

const defaults: ContactPage = {
  hero: {
    eyebrow: "",
    titleLine1: "",
    titleHighlight: "",
    subtitle: "",
    badges: [],
  },
  form: {
    title: "",
    subtitle: "",
    serviceOptions: [],
    fields: {
      namePlaceholder: "",
      emailPlaceholder: "",
      phonePlaceholder: "",
      websitePlaceholder: "",
      messagePlaceholder: "",
      submitLabel: "Submit",
    },
  },
  sidebar: {
    email: { title: "Email us", addresses: [] },
    phone: { title: "Call us", number: "", note: "" },
    responseTime: { title: "Response time", body: "" },
    expertiseTitle: "Our expertise",
  },
  expertise: [],
  locations: {
    eyebrow: "",
    title: "",
    subtitle: "",
    headOfficeLabel: "",
    coverageLabel: "",
    coverageText: "",
  },
  cta: { title: "", body: "", button: "", href: "/contact" },
};

export function ContactPageEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<ContactPage> & {
    header?: { eyebrow?: string; title?: string; subtitle?: string };
  };

  const heroFromLegacy =
    raw.header && !raw.hero
      ? {
          eyebrow: raw.header.eyebrow ?? "",
          titleLine1: raw.header.title ?? "",
          titleHighlight: "",
          subtitle: raw.header.subtitle ?? "",
          badges: [],
        }
      : null;

  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    ...defaults,
    ...raw,
    hero: { ...defaults.hero, ...(heroFromLegacy ?? raw.hero ?? {}) },
    form: {
      ...defaults.form,
      ...(raw.form ?? {}),
      fields: { ...defaults.form.fields, ...(raw.form?.fields ?? {}) },
    },
    sidebar: {
      ...defaults.sidebar,
      ...(raw.sidebar ?? {}),
      email: {
        ...defaults.sidebar.email,
        ...(raw.sidebar?.email ?? {}),
        addresses: raw.sidebar?.email?.addresses ?? defaults.sidebar.email.addresses,
      },
      phone: { ...defaults.sidebar.phone, ...(raw.sidebar?.phone ?? {}) },
      responseTime: {
        ...defaults.sidebar.responseTime,
        ...(raw.sidebar?.responseTime ?? {}),
      },
    },
    locations: { ...defaults.locations, ...(raw.locations ?? {}) },
    cta: { ...defaults.cta, ...(raw.cta ?? {}) },
    expertise: raw.expertise ?? [],
  });

  function patch(partial: Partial<ContactPage>) {
    markDirty();
    setData((prev) => ({ ...prev, ...partial }));
  }

  function patchHero(partial: Partial<ContactPage["hero"]>) {
    markDirty();
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...partial } }));
  }

  function patchForm(partial: Partial<ContactPage["form"]>) {
    markDirty();
    setData((prev) => ({ ...prev, form: { ...prev.form, ...partial } }));
  }

  function patchFormFields(partial: Partial<ContactPage["form"]["fields"]>) {
    markDirty();
    setData((prev) => ({
      ...prev,
      form: { ...prev.form, fields: { ...prev.form.fields, ...partial } },
    }));
  }

  function patchSidebar(partial: Partial<ContactPage["sidebar"]>) {
    markDirty();
    setData((prev) => ({ ...prev, sidebar: { ...prev.sidebar, ...partial } }));
  }

  function patchLocations(partial: Partial<ContactPage["locations"]>) {
    markDirty();
    setData((prev) => ({ ...prev, locations: { ...prev.locations, ...partial } }));
  }

  function patchCta(partial: Partial<ContactPage["cta"]>) {
    markDirty();
    setData((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }));
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Hero section" description="Top banner heading and trust badges.">
        <FormField label="Eyebrow" dirty={dirty}>
          <Input
            value={data.hero.eyebrow}
            onChange={(e) => patchHero({ eyebrow: e.target.value })}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title (before highlight)" dirty={dirty}>
            <Input
              value={data.hero.titleLine1}
              onChange={(e) => patchHero({ titleLine1: e.target.value })}
            />
          </FormField>
          <FormField label="Title highlight" dirty={dirty}>
            <Input
              value={data.hero.titleHighlight}
              onChange={(e) => patchHero({ titleHighlight: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Subtitle" dirty={dirty}>
          <RichTextarea
            value={data.hero.subtitle}
            onChange={(value) => patchHero({ subtitle: value })}
          />
        </FormField>
        <StringListEditor
          label="Trust badges"
          items={data.hero.badges}
          dirty={dirty}
          onChange={(badges) => patchHero({ badges })}
        />
      </SectionCard>

      <SectionCard title="Contact form" description="Form heading, fields, and service dropdown options.">
        <FormField label="Form title" dirty={dirty}>
          <Input value={data.form.title} onChange={(e) => patchForm({ title: e.target.value })} />
        </FormField>
        <FormField label="Form subtitle" dirty={dirty}>
          <RichTextarea
            value={data.form.subtitle}
            onChange={(value) => patchForm({ subtitle: value })}
          />
        </FormField>
        <StringListEditor
          label="Service dropdown options"
          items={data.form.serviceOptions}
          dirty={dirty}
          onChange={(serviceOptions) => patchForm({ serviceOptions })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Name placeholder" dirty={dirty}>
            <Input
              value={data.form.fields.namePlaceholder}
              onChange={(e) => patchFormFields({ namePlaceholder: e.target.value })}
            />
          </FormField>
          <FormField label="Email placeholder" dirty={dirty}>
            <Input
              value={data.form.fields.emailPlaceholder}
              onChange={(e) => patchFormFields({ emailPlaceholder: e.target.value })}
            />
          </FormField>
          <FormField label="Phone placeholder" dirty={dirty}>
            <Input
              value={data.form.fields.phonePlaceholder}
              onChange={(e) => patchFormFields({ phonePlaceholder: e.target.value })}
            />
          </FormField>
          <FormField label="Website placeholder" dirty={dirty}>
            <Input
              value={data.form.fields.websitePlaceholder}
              onChange={(e) => patchFormFields({ websitePlaceholder: e.target.value })}
            />
          </FormField>
          <FormField label="Message placeholder" dirty={dirty}>
            <Input
              value={data.form.fields.messagePlaceholder}
              onChange={(e) => patchFormFields({ messagePlaceholder: e.target.value })}
            />
          </FormField>
          <FormField label="Submit button" dirty={dirty}>
            <Input
              value={data.form.fields.submitLabel}
              onChange={(e) => patchFormFields({ submitLabel: e.target.value })}
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Sidebar info" description="Email, phone, and response time cards beside the form.">
        <FormField label="Email card title" dirty={dirty}>
          <Input
            value={data.sidebar.email.title}
            onChange={(e) =>
              patchSidebar({ email: { ...data.sidebar.email, title: e.target.value } })
            }
          />
        </FormField>
        <StringListEditor
          label="Email addresses"
          items={data.sidebar.email.addresses}
          dirty={dirty}
          onChange={(addresses) =>
            patchSidebar({ email: { ...data.sidebar.email, addresses } })
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Phone card title" dirty={dirty}>
            <Input
              value={data.sidebar.phone.title}
              onChange={(e) =>
                patchSidebar({ phone: { ...data.sidebar.phone, title: e.target.value } })
              }
            />
          </FormField>
          <FormField label="Phone number" dirty={dirty}>
            <Input
              value={data.sidebar.phone.number}
              onChange={(e) =>
                patchSidebar({ phone: { ...data.sidebar.phone, number: e.target.value } })
              }
            />
          </FormField>
        </div>
        <FormField label="Phone note" dirty={dirty}>
          <Input
            value={data.sidebar.phone.note}
            onChange={(e) =>
              patchSidebar({ phone: { ...data.sidebar.phone, note: e.target.value } })
            }
          />
        </FormField>
        <FormField label="Response time title" dirty={dirty}>
          <Input
            value={data.sidebar.responseTime.title}
            onChange={(e) =>
              patchSidebar({
                responseTime: { ...data.sidebar.responseTime, title: e.target.value },
              })
            }
          />
        </FormField>
        <FormField label="Response time body" dirty={dirty}>
          <RichTextarea
            value={data.sidebar.responseTime.body}
            onChange={(value) =>
              patchSidebar({
                responseTime: { ...data.sidebar.responseTime, body: value },
              })
            }
          />
        </FormField>
        <FormField label="Expertise section title" dirty={dirty}>
          <Input
            value={data.sidebar.expertiseTitle}
            onChange={(e) => patchSidebar({ expertiseTitle: e.target.value })}
          />
        </FormField>
        <StringListEditor
          label="Expertise items"
          items={data.expertise}
          dirty={dirty}
          onChange={(expertise) => patch({ expertise })}
        />
      </SectionCard>

      <SectionCard title="Locations section" description="Office and coverage block below the form.">
        <HeaderFieldsEditor
          header={{
            eyebrow: data.locations.eyebrow,
            title: data.locations.title,
            subtitle: data.locations.subtitle,
          }}
          dirty={dirty}
          onChange={(header) =>
            patchLocations({
              eyebrow: header.eyebrow,
              title: header.title,
              subtitle: header.subtitle,
            })
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Head office label" dirty={dirty}>
            <Input
              value={data.locations.headOfficeLabel}
              onChange={(e) => patchLocations({ headOfficeLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Coverage label" dirty={dirty}>
            <Input
              value={data.locations.coverageLabel}
              onChange={(e) => patchLocations({ coverageLabel: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="Coverage text" dirty={dirty}>
          <RichTextarea
            value={data.locations.coverageText}
            onChange={(value) => patchLocations({ coverageText: value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Bottom CTA" description="Final call-to-action at the bottom of the page.">
        <FormField label="Title" dirty={dirty}>
          <Input value={data.cta.title} onChange={(e) => patchCta({ title: e.target.value })} />
        </FormField>
        <FormField label="Body" dirty={dirty}>
          <RichTextarea
            value={data.cta.body}
            onChange={(value) => patchCta({ body: value })}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Button text" dirty={dirty}>
            <Input
              value={data.cta.button}
              onChange={(e) => patchCta({ button: e.target.value })}
            />
          </FormField>
          <FormField label="Button link" dirty={dirty}>
            <Input
              value={data.cta.href}
              onChange={(e) => patchCta({ href: e.target.value })}
            />
          </FormField>
        </div>
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
