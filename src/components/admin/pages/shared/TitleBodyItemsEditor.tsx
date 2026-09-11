"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type TitleBodyItem = {
  title: string;
  body: string;
  href?: string;
};

type TitleBodyItemsEditorProps = {
  label: string;
  items: TitleBodyItem[];
  onChange: (items: TitleBodyItem[]) => void;
  dirty?: boolean;
  showHref?: boolean;
};

export function TitleBodyItemsEditor({
  label,
  items,
  onChange,
  dirty,
  showHref = false,
}: TitleBodyItemsEditorProps) {
  function updateItem(index: number, patch: Partial<TitleBodyItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...items, { title: "", body: "", ...(showHref ? { href: "" } : {}) }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Item {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
          <FormField label="Title" dirty={dirty}>
            <Input
              value={item.title}
              onChange={(event) => updateItem(index, { title: event.target.value })}
            />
          </FormField>
          <FormField label="Body" dirty={dirty}>
            <RichTextarea
              value={item.body}
              onChange={(value) => updateItem(index, { body: value })}
            />
          </FormField>
          {showHref ? (
            <FormField label="Link URL" dirty={dirty}>
              <Input
                value={item.href ?? ""}
                onChange={(event) => updateItem(index, { href: event.target.value })}
                placeholder="/resources/..."
              />
            </FormField>
          ) : null}
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}
