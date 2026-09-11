"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateHomepageSection } from "@/app/actions/homepage";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { SortableList } from "@/components/admin/ui/SortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FaqItem = { q: string; a: string; id: string };

export function FaqEditor({ initialData }: { initialData: Array<{ q: string; a: string }> }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<FaqItem[]>(
    initialData.map((item, index) => ({ ...item, id: `faq-${index}` }))
  );

  function save() {
    startTransition(async () => {
      const payload = items.map(({ q, a }) => ({ q, a }));
      const result = await updateHomepageSection("faq", payload);
      if ("error" in result) {
        toast.error(`✗ Failed to save FAQ: ${result.error}`);
        return;
      }
      toast.success("✓ FAQ section saved");
    });
  }

  return (
    <div className="admin-card space-y-4 rounded-2xl p-5">
      <SortableList
        items={items.map((item) => ({
          id: item.id,
          label: item.q || "Untitled question",
          description: item.a.slice(0, 80),
        }))}
        onChange={(sorted) =>
          setItems(sorted.map((item) => items.find((entry) => entry.id === item.id) ?? items[0]))
        }
      />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="admin-panel p-3">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <FormField label="Question" dirty>
              <Input
                value={item.q}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, q: event.target.value } : entry
                    )
                  )
                }
              />
            </FormField>
            <FormField label="Answer" dirty className="mt-3">
              <RichTextarea
                value={item.a}
                onChange={(value) =>
                  setItems((prev) =>
                    prev.map((entry) => (entry.id === item.id ? { ...entry, a: value } : entry))
                  )
                }
              />
            </FormField>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() =>
            setItems((prev) => [...prev, { id: `faq-${Date.now()}`, q: "", a: "" }])
          }
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
