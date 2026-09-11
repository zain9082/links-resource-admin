"use client";

import {
  HeaderFieldsEditor,
  type PageHeaderContent,
} from "@/components/admin/pages/shared/HeaderFieldsEditor";
import { SaveButton } from "@/components/admin/pages/shared/SaveButton";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { usePageEditor } from "@/components/admin/pages/shared/usePageEditor";

type SimpleHeaderPage = {
  header: PageHeaderContent;
};

const headerDefaults: PageHeaderContent = {
  eyebrow: "",
  title: "",
  subtitle: "",
};

export function SimpleHeaderPageEditor({
  slug,
  label,
  initialData,
}: {
  slug: string;
  label: string;
  initialData: unknown;
}) {
  const raw = (initialData ?? {}) as Partial<SimpleHeaderPage>;
  const { data, setData, dirty, markDirty, save, pending } = usePageEditor(slug, label, {
    header: { ...headerDefaults, ...raw.header },
  });

  return (
    <div className="space-y-4">
      <SectionCard title="Page header" description="Heading and intro text shown at the top of this page.">
        <HeaderFieldsEditor
          header={data.header}
          dirty={dirty}
          onChange={(header) => {
            markDirty();
            setData({ header });
          }}
        />
      </SectionCard>

      <SaveButton onClick={save} pending={pending} dirty={dirty} />
    </div>
  );
}
