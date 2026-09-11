"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateHomepageSection } from "@/app/actions/homepage";
import { FormField } from "@/components/admin/ui/FormField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeroData = {
  badgeText: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string[];
  subheadline: string;
  bullets?: string[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: Array<{ value: string; label: string }>;
};

export function HeroEditor({ initialData }: { initialData: HeroData }) {
  const [pending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    if (!dirty) setDirty(true);
  }

  function save() {
    startTransition(async () => {
      const result = await updateHomepageSection("hero", data);
      if ("error" in result) {
        toast.error(`✗ Failed to save hero: ${result.error}`);
        return;
      }
      setDirty(false);
      toast.success("✓ Hero section saved");
    });
  }

  return (
    <div className="admin-card space-y-4 rounded-2xl p-5">
      <FormField label="Badge text" dirty={dirty}>
        <Input
          value={data.badgeText}
          onChange={(event) => {
            markDirty();
            setData((prev) => ({ ...prev, badgeText: event.target.value }));
          }}
        />
      </FormField>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Headline line 1" dirty={dirty}>
          <Input
            value={data.headlineLine1}
            onChange={(event) => {
              markDirty();
              setData((prev) => ({ ...prev, headlineLine1: event.target.value }));
            }}
          />
        </FormField>
        <FormField label="Headline line 2" dirty={dirty}>
          <Input
            value={data.headlineLine2}
            onChange={(event) => {
              markDirty();
              setData((prev) => ({ ...prev, headlineLine2: event.target.value }));
            }}
          />
        </FormField>
      </div>
      <FormField label="Typing words (comma separated)" dirty={dirty}>
        <Input
          value={data.headlineLine3.join(", ")}
          onChange={(event) => {
            markDirty();
            setData((prev) => ({
              ...prev,
              headlineLine3: event.target.value.split(",").map((entry) => entry.trim()),
            }));
          }}
        />
      </FormField>
      <FormField label="Subheadline" dirty={dirty}>
        <RichTextarea
          value={data.subheadline}
          onChange={(value) => {
            markDirty();
            setData((prev) => ({ ...prev, subheadline: value }));
          }}
        />
      </FormField>
      <FormField label="Hero bullets (comma separated)" dirty={dirty}>
        <Input
          value={(data.bullets ?? []).join(", ")}
          onChange={(event) => {
            markDirty();
            setData((prev) => ({
              ...prev,
              bullets: event.target.value.split(",").map((entry) => entry.trim()).filter(Boolean),
            }));
          }}
        />
      </FormField>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Primary CTA label" dirty={dirty}>
          <Input
            value={data.ctaPrimary.label}
            onChange={(event) => {
              markDirty();
              setData((prev) => ({
                ...prev,
                ctaPrimary: { ...prev.ctaPrimary, label: event.target.value },
              }));
            }}
          />
        </FormField>
        <FormField label="Primary CTA href" dirty={dirty}>
          <Input
            value={data.ctaPrimary.href}
            onChange={(event) => {
              markDirty();
              setData((prev) => ({
                ...prev,
                ctaPrimary: { ...prev.ctaPrimary, href: event.target.value },
              }));
            }}
          />
        </FormField>
      </div>
      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
