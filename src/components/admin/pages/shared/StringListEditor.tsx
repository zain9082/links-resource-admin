"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type StringListEditorProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  dirty?: boolean;
  placeholder?: string;
};

export function StringListEditor({
  label,
  items,
  onChange,
  dirty,
  placeholder = "Enter text…",
}: StringListEditorProps) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <FormField label={label} dirty={dirty}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>
    </FormField>
  );
}
