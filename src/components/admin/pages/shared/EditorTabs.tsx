"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { adminTabTrigger } from "@/lib/admin-styles";

type EditorTabsProps = {
  tabs: Array<{ value: string; label: string }>;
  defaultValue: string;
  children: React.ReactNode;
};

export function EditorTabs({ tabs, defaultValue, children }: EditorTabsProps) {
  return (
    <Tabs.Root defaultValue={defaultValue} className="space-y-4">
      <Tabs.List className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={adminTabTrigger}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
}

export { Tabs };
