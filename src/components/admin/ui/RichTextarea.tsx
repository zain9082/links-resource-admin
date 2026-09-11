"use client";

import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";

type RichTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
};

export function RichTextarea({
  value,
  onChange,
  placeholder,
  maxLength = 1200,
  rows = 4,
}: RichTextareaProps) {
  const count = useMemo(() => value.length, [value]);

  return (
    <div className="space-y-1">
      <Textarea
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y"
      />
      <p className="text-right text-xs text-[var(--color-muted)]">
        {count}/{maxLength}
      </p>
    </div>
  );
}
