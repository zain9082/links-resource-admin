"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";

type ImageUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
};

export function ImageUrlInput({
  value,
  onChange,
  label = "Profile image",
  hint = "Use a public path like /team/usama.png or a full https:// image URL.",
}: ImageUrlInputProps) {
  const hasImage = Boolean(value.trim());
  return (
    <div className="space-y-2">
      <label className="text-sm text-[var(--color-muted)]">{label}</label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/team/usama.png"
      />
      <p className="text-xs text-[var(--color-muted)]">{hint}</p>
      <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)]">
        {hasImage ? (
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
