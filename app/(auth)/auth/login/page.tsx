import Link from "next/link";
import { redirect } from "next/navigation";
import { getSignInUrl, getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/services/auth";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard/inbox");
  }

  const signInUrl = await getSignInUrl({ returnTo: "/dashboard/inbox" });
  const signUpUrl = await getSignUpUrl({ returnTo: "/dashboard/inbox" });

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1240px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      <section className="app-shell subtle-grid grid min-h-[70vh] items-center gap-4 p-3 sm:p-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.8rem] border-white/60 p-6 sm:p-8 lg:p-10">
          <p className="inline-flex rounded-full bg-[#ececf7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#555684]">
            Secure Access
          </p>
          <h1 className="pt-5 text-4xl font-bold tracking-tight sm:text-5xl">Welcome to DHIFLOW</h1>
          <p className="pt-4 text-base text-muted sm:text-lg">
            Sign in to manage Instagram conversations, automation quality, and AI insights in real time.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={signInUrl}>
              <Button className="px-6 py-2.5">Continue with WorkOS</Button>
            </Link>
            <Link href={signUpUrl}>
              <Button className="px-6 py-2.5" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="rounded-[1.8rem] border-white/60 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">What you can do</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#f4e8cb] p-4">
              <p className="text-sm font-semibold">Auto-reply to comments and DMs with context-aware AI.</p>
            </div>
            <div className="rounded-2xl bg-[#d8e6ff] p-4">
              <p className="text-sm font-semibold">Monitor inbox, account health, and response quality in one place.</p>
            </div>
            <div className="rounded-2xl bg-[#ececf2] p-4">
              <p className="text-sm font-semibold">Audit every reply with confidence, risk, and send outcome.</p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
