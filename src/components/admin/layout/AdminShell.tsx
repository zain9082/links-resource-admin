"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Topbar } from "@/components/admin/layout/Topbar";
import { RouteTransition } from "@/components/admin/layout/RouteTransition";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  recentResources: Array<{ id: string; title: string }>;
  recentTeam: Array<{ id: string; name: string }>;
};

export function AdminShell({
  children,
  userName,
  userEmail,
  recentResources,
  recentTeam,
}: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--color-bg-app)] text-[var(--color-foreground)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        userName={userName}
        userEmail={userEmail}
      />

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" />
          <Dialog.Content className="fixed left-0 top-0 z-50 h-dvh w-[280px] md:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              userName={userName}
              userEmail={userEmail}
              mobile
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <main
        className={cn(
          "min-h-dvh transition-[margin] duration-300",
          collapsed ? "md:ml-[76px]" : "md:ml-[280px]"
        )}
      >
        <div className="flex h-dvh flex-col overflow-hidden">
          <div className="shrink-0 px-4 pt-4 md:px-6 md:pt-6">
            <div className="mx-auto max-w-[1400px]">
              <Topbar
                onMobileMenu={() => setMobileOpen(true)}
                recentResources={recentResources}
                recentTeam={recentTeam}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-20 md:px-6 md:pb-6">
            <div className="mx-auto max-w-[1400px]">
              <RouteTransition>{children}</RouteTransition>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
