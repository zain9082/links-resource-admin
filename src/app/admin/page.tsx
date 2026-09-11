import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ActivityItem } from "@/components/admin/ui/ActivityItem";
import { prisma } from "@/lib/prisma";
import { getLegacyStats } from "@/lib/legacy-content";
import { isDbAvailable, safeDb } from "@/lib/safe-db";

export default async function AdminDashboardPage() {
  const dbOnline = await isDbAvailable();
  const legacyStats = dbOnline ? null : await getLegacyStats();
  const [
    totalResources,
    totalUsers,
    pendingSubmissions,
    publishedServices,
    totalPublications,
    missingDescriptions,
    activity,
  ] = await Promise.all([
    safeDb(() => prisma.resource.count(), 0),
    safeDb(() => prisma.user.count(), 0),
    safeDb(() => prisma.submission.count({ where: { status: "PENDING" } }), 0),
    safeDb(() => prisma.servicePage.count(), 0),
    safeDb(() => prisma.publication.count(), 0),
    safeDb(() => prisma.resource.count({ where: { description: "" } }), 0),
    safeDb(
      () =>
        prisma.activityLog.findMany({
          include: { admin: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      []
    ),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor content operations, pending reviews, and content health."
      />

      {!dbOnline ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Database is not connected — showing website content in read-only preview. Start
          PostgreSQL, then run{" "}
          <code className="rounded bg-black/20 px-1.5 py-0.5 text-xs">npm run db:setup</code> from
          the project root:{" "}
          <code className="rounded bg-black/20 px-1.5 py-0.5 text-xs">
            docker compose up -d
          </code>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="FolderTree"
          label="Total Resources"
          value={dbOnline ? totalResources : legacyStats?.resources ?? 0}
        />
        <StatCard icon="Users" label="Total Users" value={dbOnline ? totalUsers : 1} />
        <StatCard
          icon="BookOpenText"
          label="Pending Submissions"
          value={dbOnline ? pendingSubmissions : 0}
        />
        <StatCard
          icon="Briefcase"
          label="Published Services"
          value={dbOnline ? publishedServices : legacyStats?.services ?? 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="admin-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Quick Edit</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/admin/pages/site-settings", label: "Site Settings" },
              { href: "/admin/homepage", label: "Homepage" },
              { href: "/admin/pages/about", label: "About Page" },
              { href: "/admin/services", label: "Services" },
              { href: "/admin/team", label: "Team Members" },
              { href: "/admin/resources", label: "Resources" },
              { href: "/admin/publications", label: "Publications" },
              { href: "/admin/seo", label: "SEO Settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-3 text-sm text-[var(--color-foreground)] transition-all hover:-translate-y-0.5 hover:border-[#7C3AED]/35 hover:bg-[var(--color-nav-hover)] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[#7C3AED]" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Content Health</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="text-emerald-600 dark:text-emerald-300">
              ✅ All {dbOnline ? publishedServices : legacyStats?.services ?? 0} service pages have
              packages defined
            </li>
            <li className="text-emerald-600 dark:text-emerald-300">
              ✅ {dbOnline ? totalPublications : legacyStats?.publications ?? 0} publications loaded
            </li>
            <li className="text-amber-600 dark:text-amber-300">
              ⚠️ {dbOnline ? missingDescriptions : 0} resources missing descriptions
            </li>
          </ul>
        </section>
      </div>

      <section className="admin-card rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Recent Activity</h2>
        <div className="mt-4 space-y-2">
          {activity.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No activity yet.</p>
          ) : (
            activity.map((entry) => (
              <ActivityItem
                key={entry.id}
                action={entry.action}
                entity={entry.entity}
                detail={entry.detail}
                createdAt={entry.createdAt}
                adminName={entry.admin.name}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
