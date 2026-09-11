import { BarChart3, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSafeCallbackUrl } from "@/lib/safe-callback-url";

const FEATURES = [
  { icon: Sparkles, label: "Homepage & services content" },
  { icon: Globe2, label: "Publications & SEO management" },
  { icon: BarChart3, label: "Resources & submissions workflow" },
  { icon: ShieldCheck, label: "Secure admin-only access" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl);

  return (
    <main className="flex min-h-screen bg-[#06070d]">
      {/* Left panel — brand (gradient only, no image) */}
      <section className="relative hidden w-[52%] overflow-hidden lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[#06070d]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#0f0a1f] to-[#2563EB]/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(124,58,237,0.35),transparent_42%),radial-gradient(circle_at_85%_75%,rgba(219,39,119,0.22),transparent_45%),radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.12),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] text-sm font-bold text-white shadow-lg shadow-purple-500/30">
                LR
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Links Resource LTD</p>
                <p className="text-xs text-slate-300/80">Digital Marketing & Link Building</p>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl">
              Your content command center
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300/90">
              Manage every page, service, publication, and resource from one
              professional admin portal — built for growth teams.
            </p>

            <ul className="mt-10 space-y-4">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
                    <Icon className="h-4 w-4 text-[#c4b5fd]" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-400/70">
            © {new Date().getFullYear()} Links Resource LTD · linksresource.com
          </p>
        </div>
      </section>

      {/* Right panel — login form */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(124,58,237,0.12),transparent_45%),radial-gradient(circle_at_30%_90%,rgba(37,99,235,0.08),transparent_40%)]" />

        <div className="relative w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] text-xs font-bold text-white">
              LR
            </div>
            <span className="font-semibold text-white">Links Resource Admin</span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a78bfa]">
              Admin Portal
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <LoginForm callbackUrl={callbackUrl} />

          <p className="mt-8 text-center text-xs text-slate-500">
            Protected area · Authorised personnel only
          </p>
        </div>
      </section>
    </main>
  );
}
