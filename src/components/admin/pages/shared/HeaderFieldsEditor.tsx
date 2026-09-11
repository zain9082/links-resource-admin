"use client";

import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";

export type PageHeaderContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

type HeaderFieldsEditorProps = {
  header: PageHeaderContent;
  onChange: (header: PageHeaderContent) => void;
  dirty?: boolean;
};

export function HeaderFieldsEditor({ header, onChange, dirty }: HeaderFieldsEditorProps) {
  return (
    <div className="space-y-4">
      <FormField label="Eyebrow label" dirty={dirty}>
        <Input
          value={header.eyebrow}
          onChange={(event) => onChange({ ...header, eyebrow: event.target.value })}
          placeholder="e.g. Contact"
        />
      </FormField>
      <FormField label="Page title" dirty={dirty}>
        <Input
          value={header.title}
          onChange={(event) => onChange({ ...header, title: event.target.value })}
        />
      </FormField>
      <FormField label="Subtitle" dirty={dirty}>
        <RichTextarea
          value={header.subtitle}
          onChange={(value) => onChange({ ...header, subtitle: value })}
        />
      </FormField>
    </div>
  );
}
