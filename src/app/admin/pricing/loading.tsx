export default function LoadingPricingAdminPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-72 admin-skeleton rounded-2xl" />
      ))}
    </div>
  );
}
