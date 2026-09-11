export default function LoadingAdminShell() {
  return (
    <div className="space-y-4">
      <div className="h-14 admin-skeleton rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 admin-skeleton rounded-2xl" />
        ))}
      </div>
      <div className="h-64 admin-skeleton rounded-2xl" />
    </div>
  );
}
