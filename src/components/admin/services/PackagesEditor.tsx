"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PackageItem = {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
};

type PackagesEditorProps = {
  value: PackageItem[];
  onChange: (value: PackageItem[]) => void;
};

function normalizePackages(items: unknown[]): PackageItem[] {
  return items.map((raw, index) => {
    const pkg = raw as Partial<PackageItem>;
    return {
      id: pkg.id?.trim() || `pkg-${index}-${pkg.name?.trim() || "package"}`,
      name: pkg.name ?? "",
      price: pkg.price ?? "",
      period: pkg.period ?? "",
      features: Array.isArray(pkg.features) ? pkg.features : [],
      isPopular: Boolean(pkg.isPopular),
    };
  });
}

export function PackagesEditor({ value, onChange }: PackagesEditorProps) {
  const packages = normalizePackages(value);

  function sync(next: PackageItem[]) {
    onChange(normalizePackages(next));
  }

  return (
    <div className="space-y-3">
      {packages.map((pkg, index) => (
        <div key={pkg.id || `package-row-${index}`} className="admin-panel space-y-3 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-[var(--color-muted)]">{pkg.name || "Package"}</p>
            <button
              type="button"
              onClick={() => sync(packages.filter((_, i) => i !== index))}
              className="text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <Input
              value={pkg.name}
              placeholder="Name"
              onChange={(event) =>
                sync(
                  packages.map((entry, i) =>
                    i === index ? { ...entry, name: event.target.value } : entry
                  )
                )
              }
            />
            <Input
              value={pkg.price}
              placeholder="$299"
              onChange={(event) =>
                sync(
                  packages.map((entry, i) =>
                    i === index ? { ...entry, price: event.target.value } : entry
                  )
                )
              }
            />
            <Input
              value={pkg.period}
              placeholder="/week"
              onChange={(event) =>
                sync(
                  packages.map((entry, i) =>
                    i === index ? { ...entry, period: event.target.value } : entry
                  )
                )
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <input
              type="checkbox"
              checked={Boolean(pkg.isPopular)}
              onChange={(event) =>
                sync(
                  packages.map((entry, i) =>
                    i === index ? { ...entry, isPopular: event.target.checked } : entry
                  )
                )
              }
            />
            Most popular
          </label>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Features
            </p>
            {pkg.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex gap-2">
                <Input
                  value={feature}
                  placeholder="Feature"
                  onChange={(event) =>
                    sync(
                      packages.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              features: entry.features.map((f, fi) =>
                                fi === featureIndex ? event.target.value : f
                              ),
                            }
                          : entry
                      )
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    sync(
                      packages.map((entry, i) =>
                        i === index
                          ? {
                              ...entry,
                              features: entry.features.filter((_, fi) => fi !== featureIndex),
                            }
                          : entry
                      )
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                sync(
                  packages.map((entry, i) =>
                    i === index ? { ...entry, features: [...entry.features, ""] } : entry
                  )
                )
              }
            >
              <Plus className="h-4 w-4" /> Add feature
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          sync([
            ...packages,
            {
              id: `pkg-${Date.now()}`,
              name: "",
              price: "",
              period: "/week",
              features: [],
              isPopular: false,
            },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add package
      </Button>
    </div>
  );
}
