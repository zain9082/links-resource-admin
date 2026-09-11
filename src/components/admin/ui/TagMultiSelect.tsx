"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
};

type TagMultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function TagMultiSelect({ options, value, onChange }: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    if (value.length === 0) return "Select tags";
    return `${value.length} selected`;
  }, [value.length]);

  return (
    <div className="relative">
      <button
        type="button"
        className="admin-select"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedLabel}
        <ChevronDown className="h-4 w-4 text-[var(--color-muted)]" />
      </button>
      {open ? (
        <div className="admin-dropdown absolute z-40 mt-2 max-h-56 w-full overflow-auto rounded-xl p-2">
          {options.map((option) => {
            const active = value.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm",
                  active
                    ? "bg-[#7C3AED]/20 text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-nav-hover)]"
                )}
                onClick={() => {
                  if (active) {
                    onChange(value.filter((entry) => entry !== option.id));
                    return;
                  }
                  onChange([...value, option.id]);
                }}
              >
                {option.label}
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
