"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  approveSubmission,
  deleteSubmission,
  rejectSubmission,
} from "@/app/actions/submissions";
import { DataTable } from "@/components/admin/ui/DataTable";
import { FormField } from "@/components/admin/ui/FormField";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionRow = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  reason: string | null;
  user: { name: string | null; email: string | null } | null;
};

export function SubmissionsAdminClient({ rows }: { rows: SubmissionRow[] }) {
  const [tab, setTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [pending, startTransition] = useTransition();
  const [detail, setDetail] = useState<SubmissionRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(
    () => (tab === "ALL" ? rows : rows.filter((row) => row.status === tab)),
    [rows, tab]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((item) => (
          <Button
            key={item}
            variant={tab === item ? "primary" : "secondary"}
            onClick={() => setTab(item as typeof tab)}
          >
            {item}
          </Button>
        ))}
      </div>
      <DataTable
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No submissions"
        emptyDescription="Incoming submissions will appear here."
        columns={[
          {
            key: "submitter",
            label: "Submitter",
            render: (row) => row.user?.name || row.user?.email || "Anonymous",
          },
          { key: "title", label: "Resource name" },
          { key: "url", label: "URL" },
          { key: "category", label: "Category" },
          {
            key: "createdAt",
            label: "Date",
            render: (row) => new Date(row.createdAt).toLocaleDateString("en-GB"),
          },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => setDetail(row)} className="text-[var(--color-foreground)]">
                  View
                </button>
                <button
                  type="button"
                  className="text-emerald-300"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await approveSubmission(row.id);
                      if ("error" in result) {
                        toast.error(`✗ Approve failed: ${result.error}`);
                        return;
                      }
                      toast.success("✓ Submission approved");
                    })
                  }
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="text-amber-300"
                  onClick={() => {
                    setDetail(row);
                    setRejectReason(row.reason ?? "");
                  }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="text-red-300"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await deleteSubmission(row.id);
                      if ("error" in result) {
                        toast.error(`✗ Delete failed: ${result.error}`);
                        return;
                      }
                      toast.success("✓ Submission deleted");
                    })
                  }
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />

      <SlideOver
        open={Boolean(detail)}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail ? detail.title : "Submission"}
        description="Review and approve/reject this submission."
      >
        {detail ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-muted)]">{detail.description}</p>
            <a href={detail.url} target="_blank" className="text-sm text-blue-300 underline" rel="noreferrer">
              {detail.url}
            </a>
            <FormField label="Reject reason (optional)" dirty>
              <Input value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
            </FormField>
            <div className="flex gap-2">
              <Button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await approveSubmission(detail.id);
                    if ("error" in result) {
                      toast.error(`✗ Approve failed: ${result.error}`);
                      return;
                    }
                    toast.success("✓ Submission approved");
                    setDetail(null);
                  })
                }
              >
                Approve
              </Button>
              <Button
                variant="danger"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await rejectSubmission(detail.id, rejectReason);
                    if ("error" in result) {
                      toast.error(`✗ Reject failed: ${result.error}`);
                      return;
                    }
                    toast.success("✓ Submission rejected");
                    setDetail(null);
                  })
                }
              >
                Reject
              </Button>
            </div>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
