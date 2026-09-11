"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { deleteTeamMember, importStaticTeamMembers } from "@/app/actions/team";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { DataTable } from "@/components/admin/ui/DataTable";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";
import { Button } from "@/components/ui/button";

type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
  imageUrl: string | null;
  linkedIn: string | null;
  twitter: string | null;
  displayOrder: number;
  active: boolean;
};

export function TeamAdminClient({ members }: { members: TeamMemberRecord[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRecord | null>(null);
  const [targetDelete, setTargetDelete] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => members, [members]);
  const isLegacyOnly =
    rows.length > 0 && rows.every((row) => row.id.startsWith("legacy-"));

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(member: TeamMemberRecord) {
    setEditing(member);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      {isLegacyOnly ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm font-medium text-amber-100">
            These profiles are still coming from static seed data.
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Import them into the CMS once, then you can add, remove, and change
            images permanently.
          </p>
          <Button
            className="mt-3"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await importStaticTeamMembers();
                if ("error" in result) {
                  toast.error(result.error);
                  return;
                }
                toast.success(`Imported ${result.count} team members`);
              })
            }
          >
            <Upload className="h-4 w-4" />
            Import team into CMS
          </Button>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={openCreate} disabled={isLegacyOnly && pending}>
          <Plus className="h-4 w-4" /> Add member
        </Button>
      </div>

      <DataTable
        data={rows}
        rowKey={(row) => row.id}
        columns={[
          {
            key: "image",
            label: "Photo",
            render: (row) => (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-strong)]">
                {row.imageUrl ? (
                  <Image
                    src={row.imageUrl}
                    alt={row.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="grid h-full place-items-center text-[10px] text-[var(--color-muted)]">
                    N/A
                  </span>
                )}
              </div>
            ),
          },
          { key: "name", label: "Name", sortable: true },
          { key: "role", label: "Role", sortable: true },
          { key: "email", label: "Email", sortable: true },
          {
            key: "active",
            label: "Status",
            render: (row) => (
              <StatusBadge status={row.active ? "PUBLISHED" : "DRAFT"} />
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[#A78BFA]"
                  onClick={() => openEdit(row)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-300"
                  onClick={() => setTargetDelete(row.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        emptyTitle="No team members"
        emptyDescription="Add your first team member to begin."
      />

      <SlideOver
        open={open}
        onOpenChange={(next) => {
          if (!next) closePanel();
          else setOpen(true);
        }}
        title={editing ? "Edit Team Member" : "Add Team Member"}
        description="Create or update a profile card shown on the public website."
      >
        <TeamMemberForm
          key={editing?.id ?? "new"}
          initial={
            editing
              ? {
                  id: editing.id,
                  name: editing.name,
                  role: editing.role,
                  bio: editing.bio,
                  email: editing.email,
                  imageUrl: editing.imageUrl,
                  linkedIn: editing.linkedIn,
                  twitter: editing.twitter,
                  displayOrder: editing.displayOrder,
                  active: editing.active,
                }
              : undefined
          }
          onSaved={closePanel}
        />
      </SlideOver>

      <ConfirmDialog
        open={Boolean(targetDelete)}
        onOpenChange={(next) => {
          if (!next) setTargetDelete(null);
        }}
        title="Delete member?"
        description="This action permanently removes the member profile."
        confirmLabel="Delete"
        loading={pending}
        onConfirm={() =>
          startTransition(async () => {
            if (!targetDelete) return;
            const result = await deleteTeamMember(targetDelete);
            if ("error" in result) {
              toast.error(`Failed to delete member: ${result.error}`);
              return;
            }
            toast.success("Team member deleted");
            setTargetDelete(null);
          })
        }
      />
    </div>
  );
}
