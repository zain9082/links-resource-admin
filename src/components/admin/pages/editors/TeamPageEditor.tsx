"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { TeamAdminClient } from "@/components/admin/team/TeamAdminClient";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { StringListEditor } from "@/components/admin/pages/shared/StringListEditor";
import { TitleBodyItemsEditor } from "@/components/admin/pages/shared/TitleBodyItemsEditor";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type TeamPageCta = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  badges: string[];
};

type TeamPage = {
  title: string;
  subtitle: string;
  trustHeading: string;
  trustPoints: string[];
  workflowHeading: string;
  workflow: Array<{ title: string; body: string }>;
  cta: TeamPageCta;
};

const defaultCta: TeamPageCta = {
  title: "",
  subtitle: "",
  primaryLabel: "Get Free Proposal",
  primaryHref: "/contact",
  secondaryLabel: "Email Team",
  secondaryHref: "mailto:hello@linksresource.com",
  badges: [],
};

const defaults: TeamPage = {
  title: "",
  subtitle: "",
  trustHeading: "",
  trustPoints: [],
  workflowHeading: "",
  workflow: [],
  cta: defaultCta,
};

type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
  imageUrl: string | null;
  linkedIn: string | null;
  twitter: string | null;
  displayOrder: number;
  active: boolean;
};

export function TeamPageEditor({
  slug,
  label,
  initialData,
  members = [],
}: {
  slug: string;
  label: string;
  initialData: unknown;
  members?: TeamMemberRecord[];
}) {
  const raw = (initialData ?? {}) as Partial<TeamPage>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    ...defaults,
    ...raw,
    trustPoints: raw.trustPoints ?? [],
    workflow: raw.workflow ?? [],
    cta: { ...defaultCta, ...raw.cta },
  });

  function patch(partial: Partial<TeamPage>) {
    markDirty();
    setData((prev) => ({ ...prev, ...partial }));
  }

  function patchCta(partial: Partial<TeamPageCta>) {
    markDirty();
    setData((prev) => ({ ...prev, cta: { ...prev.cta, ...partial } }));
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Team members"
        description="Add, edit, remove people, and change profile photos shown on /team."
      >
        <TeamAdminClient members={members} />
      </SectionCard>

      <SectionCard title="Page header" description="Main heading shown at the top of the team page.">
        <FormField label="Title" dirty={dirty}>
          <Input value={data.title} onChange={(e) => patch({ title: e.target.value })} />
        </FormField>
        <FormField label="Subtitle" dirty={dirty}>
          <RichTextarea
            value={data.subtitle}
            onChange={(value) => patch({ subtitle: value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Trust section" description="Why clients trust your team.">
        <FormField label="Section heading" dirty={dirty}>
          <Input
            value={data.trustHeading}
            onChange={(e) => patch({ trustHeading: e.target.value })}
          />
        </FormField>
        <StringListEditor
          label="Trust points"
          items={data.trustPoints}
          dirty={dirty}
          onChange={(trustPoints) => patch({ trustPoints })}
        />
      </SectionCard>

      <SectionCard title="Workflow section" description="How your team works with clients.">
        <FormField label="Section heading" dirty={dirty}>
          <Input
            value={data.workflowHeading}
            onChange={(e) => patch({ workflowHeading: e.target.value })}
          />
        </FormField>
        <TitleBodyItemsEditor
          label="Workflow steps"
          items={data.workflow}
          dirty={dirty}
          onChange={(workflow) => patch({ workflow })}
        />
      </SectionCard>

      <SectionCard title="Bottom CTA" description="Pink call-to-action banner at the bottom of the page.">
        <FormField label="Title" dirty={dirty}>
          <Input value={data.cta.title} onChange={(e) => patchCta({ title: e.target.value })} />
        </FormField>
        <FormField label="Subtitle" dirty={dirty}>
          <RichTextarea
            value={data.cta.subtitle}
            onChange={(value) => patchCta({ subtitle: value })}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Primary button" dirty={dirty}>
            <Input
              value={data.cta.primaryLabel}
              onChange={(e) => patchCta({ primaryLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Primary link" dirty={dirty}>
            <Input
              value={data.cta.primaryHref}
              onChange={(e) => patchCta({ primaryHref: e.target.value })}
            />
          </FormField>
          <FormField label="Secondary button" dirty={dirty}>
            <Input
              value={data.cta.secondaryLabel}
              onChange={(e) => patchCta({ secondaryLabel: e.target.value })}
            />
          </FormField>
          <FormField label="Secondary link" dirty={dirty}>
            <Input
              value={data.cta.secondaryHref}
              onChange={(e) => patchCta({ secondaryHref: e.target.value })}
            />
          </FormField>
        </div>
        <StringListEditor
          label="Badge labels"
          items={data.cta.badges}
          dirty={dirty}
          onChange={(badges) => patchCta({ badges })}
        />
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
