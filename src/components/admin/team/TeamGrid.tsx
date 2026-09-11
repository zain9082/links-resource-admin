import { Mail } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

type TeamCard = {
  id: string;
  name: string;
  role: string;
  email: string;
  imageUrl: string | null;
  active: boolean;
};

export function TeamGrid({ members }: { members: TeamCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div key={member.id} className="admin-panel-lg p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#7C3AED]/30 text-sm font-semibold text-[var(--color-foreground)]">
              {member.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-[var(--color-foreground)]">{member.name}</p>
              <p className="text-sm text-[var(--color-muted)]">{member.role}</p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Mail className="h-4 w-4" />
            {member.email}
          </p>
          <div className="mt-3">
            <StatusBadge status={member.active ? "PUBLISHED" : "DRAFT"} />
          </div>
        </div>
      ))}
    </div>
  );
}
