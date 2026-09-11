"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SlideOverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SlideOver({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: SlideOverProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "admin-dialog fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l p-6 backdrop-blur-md",
            className
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-xl font-semibold text-[var(--color-foreground)]">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-[var(--color-muted)]">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] hover:bg-[var(--color-nav-hover)]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
