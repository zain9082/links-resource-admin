"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { upsertCaseStudy } from "@/app/actions/case-studies";
import { DataTable } from "@/components/admin/ui/DataTable";
import { FormField } from "@/components/admin/ui/FormField";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CaseStudyRow = {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  metrics: unknown;
  published: boolean;
};

export function CaseStudiesAdminClient({ rows }: { rows: CaseStudyRow[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    clientName: "",
    industry: "",
    title: "",
    challenge: "",
    solution: "",
    results: "",
    metric1Label: "",
    metric1Value: "",
    published: false,
  });

  function save() {
    startTransition(async () => {
      const result = await upsertCaseStudy({
        clientName: form.clientName,
        industry: form.industry,
        title: form.title,
        challenge: form.challenge,
        solution: form.solution,
        results: form.results,
        metrics: [
          { label: form.metric1Label || "Metric", value: form.metric1Value || "Value" },
        ],
        published: form.published,
      });
      if ("error" in result) {
        toast.error(`✗ Failed to save case study: ${result.error}`);
        return;
      }
      toast.success("✓ Case study saved");
      setOpen(false);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> New Case Study
        </Button>
      </div>
      <DataTable
        data={rows}
        rowKey={(row) => row.id}
        emptyTitle="No case studies"
        emptyDescription="Create your first case study to showcase results."
        columns={[
          { key: "title", label: "Title", sortable: true },
          { key: "clientName", label: "Client", sortable: true },
          { key: "industry", label: "Industry" },
          {
            key: "metric",
            label: "Result",
            render: (row) => {
              const metric = Array.isArray(row.metrics)
                ? (row.metrics[0] as { value?: string } | undefined)
                : undefined;
              return metric?.value ?? "-";
            },
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.published ? "PUBLISHED" : "DRAFT"} />,
          },
        ]}
      />
      <SlideOver
        open={open}
        onOpenChange={setOpen}
        title="Create Case Study"
        description="Capture challenge, solution, results, and KPI metrics."
      >
        <div className="space-y-3">
          <FormField label="Client name" dirty>
            <Input
              value={form.clientName}
              onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
            />
          </FormField>
          <FormField label="Industry" dirty>
            <Input
              value={form.industry}
              onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
            />
          </FormField>
          <FormField label="Project title" dirty>
            <Input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </FormField>
          <FormField label="Challenge" dirty>
            <RichTextarea
              value={form.challenge}
              onChange={(challenge) => setForm((prev) => ({ ...prev, challenge }))}
            />
          </FormField>
          <FormField label="Solution" dirty>
            <RichTextarea
              value={form.solution}
              onChange={(solution) => setForm((prev) => ({ ...prev, solution }))}
            />
          </FormField>
          <FormField label="Results" dirty>
            <RichTextarea
              value={form.results}
              onChange={(results) => setForm((prev) => ({ ...prev, results }))}
            />
          </FormField>
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              placeholder="Metric label"
              value={form.metric1Label}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, metric1Label: event.target.value }))
              }
            />
            <Input
              placeholder="Metric value"
              value={form.metric1Value}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, metric1Value: event.target.value }))
              }
            />
          </div>
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving..." : "Save Case Study"}
          </Button>
        </div>
      </SlideOver>
    </div>
  );
}
