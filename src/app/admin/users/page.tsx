import { PageHeader } from "@/components/admin/ui/PageHeader";
import { UsersAdminClient } from "@/components/admin/users/UsersAdminClient";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

export default async function UsersAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { favorites: true } },
          favorites: {
            select: { resource: { select: { title: true } } },
            take: 10,
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users"
        subtitle="Manage roles, password resets, account deletions, and favorites."
      />
      <UsersAdminClient rows={rows} />
    </div>
  );
}
