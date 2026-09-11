"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";

type InlineEditProps = {
  value: string;
  onSave: (value: string) => void | Promise<void>;
};

export function InlineEdit({ value, onSave }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-2 text-left hover:text-[var(--color-foreground)]"
      >
        <span>{value}</span>
        <Pencil className="h-3.5 w-3.5 text-[var(--color-muted)]" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="h-8 w-40 text-xs"
      />
      <button
        type="button"
        className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1"
        onClick={async () => {
          await onSave(draft);
          setEditing(false);
        }}
      >
        <Check className="h-3.5 w-3.5 text-emerald-300" />
      </button>
    </div>
  );
}
