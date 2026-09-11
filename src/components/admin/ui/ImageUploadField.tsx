"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadAdminImage } from "@/app/actions/media";
import { Button } from "@/components/ui/button";

type ImageUploadFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
};

function resolvePreviewSrc(value: string) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    return site ? `${site}${value}` : value;
  }
  return value;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Profile image",
  folder = "team/uploads",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [previewError, setPreviewError] = useState(false);
  const hasImage = Boolean(value.trim());
  const previewSrc = resolvePreviewSrc(value.trim());

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      const result = await uploadAdminImage(formData);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setPreviewError(false);
      onChange(result.url);
      toast.success("Image uploaded");
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-[var(--color-muted)]">{label}</label>

      <div className="flex items-start gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)]">
          {hasImage && !previewError ? (
            <Image
              key={previewSrc}
              src={previewSrc}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center text-xs text-[var(--color-muted)]">
              <ImagePlus className="h-5 w-5" />
              {previewError ? "Preview unavailable" : "No image"}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {pending ? "Uploading..." : hasImage ? "Replace image" : "Upload image"}
          </Button>
          {hasImage ? (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => {
                setPreviewError(false);
                onChange("");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remove image
            </Button>
          ) : null}
          <p className="text-xs text-[var(--color-muted)]">
            Upload JPG, PNG, WEBP, or GIF up to 5MB. After you save the member, the public website shows this photo.
          </p>
        </div>
      </div>
    </div>
  );
}
