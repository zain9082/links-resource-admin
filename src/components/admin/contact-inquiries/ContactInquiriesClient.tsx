"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteContactInquiry,
  updateContactInquiryStatus,
  viewContactInquiry,
} from "@/app/actions/contact-inquiries";
import { DataTable } from "@/components/admin/ui/DataTable";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";

type ContactInquiryRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string | null;
  website: string | null;
  message: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

type Filter = "ALL" | ContactInquiryRow["status"];

export function ContactInquiriesClient({ rows }: { rows: ContactInquiryRow[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [detail, setDetail] = useState<ContactInquiryRow | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((row) => row.status === filter)),
    [filter, rows]
  );

  function openInquiry(row: ContactInquiryRow) {
    startTransition(async () => {
      const result = await viewContactInquiry(row.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setDetail({ ...row, status: row.status === "NEW" ? "READ" : row.status });
    });
  }

  function updateStatus(id: string, status: "READ" | "ARCHIVED") {
    startTransition(async () => {
      const result = await updateContactInquiryStatus(id, status);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setDetail((current) => (current?.id === id ? { ...current, status } : current));
      toast.success(status === "ARCHIVED" ? "Inquiry archived" : "Inquiry marked as read");
    });
  }

  function removeInquiry(id: string) {
    if (!window.confirm("Delete this contact inquiry? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteContactInquiry(id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setDetail(null);
      toast.success("Inquiry deleted");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["ALL", "NEW", "READ", "ARCHIVED"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "primary" : "secondary"}
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      <DataTable
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No contact inquiries"
        emptyDescription="Messages submitted through the public contact form will appear here."
        columns={[
          { key: "name", label: "Sender" },
          {
            key: "email",
            label: "Email",
            render: (row) => (
              <a href={`mailto:${row.email}`} className="text-blue-400 hover:underline">
                {row.email}
              </a>
            ),
          },
          { key: "subject", label: "Subject" },
          {
            key: "createdAt",
            label: "Received",
            render: (row) =>
              new Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(row.createdAt)),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                type="button"
                disabled={pending}
                onClick={() => openInquiry(row)}
                className="text-sm font-medium text-blue-400 hover:underline disabled:opacity-50"
              >
                Open
              </button>
            ),
          },
        ]}
      />

      <SlideOver
        open={Boolean(detail)}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail?.subject ?? "Contact inquiry"}
        description={
          detail
            ? `Received ${new Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(detail.createdAt))}`
            : ""
        }
      >
        {detail ? (
          <div className="space-y-5">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-[var(--color-foreground)]">{detail.name}</p>
              <a href={`mailto:${detail.email}`} className="text-blue-400 hover:underline">
                {detail.email}
              </a>
              {detail.phone ? <p className="text-[var(--color-muted)]">{detail.phone}</p> : null}
              {detail.website ? (
                <a
                  href={detail.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  {detail.website}
                </a>
              ) : null}
            </div>

            <div className="whitespace-pre-wrap rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-4 text-sm leading-6 text-[var(--color-foreground)]">
              {detail.message}
            </div>

            <div className="flex flex-wrap gap-2">
              {detail.status !== "READ" ? (
                <Button
                  variant="secondary"
                  disabled={pending}
                  onClick={() => updateStatus(detail.id, "READ")}
                >
                  Mark as read
                </Button>
              ) : null}
              {detail.status !== "ARCHIVED" ? (
                <Button
                  variant="secondary"
                  disabled={pending}
                  onClick={() => updateStatus(detail.id, "ARCHIVED")}
                >
                  Archive
                </Button>
              ) : null}
              <Button
                variant="danger"
                disabled={pending}
                onClick={() => removeInquiry(detail.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
