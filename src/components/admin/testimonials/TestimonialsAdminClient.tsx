"use client";

import { useState, useTransition } from "react";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { upsertTestimonial } from "@/app/actions/testimonials";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TestimonialRow = {
  id: string;
  authorName: string;
  company: string;
  role: string | null;
  rating: number;
  quote: string;
};

export function TestimonialsAdminClient({ rows }: { rows: TestimonialRow[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    authorName: "",
    company: "",
    role: "",
    rating: 5,
    quote: "",
    featured: false,
    displayOrder: 0,
  });

  function save() {
    startTransition(async () => {
      const result = await upsertTestimonial(form);
      if ("error" in result) {
        toast.error(`✗ Failed to save testimonial: ${result.error}`);
        return;
      }
      toast.success("✓ Testimonial saved");
      setOpen(false);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <article key={row.id} className="admin-panel-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-[var(--color-foreground)]">{row.authorName}</p>
              <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                <Star className="h-3.5 w-3.5 fill-current" /> {row.rating}
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{row.company}</p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{row.quote}</p>
          </article>
        ))}
      </div>
      <SlideOver
        open={open}
        onOpenChange={setOpen}
        title="Add Testimonial"
        description="Create a new social proof card."
      >
        <div className="space-y-3">
          <FormField label="Author name" dirty>
            <Input
              value={form.authorName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, authorName: event.target.value }))
              }
            />
          </FormField>
          <FormField label="Company" dirty>
            <Input
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            />
          </FormField>
          <FormField label="Role" dirty>
            <Input
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            />
          </FormField>
          <FormField label="Quote" dirty>
            <RichTextarea
              value={form.quote}
              onChange={(quote) => setForm((prev) => ({ ...prev, quote }))}
            />
          </FormField>
          <FormField label="Rating (1-5)" dirty>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, rating: Number(event.target.value) || 1 }))
              }
            />
          </FormField>
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving..." : "Save Testimonial"}
          </Button>
        </div>
      </SlideOver>
    </div>
  );
}
