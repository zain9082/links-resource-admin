"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePageContent } from "@/app/actions/pages";
import { Button } from "@/components/ui/button";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";

type PageJsonEditorProps = {
  slug: string;
  label: string;
  initialData: unknown;
};

export function PageJsonEditor({ slug, label, initialData }: PageJsonEditorProps) {
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(JSON.stringify(initialData, null, 2));

  function save() {
    startTransition(async () => {
      try {
        const parsed = JSON.parse(content) as unknown;
        const result = await updatePageContent(slug, parsed);
        if ("error" in result) {
          toast.error(`Failed to save ${label}: ${result.error}`);
          return;
        }
        toast.success(`${label} saved`);
      } catch {
        toast.error("Invalid JSON — please fix syntax errors before saving.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Edit the JSON content for this page. Changes appear on the live website after saving.
      </p>
      <RichTextarea value={content} onChange={setContent} rows={24} maxLength={50000} />
      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
