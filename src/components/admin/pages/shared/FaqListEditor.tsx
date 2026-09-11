"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FaqItem = { q: string; a: string };

type FaqListEditorProps = {
  items: FaqItem[];
  dirty: boolean;
  onChange: (items: FaqItem[]) => void;
};

export function FaqListEditor({ items, dirty, onChange }: FaqListEditorProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`faq-${index}`} className="admin-panel space-y-3 p-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <FormField label="Question" dirty={dirty}>
            <Input
              value={item.q}
              onChange={(e) =>
                onChange(
                  items.map((entry, i) =>
                    i === index ? { ...entry, q: e.target.value } : entry
                  )
                )
              }
            />
          </FormField>
          <FormField label="Answer" dirty={dirty}>
            <RichTextarea
              value={item.a}
              onChange={(value) =>
                onChange(
                  items.map((entry, i) => (i === index ? { ...entry, a: value } : entry))
                )
              }
            />
          </FormField>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange([...items, { q: "", a: "" }])}
      >
        <Plus className="h-4 w-4" /> Add FAQ
      </Button>
    </div>
  );
}
