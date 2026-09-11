"use client";

import { useMemo, useState, useTransition } from "react";
import { Role } from "@prisma/client";
import { toast } from "sonner";
import {
  deleteUser,
  resetUserPassword,
  updateUserRole,
} from "@/app/actions/users";
import { DataTable } from "@/components/admin/ui/DataTable";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  _count: { favorites: number };
  favorites: Array<{ resource: { title: string } }>;
};

export function UsersAdminClient({ rows }: { rows: UserRow[] }) {
  const [filter, setFilter] = useState<"ALL" | Role>("ALL");
  const [targetUser, setTargetUser] = useState<UserRow | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((row) => row.role === filter)),
    [rows, filter]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["ALL", "USER", "ADMIN"] as const).map((item) => (
          <Button
            key={item}
            variant={filter === item ? "primary" : "secondary"}
            onClick={() => setFilter(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <DataTable
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No users found"
        emptyDescription="Users will appear here after signup."
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (row) => (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#7C3AED]/30 text-xs">
                {(row.name ?? row.email).slice(0, 1).toUpperCase()}
              </span>
            ),
          },
          { key: "name", label: "Name", render: (row) => row.name ?? "Unnamed" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "joined",
            label: "Joined",
            render: (row) => new Date(row.createdAt).toLocaleDateString("en-GB"),
          },
          { key: "favorites", label: "Favorites", render: (row) => row._count.favorites },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  className="text-blue-300"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await updateUserRole(
                        row.id,
                        row.role === "ADMIN" ? "USER" : "ADMIN"
                      );
                      if ("error" in result) {
                        toast.error(`✗ Role update failed: ${result.error}`);
                        return;
                      }
                      toast.success("✓ User role updated");
                    })
                  }
                >
                  {row.role === "ADMIN" ? "Demote" : "Promote"}
                </button>
                <button
                  type="button"
                  className="text-amber-300"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await resetUserPassword(row.id);
                      if ("error" in result) {
                        toast.error(`✗ Password reset failed: ${result.error}`);
                        return;
                      }
                      toast.success(`✓ Temp password: ${result.tempPassword}`);
                    })
                  }
                >
                  Reset password
                </button>
                <button type="button" className="text-[var(--color-muted)]" onClick={() => setTargetUser(row)}>
                  Favorites
                </button>
              </div>
            ),
          },
        ]}
      />
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="mb-2 text-sm text-red-200">
          Delete account (hard confirm: type exact email).
        </p>
        <div className="flex gap-2">
          <Input
            value={confirmName}
            onChange={(event) => setConfirmName(event.target.value)}
            placeholder="Type email to confirm"
            className="max-w-xs"
          />
          <Button
            variant="danger"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const user = rows.find((entry) => entry.email === confirmName);
                if (!user) {
                  toast.error("User email mismatch");
                  return;
                }
                const result = await deleteUser(user.id);
                if ("error" in result) {
                  toast.error(`✗ Delete failed: ${result.error}`);
                  return;
                }
                toast.success("✓ User account deleted");
              })
            }
          >
            Delete account
          </Button>
        </div>
      </div>
      <SlideOver
        open={Boolean(targetUser)}
        onOpenChange={(open) => {
          if (!open) setTargetUser(null);
        }}
        title={targetUser ? `${targetUser.name ?? targetUser.email} favorites` : "Favorites"}
      >
        <ul className="space-y-2">
          {(targetUser?.favorites ?? []).map((entry) => (
            <li key={entry.resource.title} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-2 text-sm text-[var(--color-foreground)]">
              {entry.resource.title}
            </li>
          ))}
          {(targetUser?.favorites ?? []).length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No favorites yet.</p>
          ) : null}
        </ul>
      </SlideOver>
    </div>
  );
}
