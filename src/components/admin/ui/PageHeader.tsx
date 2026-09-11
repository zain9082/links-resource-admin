import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  actionLabel,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-3">
        {backHref ? (
          <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-[var(--color-muted)]">
            <Link href={backHref}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)] md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
        </div>
      </div>
      {actionLabel ? (
        <Button onClick={onAction} className="min-w-36">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
