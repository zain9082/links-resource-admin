"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import { ChevronLeft, ChevronRight, Download, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { deletePublication, upsertPublication } from "@/app/actions/publications";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { InlineEdit } from "@/components/admin/ui/InlineEdit";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";

type PublicationRow = {
  id: string;
  siteName: string;
  url: string;
  da: number;
  dr: number | null;
  niche: string;
  type: string;
  tat: number;
  price: number;
  doFollow: boolean;
  sponsored: boolean;
  traffic: string | null;
  notes: string | null;
  active: boolean;
};

export function PublicationsAdminClient({ initialRows }: { initialRows: PublicationRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<PublicationRow | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function saveDraft(draft: PublicationRow) {
    startTransition(async () => {
      const result = await upsertPublication(draft);
      if ("error" in result) {
        toast.error(`✗ Failed to save publication: ${result.error}`);
        return;
      }
      toast.success("✓ Publication saved");
      setSlideOpen(false);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search publications..."
          className="max-w-sm"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <Button
          variant="secondary"
          onClick={() => {
            const csv = Papa.unparse(rows);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "publications.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" /> Import CSV
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setEditing({
              id: "",
              siteName: "",
              url: "",
              da: 0,
              dr: null,
              niche: "",
              type: "Guest Post",
              tat: 7,
              price: 0,
              doFollow: true,
              sponsored: false,
              traffic: "",
              notes: "",
              active: true,
            });
            setSlideOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add publication
        </Button>
        {selected.length > 0 ? (
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Bulk delete ({selected.length})
          </Button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          Papa.parse<PublicationRow>(file, {
            header: true,
            complete: (result) => {
              const imported = result.data.filter((row) => row.siteName);
              setRows((prev) => [...imported, ...prev]);
              toast.success(`✓ Imported ${imported.length} rows`);
            },
          });
        }}
      />

      <div className="admin-card overflow-x-auto rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-[var(--color-bg-sidebar)]">
            <tr className="text-left text-[var(--color-muted)]">
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={(event) =>
                    setSelected(event.target.checked ? filtered.map((row) => row.id) : [])
                  }
                />
              </th>
              {["Site name", "DA", "Niche", "TAT", "Type", "Price", "DoFollow", "Traffic"].map(
                (header) => (
                  <th key={header} className="px-3 py-3">
                    {header}
                  </th>
                )
              )}
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--color-border)] hover:bg-[#7C3AED]/10">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={(event) =>
                      setSelected((prev) =>
                        event.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <InlineEdit
                    value={row.siteName}
                    onSave={(value) => {
                      setRows((prev) =>
                        prev.map((entry) =>
                          entry.id === row.id ? { ...entry, siteName: value } : entry
                        )
                      );
                      return upsertPublication({ ...row, siteName: value }).then(() => undefined);
                    }}
                  />
                </td>
                <td className="px-3 py-2">{row.da}</td>
                <td className="px-3 py-2">{row.niche}</td>
                <td className="px-3 py-2">{row.tat}d</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">${row.price}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.doFollow ? "PUBLISHED" : "DRAFT"} />
                </td>
                <td className="px-3 py-2">{row.traffic ?? "-"}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    onClick={() => {
                      setEditing(row);
                      setSlideOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} publications
        </span>
        <div className="flex items-center gap-3">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <SlideOver
        open={slideOpen}
        onOpenChange={setSlideOpen}
        title="Edit publication"
        description="Update publication fields and save changes."
      >
        {editing ? (
          <PublicationEditor
            value={editing}
            onChange={setEditing}
            onSave={() => saveDraft(editing)}
            pending={pending}
          />
        ) : null}
      </SlideOver>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete selected publications?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={pending}
        onConfirm={() =>
          startTransition(async () => {
            for (const id of selected) {
              await deletePublication(id);
            }
            setRows((prev) => prev.filter((row) => !selected.includes(row.id)));
            setSelected([]);
            setDeleteOpen(false);
            toast.success("✓ Selected publications deleted");
          })
        }
      />
    </div>
  );
}

function PublicationEditor({
  value,
  onChange,
  onSave,
  pending,
}: {
  value: PublicationRow;
  onChange: (value: PublicationRow) => void;
  onSave: () => void;
  pending: boolean;
}) {
  return (
    <div className="space-y-3">
      <Input value={value.siteName} onChange={(e) => onChange({ ...value, siteName: e.target.value })} />
      <Input value={value.url} onChange={(e) => onChange({ ...value, url: e.target.value })} />
      <div className="grid gap-2 md:grid-cols-2">
        <Input
          type="number"
          value={value.da}
          onChange={(e) => onChange({ ...value, da: Number(e.target.value) })}
        />
        <Input
          type="number"
          value={value.dr ?? 0}
          onChange={(e) => onChange({ ...value, dr: Number(e.target.value) })}
        />
      </div>
      <Input value={value.niche} onChange={(e) => onChange({ ...value, niche: e.target.value })} />
      <div className="grid gap-2 md:grid-cols-2">
        <Input
          type="number"
          value={value.tat}
          onChange={(e) => onChange({ ...value, tat: Number(e.target.value) })}
        />
        <Input
          type="number"
          value={value.price}
          onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
        />
      </div>
      <Input value={value.type} onChange={(e) => onChange({ ...value, type: e.target.value })} />
      <RichTextarea
        value={value.notes ?? ""}
        onChange={(notes) => onChange({ ...value, notes })}
      />
      <Button onClick={onSave} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
