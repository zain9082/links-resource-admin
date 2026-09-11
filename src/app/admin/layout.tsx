import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminSession = await requireAdminSession().catch(() => null);
  if (!adminSession) redirect("/login");
  const { session } = adminSession;

  const [recentResources, recentTeam] = await Promise.all([
    safeDb(
      () =>
        prisma.resource.findMany({
          select: { id: true, title: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeDb(
      () =>
        prisma.teamMember.findMany({
          select: { id: true, name: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
      []
    ),
  ]);

  return (
    <AdminShell
      userName={session.user?.name}
      userEmail={session.user?.email}
      recentResources={recentResources}
      recentTeam={recentTeam}
    >
      {children}
    </AdminShell>
  );
}
