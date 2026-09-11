"use client";

import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Search } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin-nav";

const quickActions = [
  { label: "Add Resource", href: "/admin/resources/new" },
  { label: "Add Team Member", href: "/admin/team" },
  { label: "View Live Site", href: "https://linksresource.com", external: true },
];

type CommandPaletteProps = {
  recentResources?: Array<{ id: string; title: string }>;
  recentTeam?: Array<{ id: string; name: string }>;
};

export function CommandPalette({
  recentResources = [],
  recentTeam = [],
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const pages = useMemo(
    () =>
      ADMIN_NAV.flatMap((group) =>
        group.items.map((item) => ({ label: item.label, href: item.href }))
      ),
    []
  );

  const dynamicItems = [
    ...recentResources.map((item) => ({
      label: `Resource: ${item.title}`,
      href: `/admin/resources/${item.id}`,
    })),
    ...recentTeam.map((item) => ({
      label: `Team: ${item.name}`,
      href: "/admin/team",
    })),
  ];
  const allItems = [...pages, ...dynamicItems, ...quickActions];
  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="hidden items-center gap-2 admin-panel px-3 py-2 text-sm text-[var(--color-muted)] md:flex"
        >
          <Search className="h-4 w-4" />
          Search
          <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="admin-dialog fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl p-3">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search admin pages and quick actions
          </Dialog.Description>
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-2">
            <Search className="h-4 w-4 text-[var(--color-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages and actions..."
              className="h-10 flex-1 bg-transparent text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div className="max-h-80 overflow-auto">
            {filtered.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                target={"external" in item && item.external ? "_blank" : undefined}
                className="block rounded-lg px-2 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-foreground)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
