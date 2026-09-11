"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { Input } from "@/components/ui/input";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { TitleBodyItemsEditor } from "@/components/admin/pages/shared/TitleBodyItemsEditor";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type NavMenuItem = { title: string; description: string; href: string };
type NavMenuSection = { title: string; items: NavMenuItem[] };

type NavbarServicesMenuPage = {
  menuLabel: string;
  sections: NavMenuSection[];
};

const defaults: NavbarServicesMenuPage = {
  menuLabel: "Our Services",
  sections: [],
};

function toEditorItems(items: NavMenuItem[]) {
  return items.map((item) => ({
    title: item.title,
    body: item.description,
    href: item.href,
  }));
}

function fromEditorItems(
  items: Array<{ title: string; body: string; href?: string }>
): NavMenuItem[] {
  return items.map((item) => ({
    title: item.title,
    description: item.body,
    href: item.href ?? "",
  }));
}

export function NavbarServicesMenuEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<NavbarServicesMenuPage>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    menuLabel: raw.menuLabel ?? defaults.menuLabel,
    sections: raw.sections ?? [],
  });

  function patchSection(index: number, partial: Partial<NavMenuSection>) {
    markDirty();
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, ...partial } : section
      ),
    }));
  }

  function addSection() {
    markDirty();
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", items: [] }],
    }));
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Mega menu label"
        description="Heading shown at the top of the services dropdown (e.g. Our Services)."
      >
        <FormField label="Menu label" dirty={dirty}>
          <Input
            value={data.menuLabel}
            onChange={(e) => {
              markDirty();
              setData((prev) => ({ ...prev, menuLabel: e.target.value }));
            }}
          />
        </FormField>
      </SectionCard>

      {data.sections.map((section, sectionIndex) => (
        <SectionCard
          key={sectionIndex}
          title={`Column ${sectionIndex + 1}`}
          description="One column in the services mega menu dropdown."
        >
          <FormField label="Column heading" dirty={dirty}>
            <Input
              value={section.title}
              onChange={(e) => patchSection(sectionIndex, { title: e.target.value })}
            />
          </FormField>
          <TitleBodyItemsEditor
            label="Service links"
            items={toEditorItems(section.items)}
            dirty={dirty}
            showHref
            onChange={(items) =>
              patchSection(sectionIndex, { items: fromEditorItems(items) })
            }
          />
        </SectionCard>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="text-sm font-medium text-[#7C3AED] hover:underline"
      >
        + Add column
      </button>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
