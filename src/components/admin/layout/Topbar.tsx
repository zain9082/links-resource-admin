"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, Menu, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { getAdminBreadcrumb } from "@/lib/admin-nav";
import { CommandPalette } from "@/components/admin/layout/CommandPalette";

type TopbarProps = {
  onMobileMenu: () => void;
  recentResources: Array<{ id: string; title: string }>;
  recentTeam: Array<{ id: string; name: string }>;
};

export function Topbar({
  onMobileMenu,
  recentResources,
  recentTeam,
}: TopbarProps) {
  const pathname = usePathname();
  const breadcrumb = getAdminBreadcrumb(pathname);

  return (
    <header className="admin-card mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenu}
          className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <p className="text-sm text-[var(--color-muted)]">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-2">
        <CommandPalette recentResources={recentResources} recentTeam={recentTeam} />
        <button
          type="button"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-muted)]"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-muted)]"
            >
              <User className="h-4 w-4" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-transparent" />
            <Dialog.Content className="fixed right-6 top-16 z-50 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-sidebar)] p-2 shadow-xl">
              <Dialog.Title className="sr-only">Account menu</Dialog.Title>
              <Dialog.Description className="sr-only">
                Profile and sign out options
              </Dialog.Description>
              <Link
                href="http://localhost:3000"
                target="_blank"
                className="block rounded-md px-2 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
              >
                View site
              </Link>
              <Link
                href="/admin/users"
                className="block rounded-md px-2 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
              >
                Profile
              </Link>
              <button
                type="button"
                className="block w-full rounded-md px-2 py-2 text-left text-sm text-red-500 hover:bg-[var(--color-surface)]"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
