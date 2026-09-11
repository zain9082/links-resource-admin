"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, Sparkles } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { ThemeToggleButton } from "@/components/admin/layout/ThemeToggleButton";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  userName?: string | null;
  userEmail?: string | null;
  mobile?: boolean;
};

export function Sidebar({
  collapsed,
  onToggle,
  userName,
  userEmail,
  mobile = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "admin-sidebar flex h-dvh shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)]",
          mobile ? "relative w-[280px]" : "fixed left-0 top-0 z-50 hidden md:flex",
          !mobile && (collapsed ? "w-[76px]" : "w-[280px]")
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "shrink-0 border-b border-[var(--color-border)] px-4 py-4",
            collapsed && !mobile ? "px-3" : ""
          )}
        >
          <div className={cn("flex items-center", collapsed && !mobile ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] shadow-lg shadow-purple-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              {(!collapsed || mobile) && (
                <div>
                  <p className="text-sm font-bold text-[var(--color-foreground)]">Links Resource</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Admin Portal
                  </p>
                </div>
              )}
            </div>
            {(!collapsed || mobile) && (
              <button
                type="button"
                onClick={onToggle}
                className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] transition-all hover:border-[#7C3AED]/30 hover:bg-[var(--color-nav-hover)] hover:text-[#7C3AED]"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Nav — invisible scroll */}
        <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <div className="space-y-6">
            {ADMIN_NAV.map((group) => (
              <div key={group.group}>
                {(!collapsed || mobile) && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    {group.group}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed && !mobile ? item.label : undefined}
                        className={cn(
                          "nav-link",
                          active && "nav-link-active",
                          collapsed && !mobile ? "justify-center px-2" : ""
                        )}
                      >
                        <item.icon className="nav-link-icon" />
                        {(!collapsed || mobile) && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 space-y-2 border-t border-[var(--color-border)] p-3">
          <div className={cn("flex gap-2", collapsed && !mobile ? "flex-col items-center" : "items-center")}>
            {collapsed && !mobile ? (
              <button
                type="button"
                onClick={onToggle}
                className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] transition-all hover:border-[#7C3AED]/30 hover:bg-[var(--color-nav-hover)] hover:text-[#7C3AED]"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            ) : null}
            <ThemeToggleButton />
          </div>
          {(!collapsed || mobile) && (
            <div className="admin-card rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-xs font-bold text-white shadow-md shadow-purple-500/20">
                  {(userName || "A").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                    {userName || "Admin User"}
                  </p>
                  <p className="truncate text-xs text-[var(--color-muted)]">
                    {userEmail || "admin@linksresource.com"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg-sidebar)]/95 px-2 py-1 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {ADMIN_NAV[0].items
            .concat(ADMIN_NAV[1].items.slice(0, 4))
            .slice(0, 5)
            .map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center rounded-lg px-2 py-2 text-[10px] transition-colors",
                    active ? "text-[#7C3AED]" : "text-[var(--color-muted)]"
                  )}
                >
                  <item.icon className="mb-1 h-4 w-4" />
                  {item.label.split(" ")[0]}
                </Link>
              );
            })}
        </div>
      </nav>
    </>
  );
}
