import { ImagePlus } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";

export default async function MediaAdminPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Media"
        subtitle="Central media library for team photos, logos, and featured assets."
      />
      <div className="admin-empty-state rounded-2xl border-dashed bg-[var(--color-surface-strong)] p-8 text-center">
        <ImagePlus className="mx-auto mb-3 h-8 w-8 text-[var(--color-muted)]" />
        <p className="text-sm text-[var(--color-muted)]">Drag and drop files here (coming next).</p>
        <Button variant="secondary" className="mt-3">
          Upload media
        </Button>
      </div>
    </div>
  );
}
