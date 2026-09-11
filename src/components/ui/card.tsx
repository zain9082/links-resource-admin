import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "admin-panel-lg p-5 backdrop-blur-xl shadow-[0_8px_30px_-20px_rgba(124,58,237,0.8)]",
        className
      )}
      {...props}
    />
  );
}
