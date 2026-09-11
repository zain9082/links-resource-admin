"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateHomepageSection } from "@/app/actions/homepage";
import { FormField } from "@/components/admin/ui/FormField";
import { SortableList } from "@/components/admin/ui/SortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HomeService = {
  slug: string;
  title: string;
  tagline: string;
  icon?: string;
  href?: string;
};

export function ServicesEditor({ initialData }: { initialData: HomeService[] }) {
  const [items, setItems] = useState<HomeService[]>(initialData);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const payload = items.map((item) => ({
        icon: item.icon ?? "Sparkles",
        title: item.title,
        description: item.tagline,
        href: item.href ?? `/services/${item.slug}`,
      }));
      const result = await updateHomepageSection("services", payload);
      if ("error" in result) {
        toast.error(`✗ Failed to save services: ${result.error}`);
        return;
      }
      toast.success("✓ Services section saved");
    });
  }

  return (
    <div className="admin-card space-y-4 rounded-2xl p-5">
      <SortableList
        items={items.map((item) => ({
          id: item.slug,
          label: item.title,
          description: item.tagline,
        }))}
        onChange={(sorted) => {
          setItems(
            sorted.map((entry) => items.find((item) => item.slug === entry.id) ?? items[0])
          );
        }}
      />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.slug} className="admin-panel p-3">
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-[var(--color-muted)]">Item {index + 1}</p>
              <button
                type="button"
                className="text-red-500 hover:text-red-600"
                onClick={() => setItems((prev) => prev.filter((entry) => entry.slug !== item.slug))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <FormField label="Title" dirty>
              <Input
                value={item.title}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.slug === item.slug ? { ...entry, title: event.target.value } : entry
                    )
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
            setItems((prev) => [
              ...prev,
              {
                slug: `new-${Date.now()}`,
                title: "New service",
                tagline: "",
              },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add item
        </Button>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
