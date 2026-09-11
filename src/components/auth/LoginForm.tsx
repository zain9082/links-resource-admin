"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSafeCallbackUrl } from "@/lib/safe-callback-url";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            callbackUrl: safeCallbackUrl,
            redirect: false,
          });
          if (!result || result.error) {
            toast.error("Invalid credentials. Please try again.");
            return;
          }
          window.location.assign(getSafeCallbackUrl(result.url ?? safeCallbackUrl));
        });
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Email address</span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="email"
            autoComplete="email"
            placeholder="admin@linksresource.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border-white/10 bg-white/[0.04] pl-10 text-[15px] placeholder:text-slate-600"
            required
          />
        </div>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Password</span>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border-white/10 bg-white/[0.04] pl-10 pr-11 text-[15px] placeholder:text-slate-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      <Button
        type="submit"
        size="lg"
        className="mt-2 h-12 w-full text-[15px] font-semibold"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Continue to dashboard"}
      </Button>
    </form>
  );
}
