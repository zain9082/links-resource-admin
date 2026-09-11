import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TeamAdminClient } from "@/components/admin/team/TeamAdminClient";
import { prisma } from "@/lib/prisma";
import { getLegacyTeamMembers } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function TeamAdminPage() {
  const members = await safeDb(
    () =>
      prisma.teamMember.findMany({
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    []
  );
  const list = members.length > 0 ? members : await getLegacyTeamMembers();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Team"
        subtitle="Manage team cards, ordering, and visibility across the website."
      />
      <TeamAdminClient members={list} />
    </div>
  );
}
