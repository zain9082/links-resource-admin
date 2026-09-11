"use client";

import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  onClick: () => void;
  pending?: boolean;
  dirty?: boolean;
};

export function SaveButton({ onClick, pending, dirty }: SaveButtonProps) {
  return (
    <div className="sticky bottom-4 z-10 flex justify-end pt-2">
      <Button onClick={onClick} disabled={pending} className="shadow-lg">
        {pending ? "Saving…" : dirty ? "Save Changes" : "Save Changes"}
      </Button>
    </div>
  );
}
