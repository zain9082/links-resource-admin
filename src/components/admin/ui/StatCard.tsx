"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Briefcase,
  FolderTree,
  Users,
  type LucideIcon,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  FolderTree,
  Users,
  BookOpenText,
  Briefcase,
};

type StatCardProps = {
  icon: keyof typeof ICONS;
  label: string;
  value: number;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  const Icon = ICONS[icon] ?? FolderTree;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const steps = 24;
    const increment = value / steps;
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      if (index >= steps) {
        setCount(value);
        clearInterval(interval);
        return;
      }
      setCount(Math.round(increment * index));
    }, 20);

    return () => clearInterval(interval);
  }, [value]);

  const display = useMemo(() => formatNumber(count), [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-card rounded-2xl p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#7C3AED]/15 to-[#2563EB]/10">
          <Icon className="h-4 w-4 text-[#7C3AED]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">{display}</p>
    </motion.div>
  );
}
