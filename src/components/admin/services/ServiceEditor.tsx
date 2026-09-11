"use client";

import { useState, useTransition } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { toast } from "sonner";
import { upsertServicePage } from "@/app/actions/services";
import { FormField } from "@/components/admin/ui/FormField";
import { PackagesEditor } from "@/components/admin/services/PackagesEditor";
import { RichTextarea } from "@/components/admin/ui/RichTextarea";
import { Button } from "@/components/ui/button";
import { adminTabTrigger } from "@/lib/admin-styles";
import { Input } from "@/components/ui/input";

type ServiceEditorProps = {
  slug: string;
  initial: {
    name: string;
    data: Record<string, unknown>;
  };
};

export function ServiceEditor({ slug, initial }: ServiceEditorProps) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initial.name);
  const [data, setData] = useState<Record<string, unknown>>(() => {
    if (!Array.isArray(initial.data.packages)) return initial.data;
    return {
      ...initial.data,
      packages: initial.data.packages.map((pkg, index) => {
        const entry = pkg as { id?: string; name?: string; features?: string[] };
        return {
          ...entry,
          id: entry.id?.trim() || `pkg-${index}-${entry.name?.trim() || "package"}`,
          features: Array.isArray(entry.features) ? entry.features : [],
        };
      }),
    };
  });

  function save() {
    startTransition(async () => {
      const result = await upsertServicePage(slug, { name, data });
      if ("error" in result) {
        toast.error(`✗ Failed to save service: ${result.error}`);
        return;
      }
      toast.success("✓ Service page saved");
    });
  }

  return (
    <Tabs.Root defaultValue="overview" className="space-y-4">
      <Tabs.List className="flex flex-wrap gap-2">
        {["overview", "packages", "process", "deliverables", "faq", "cta"].map((tab) => (
          <Tabs.Trigger
            key={tab}
            value={tab}
            className={adminTabTrigger}
          >
            {tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value="overview" className="space-y-4">
        <FormField label="Page title" dirty>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField label="Subtitle" dirty>
          <RichTextarea
            value={String(data.subtitle ?? "")}
            onChange={(value) => setData((prev) => ({ ...prev, subtitle: value }))}
          />
        </FormField>
      </Tabs.Content>
      <Tabs.Content value="packages">
        <PackagesEditor
          value={Array.isArray(data.packages) ? (data.packages as never[]) : []}
          onChange={(value) => setData((prev) => ({ ...prev, packages: value }))}
        />
      </Tabs.Content>
      <Tabs.Content value="process">
        <FormField label="Process heading" dirty>
          <Input
            value={String(data.processTitle ?? "")}
            onChange={(event) => setData((prev) => ({ ...prev, processTitle: event.target.value }))}
          />
        </FormField>
      </Tabs.Content>
      <Tabs.Content value="deliverables">
        <FormField label="Deliverables title" dirty>
          <Input
            value={String(data.deliverablesTitle ?? "")}
            onChange={(event) =>
              setData((prev) => ({ ...prev, deliverablesTitle: event.target.value }))
            }
          />
        </FormField>
      </Tabs.Content>
      <Tabs.Content value="faq">
        <FormField label="FAQ title" dirty>
          <Input
            value={String(data.faqTitle ?? "")}
            onChange={(event) => setData((prev) => ({ ...prev, faqTitle: event.target.value }))}
          />
        </FormField>
      </Tabs.Content>
      <Tabs.Content value="cta">
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="CTA headline" dirty>
            <Input
              value={String(data.ctaTitle ?? "")}
              onChange={(event) => setData((prev) => ({ ...prev, ctaTitle: event.target.value }))}
            />
          </FormField>
          <FormField label="CTA button label" dirty>
            <Input
              value={String(data.ctaButton ?? "")}
              onChange={(event) =>
                setData((prev) => ({ ...prev, ctaButton: event.target.value }))
              }
            />
          </FormField>
        </div>
      </Tabs.Content>
      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </Tabs.Root>
  );
}
