"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { upsertPricingPlan } from "@/app/actions/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Plan = {
  id: string;
  name: string;
  price: string;
  billingNote: string | null;
  features: unknown;
  isPopular: boolean;
  ctaLabel: string;
  ctaHref: string;
  color: string;
};

export function PricingAdminClient({ plans }: { plans: Plan[] }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(plans);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((plan) => (
        <div key={plan.id} className="admin-panel-lg p-4">
          <Input
            value={plan.name}
            onChange={(event) =>
              setItems((prev) =>
                prev.map((entry) =>
                  entry.id === plan.id ? { ...entry, name: event.target.value } : entry
                )
              )
            }
          />
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <Input
              value={plan.price}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === plan.id ? { ...entry, price: event.target.value } : entry
                  )
                )
              }
            />
            <Input
              value={plan.billingNote ?? ""}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === plan.id ? { ...entry, billingNote: event.target.value } : entry
                  )
                )
              }
            />
          </div>
          <div className="mt-3 space-y-2">
            {Array.isArray(plan.features) ? (
              (plan.features as string[]).map((feature, index) => (
                <div key={`${plan.id}-${index}`} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry) =>
                          entry.id === plan.id
                            ? {
                                ...entry,
                                features: (entry.features as string[]).map((value, valueIndex) =>
                                  valueIndex === index ? event.target.value : value
                                ),
                              }
                            : entry
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-red-300"
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((entry) =>
                          entry.id === plan.id
                            ? {
                                ...entry,
                                features: (entry.features as string[]).filter(
                                  (_, valueIndex) => valueIndex !== index
                                ),
                              }
                            : entry
                        )
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--color-muted)]">No features</p>
            )}
            <Button
              variant="secondary"
              onClick={() =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === plan.id
                      ? { ...entry, features: [...(entry.features as string[]), "New feature"] }
                      : entry
                  )
                )
              }
            >
              <Plus className="h-4 w-4" /> Add feature
            </Button>
          </div>
          <Button
            className="mt-4 w-full"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await upsertPricingPlan({
                  id: plan.id,
                  name: plan.name,
                  price: plan.price,
                  billingNote: plan.billingNote ?? undefined,
                  features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
                  isPopular: plan.isPopular,
                  ctaLabel: plan.ctaLabel,
                  ctaHref: plan.ctaHref,
                  color: plan.color,
                  displayOrder: 0,
                });
                if ("error" in result) {
                  toast.error(`✗ Failed to save plan: ${result.error}`);
                  return;
                }
                toast.success("✓ Pricing plan saved");
              })
            }
          >
            Save Plan
          </Button>
        </div>
      ))}
    </div>
  );
}
