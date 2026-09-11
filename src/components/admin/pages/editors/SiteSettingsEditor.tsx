"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type SiteSettings = {
  name: string;
  legalName: string;
  companyNumber: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    linkedin: string;
    facebook: string;
    x: string;
    instagram: string;
  };
};

const defaults: SiteSettings = {
  name: "",
  legalName: "",
  companyNumber: "",
  domain: "",
  url: "",
  tagline: "",
  description: "",
  email: "",
  phone: "",
  address: "",
  socials: { linkedin: "", facebook: "", x: "", instagram: "" },
};

export function SiteSettingsEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<SiteSettings>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    ...defaults,
    ...raw,
    socials: { ...defaults.socials, ...raw.socials },
  });

  function patch(partial: Partial<SiteSettings>) {
    markDirty();
    setData((prev) => ({ ...prev, ...partial }));
  }

  function patchSocial(key: keyof SiteSettings["socials"], value: string) {
    markDirty();
    setData((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Brand & identity" description="Site name and public-facing details.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Site name" dirty={dirty}>
            <Input value={data.name} onChange={(e) => patch({ name: e.target.value })} />
          </FormField>
          <FormField label="Legal name" dirty={dirty}>
            <Input value={data.legalName} onChange={(e) => patch({ legalName: e.target.value })} />
          </FormField>
          <FormField label="Company number" dirty={dirty}>
            <Input
              value={data.companyNumber}
              onChange={(e) => patch({ companyNumber: e.target.value })}
            />
          </FormField>
          <FormField label="Domain" dirty={dirty}>
            <Input value={data.domain} onChange={(e) => patch({ domain: e.target.value })} />
          </FormField>
          <FormField label="Website URL" dirty={dirty}>
            <Input value={data.url} onChange={(e) => patch({ url: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Tagline" dirty={dirty}>
          <Input value={data.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
        </FormField>
        <FormField label="Description" dirty={dirty}>
          <RichTextarea
            value={data.description}
            onChange={(value) => patch({ description: value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Contact details" description="Shown in footer and contact page.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Email" dirty={dirty}>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </FormField>
          <FormField label="Phone" dirty={dirty}>
            <Input value={data.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Address" dirty={dirty}>
          <RichTextarea value={data.address} onChange={(value) => patch({ address: value })} />
        </FormField>
      </SectionCard>

      <SectionCard title="Social links" description="Links to your social profiles.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="LinkedIn" dirty={dirty}>
            <Input
              value={data.socials.linkedin}
              onChange={(e) => patchSocial("linkedin", e.target.value)}
            />
          </FormField>
          <FormField label="Facebook" dirty={dirty}>
            <Input
              value={data.socials.facebook}
              onChange={(e) => patchSocial("facebook", e.target.value)}
            />
          </FormField>
          <FormField label="X (Twitter)" dirty={dirty}>
            <Input value={data.socials.x} onChange={(e) => patchSocial("x", e.target.value)} />
          </FormField>
          <FormField label="Instagram" dirty={dirty}>
            <Input
              value={data.socials.instagram}
              onChange={(e) => patchSocial("instagram", e.target.value)}
            />
          </FormField>
        </div>
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
