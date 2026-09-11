"use client";

import { useSyncExternalStore } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  if (!isClient) return null;

  const isLight = resolvedTheme === "light";

  return (
    <Toaster
      position="bottom-center"
      theme={isLight ? "light" : "dark"}
      toastOptions={{
        style: isLight
          ? {
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(15,23,42,0.1)",
              color: "#0f172a",
            }
          : {
              background: "rgba(11,11,16,0.9)",
              border: "1px solid rgba(124,58,237,0.25)",
              backdropFilter: "blur(12px)",
            },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="lr-admin-theme">
      <SessionProvider>
        <ThemedToaster />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
