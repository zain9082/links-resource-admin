"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { upsertTeamMember } from "@/app/actions/team";
import { FormField } from "@/components/admin/ui/FormField";
import { ImageUploadField } from "@/components/admin/ui/ImageUploadField";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TeamMemberFormProps = {
  initial?: {
    id?: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    imageUrl?: string | null;
    linkedIn?: string | null;
    twitter?: string | null;
    displayOrder?: number;
    active?: boolean;
  };
  onSaved?: () => void;
};

export function TeamMemberForm({ initial, onSaved }: TeamMemberFormProps) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    id: initial?.id,
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    email: initial?.email ?? "",
    imageUrl: initial?.imageUrl ?? "",
    linkedIn: initial?.linkedIn ?? "",
    twitter: initial?.twitter ?? "",
    displayOrder: initial?.displayOrder ?? 0,
    active: initial?.active ?? true,
  });

  function save() {
    startTransition(async () => {
      const result = await upsertTeamMember(form);
      if ("error" in result) {
        toast.error(`✗ Failed to save member: ${result.error}`);
        return;
      }
      toast.success("✓ Team member saved");
      onSaved?.();
    });
  }

  return (
    <div className="space-y-3">
      <FormField label="Name" dirty>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      </FormField>
      <FormField label="Role" dirty>
        <Input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
      </FormField>
      <FormField label="Email" dirty>
        <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
      </FormField>
      <FormField label="Bio" dirty>
        <RichTextarea value={form.bio} onChange={(bio) => setForm((p) => ({ ...p, bio }))} />
      </FormField>
      <ImageUploadField
        label="Profile image"
        value={form.imageUrl}
        onChange={(imageUrl) => setForm((p) => ({ ...p, imageUrl }))}
        folder="team/uploads"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="LinkedIn" dirty>
          <Input value={form.linkedIn} onChange={(e) => setForm((p) => ({ ...p, linkedIn: e.target.value }))} />
        </FormField>
        <FormField label="Twitter" dirty>
          <Input value={form.twitter} onChange={(e) => setForm((p) => ({ ...p, twitter: e.target.value }))} />
        </FormField>
      </div>
      <FormField label="Display order" dirty>
        <Input
          type="number"
          value={form.displayOrder}
          onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
        />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
          className="rounded border-[var(--color-border)]"
        />
        Visible on website
      </label>
      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save member"}
      </Button>
    </div>
  );
}
