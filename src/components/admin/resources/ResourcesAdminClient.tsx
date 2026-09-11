"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResource } from "@/app/actions/resources";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { DataTable } from "@/components/admin/ui/DataTable";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

type ResourceRow = {
  id: string;
  title: string;
  pricing: string;
  rating: number;
  views: number;
  status: string;
  category: { name: string };
  tags: Array<{ tag: { name: string } }>;
};

export function ResourcesAdminClient({ rows }: { rows: ResourceRow[] }) {
  const [target, setTarget] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <DataTable
        data={rows}
        rowKey={(row) => row.id}
        emptyTitle="No resources"
        emptyDescription="Add your first resource to populate the directory."
        columns={[
          { key: "title", label: "Name", sortable: true },
          { key: "category", label: "Category", render: (row) => row.category.name },
          { key: "pricing", label: "Pricing" },
          { key: "rating", label: "Rating" },
          { key: "views", label: "Views" },
          {
            key: "tags",
            label: "Tags",
            render: (row) => row.tags.map((entry) => entry.tag.name).join(", "),
          },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-3">
                <Link href={`/admin/resources/${row.id}`} className="text-[var(--color-foreground)] hover:text-[var(--color-foreground)]">
                  Edit
                </Link>
                <button
                  type="button"
                  className="text-red-300"
                  onClick={() => setTarget(row.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete resource?"
        description="This permanently removes the resource from the directory."
        confirmLabel="Delete"
        loading={pending}
        onConfirm={() =>
          startTransition(async () => {
            if (!target) return;
            const result = await deleteResource(target);
            if ("error" in result) {
              toast.error(`✗ Failed to delete resource: ${result.error}`);
              return;
            }
            toast.success("✓ Resource deleted");
            setTarget(null);
          })
        }
      />
    </div>
  );
}
