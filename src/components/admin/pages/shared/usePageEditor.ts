"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePageContent } from "@/app/actions/pages";

type SaveExtraResult = { success: true } | { error: string };

export function usePageEditor<T>(
  slug: string,
  label: string,
  initialData: T,
  options?: {
    saveExtra?: () => Promise<SaveExtraResult>;
  }
) {
  const [pending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [dirty, setDirty] = useState(false);
  const saveExtraRef = useRef(options?.saveExtra);
  saveExtraRef.current = options?.saveExtra;

  function markDirty() {
    if (!dirty) setDirty(true);
  }

  function save() {
    startTransition(async () => {
      const result = await updatePageContent(slug, data);
      if ("error" in result) {
        toast.error(`Failed to save ${label}: ${result.error}`);
        return;
      }
      if (saveExtraRef.current) {
        const extra = await saveExtraRef.current();
        if ("error" in extra) {
          toast.error(`Content saved, but SEO failed: ${extra.error}`);
          return;
        }
      }
      setDirty(false);
      toast.success(`${label} saved`);
    });
  }

  return { data, setData, dirty, markDirty, save, pending };
}
