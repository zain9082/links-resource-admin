import Link from "next/link";
import { Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

type ServiceItem = {
  slug: string;
  name: string;
  updatedAt: Date;
};

export function ServiceList({ services }: { services: ServiceItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.slug}
          className="admin-panel-lg p-4 backdrop-blur-xl"
        >
          <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">{service.slug}</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">{service.name}</h3>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Last edited: {formatDate(service.updatedAt)}
          </p>
          <Link
            href={`/admin/services/${service.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-nav-hover)]"
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
        </div>
      ))}
    </div>
  );
}
