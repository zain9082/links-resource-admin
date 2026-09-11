import Link from "next/link";
import { Plus } from "lucide-react";
import { ResourcesAdminClient } from "@/components/admin/resources/ResourcesAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getLegacyResources } from "@/lib/legacy-content";
import { safeDb } from "@/lib/safe-db";

export default async function ResourcesAdminPage() {
  const rows = await safeDb(
    () =>
      prisma.resource.findMany({
        include: {
          category: { select: { name: true } },
          tags: { include: { tag: { select: { name: true } } } },
        },
        orderBy: { updatedAt: "desc" },
      }),
    []
  );
  const list = rows.length > 0 ? rows : await getLegacyResources();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <PageHeader
          title="Resources"
          subtitle="Manage resources, categories, tags, pricing, and publication status."
        />
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="h-4 w-4" /> Add Resource
          </Link>
        </Button>
      </div>
      <ResourcesAdminClient rows={list} />
    </div>
  );
}
