"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyTitle: string;
  emptyDescription: string;
  pageSize?: number;
  rowKey: (row: T) => string;
};

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyTitle,
  emptyDescription,
  pageSize = 10,
  rowKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const searchable = data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(lower)
    );

    if (!sortKey) return searchable;
    return [...searchable].sort((a, b) => {
      const left = String(a[sortKey as keyof T] ?? "");
      const right = String(b[sortKey as keyof T] ?? "");
      const value = left.localeCompare(right, undefined, { numeric: true });
      return sortDir === "asc" ? value : -value;
    });
  }, [data, query, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (data.length === 0) {
    return (
      <div className="admin-card rounded-2xl border-dashed p-10 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--color-surface)]" />
        <h3 className="text-lg font-medium text-[var(--color-foreground)]">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="admin-card rounded-2xl">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-3">
        <Search className="h-4 w-4 text-[var(--color-muted)]" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search..."
          className="h-9 border-transparent bg-transparent focus:border-[var(--color-border)]"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--color-bg-sidebar)]">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-[var(--color-muted)]",
                    column.sortable ? "cursor-pointer select-none" : ""
                  )}
                  onClick={
                    column.sortable
                      ? () => {
                          const nextKey = String(column.key);
                          if (sortKey === nextKey) {
                            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
                            return;
                          }
                          setSortKey(nextKey);
                          setSortDir("asc");
                        }
                      : undefined
                  }
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-row-hover)]"
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-[var(--color-foreground)]">
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] p-3 text-xs text-[var(--color-muted)]">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
