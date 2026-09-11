"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createRedirect,
  deleteRedirect,
  exportRedirectsCsv,
  importRedirectsCsv,
  toggleRedirect,
  updateRedirect,
} from "@/app/actions/seo";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FormField } from "@/components/admin/ui/FormField";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { SectionCard } from "@/components/admin/pages/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RedirectRow = {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  permanent: boolean;
  isRegex: boolean;
  active: boolean;
  hitCount: number;
  lastHitAt: string | null;
};

type RedirectFormState = {
  source: string;
  destination: string;
  statusCode: 301 | 302 | 410;
  isRegex: boolean;
  active: boolean;
};

const emptyForm: RedirectFormState = {
  source: "",
  destination: "",
  statusCode: 301,
  isRegex: false,
  active: true,
};

export function RedirectsAdminClient({
  redirects: initialRedirects,
}: {
  redirects: RedirectRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [redirects, setRedirects] = useState(initialRedirects);
  const [form, setForm] = useState<RedirectFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        ...form,
        destination: form.statusCode === 410 ? "" : form.destination,
      };
      const result = editingId
        ? await updateRedirect(editingId, payload)
        : await createRedirect(payload);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(editingId ? "Redirect updated" : "Redirect created");
      resetForm();
      window.location.reload();
    });
  }

  function onToggle(id: string) {
    startTransition(async () => {
      const result = await toggleRedirect(id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setRedirects((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, active: Boolean(result.active) } : row
        )
      );
      toast.success(result.active ? "Redirect enabled" : "Redirect disabled");
    });
  }

  function onDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteRedirect(deleteId);
      setDeleteId(null);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setRedirects((prev) => prev.filter((row) => row.id !== deleteId));
      toast.success("Redirect deleted");
    });
  }

  function onImport() {
    startTransition(async () => {
      const result = await importRedirectsCsv(csvText);
      if (result.errors.length > 0) {
        toast.error(result.errors[0] ?? "Import failed");
        if (result.errors.length > 1) {
          console.error(result.errors);
        }
        return;
      }
      toast.success(
        `Imported ${result.imported}, skipped ${result.skipped} existing`
      );
      setCsvText("");
      window.location.reload();
    });
  }

  function onExport() {
    startTransition(async () => {
      const result = await exportRedirectsCsv();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "redirects.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Redirects exported");
    });
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""));
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title={editingId ? "Edit redirect" : "Add redirect"}
        description="Use local paths like /old-page → /new-page. Choose 410 to mark a URL as permanently removed."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="From (source)">
            <Input
              value={form.source}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, source: event.target.value }))
              }
              placeholder="/old-path"
            />
          </FormField>
          <FormField label="To (destination)">
            <Input
              value={form.destination}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, destination: event.target.value }))
              }
              placeholder={form.statusCode === 410 ? "(empty for 410)" : "/new-path"}
              disabled={form.statusCode === 410}
            />
          </FormField>
          <FormField label="Status">
            <select
              value={form.statusCode}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  statusCode: Number(event.target.value) as 301 | 302 | 410,
                  destination:
                    Number(event.target.value) === 410 ? "" : prev.destination,
                }))
              }
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 text-sm text-[var(--color-foreground)]"
            >
              <option value={301}>301 Permanent</option>
              <option value={302}>302 Temporary</option>
              <option value={410}>410 Gone</option>
            </select>
          </FormField>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isRegex}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, isRegex: event.target.checked }))
                }
              />
              Wildcard source (/section/*)
            </label>
            <p className="text-xs text-[var(--color-muted)]">
              Supports trailing wildcards only (e.g. /product/*). Raw regex is not allowed.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, active: event.target.checked }))
                }
              />
              Active
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={submit} disabled={pending}>
            {editingId ? "Update redirect" : "Add redirect"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm} disabled={pending}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Import / export CSV"
        description="Columns: source, destination, statusCode, isRegex, active"
      >
        <textarea
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
          placeholder={"source,destination,statusCode,isRegex,active\n/old,/new,301,false,true"}
          className="min-h-28 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 font-mono text-xs text-[var(--color-foreground)] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30"
        />
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
          >
            Load CSV file
          </Button>
          <Button onClick={onImport} disabled={pending || !csvText.trim()}>
            Import CSV
          </Button>
          <Button variant="secondary" onClick={onExport} disabled={pending}>
            Export CSV
          </Button>
        </div>
      </SectionCard>

      <div className="space-y-2">
        {redirects.map((row) => (
          <div
            key={row.id}
            className="flex flex-col gap-3 admin-panel p-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="mono text-sm text-[var(--color-foreground)]">
                {row.source}{" "}
                <span className="text-[var(--color-muted)]">
                  → {row.statusCode === 410 ? "(gone)" : row.destination}
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {row.statusCode}
                {row.isRegex ? " · wildcard" : ""} · {row.hitCount} hits
                {row.lastHitAt
                  ? ` · last ${new Date(row.lastHitAt).toLocaleString()}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={row.active ? "PUBLISHED" : "DRAFT"} />
              <Button
                size="sm"
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  setEditingId(row.id);
                  setForm({
                    source: row.source,
                    destination: row.destination,
                    statusCode: (row.statusCode === 302 || row.statusCode === 410
                      ? row.statusCode
                      : 301) as 301 | 302 | 410,
                    isRegex: row.isRegex,
                    active: row.active,
                  });
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={pending}
                onClick={() => onToggle(row.id)}
              >
                {row.active ? "Disable" : "Enable"}
              </Button>
              <Button
                size="sm"
                variant="danger"
                disabled={pending}
                onClick={() => setDeleteId(row.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {redirects.length === 0 ? (
          <div className="admin-empty-state rounded-xl border-dashed p-6 text-sm text-[var(--color-muted)]">
            No redirects configured yet.
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete redirect?"
        description="This permanently removes the redirect rule."
        confirmLabel="Delete"
        onConfirm={onDelete}
        loading={pending}
      />
    </div>
  );
}
