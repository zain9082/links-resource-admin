"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";
import type { LegalPageContent } from "@/lib/service-landing-defaults";

const defaults: LegalPageContent = {
  title: "",
  description: "",
  lastUpdated: "",
  sections: [],
};

export function LegalPageEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<LegalPageContent>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    title: raw.title ?? defaults.title,
    description: raw.description ?? defaults.description,
    lastUpdated: raw.lastUpdated ?? "",
    sections: raw.sections ?? [],
  });

  function patch(partial: Partial<LegalPageContent>) {
    markDirty();
    setData((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Page header">
        <FormField label="Title" dirty={dirty}>
          <Input value={data.title} onChange={(e) => patch({ title: e.target.value })} />
        </FormField>
        <FormField label="Description" dirty={dirty}>
          <RichTextarea
            value={data.description}
            onChange={(value) => patch({ description: value })}
          />
        </FormField>
        <FormField label="Last updated (optional)" dirty={dirty}>
          <Input
            value={data.lastUpdated ?? ""}
            placeholder="e.g. July 2026"
            onChange={(e) => patch({ lastUpdated: e.target.value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Sections" description="Legal policy sections shown on the page.">
        <div className="space-y-4">
          {data.sections.map((section, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border border-[var(--color-border)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-[var(--color-muted)]">
                  Section {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    patch({ sections: data.sections.filter((_, i) => i !== index) })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <FormField label="Heading" dirty={dirty}>
                <Input
                  value={section.heading}
                  onChange={(e) => {
                    const sections = [...data.sections];
                    sections[index] = { ...sections[index], heading: e.target.value };
                    patch({ sections });
                  }}
                />
              </FormField>
              <FormField label="Body" dirty={dirty}>
                <RichTextarea
                  value={section.body}
                  onChange={(value) => {
                    const sections = [...data.sections];
                    sections[index] = { ...sections[index], body: value };
                    patch({ sections });
                  }}
                />
              </FormField>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              patch({ sections: [...data.sections, { heading: "", body: "" }] })
            }
          >
            <Plus className="h-4 w-4" />
            Add section
          </Button>
        </div>
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
