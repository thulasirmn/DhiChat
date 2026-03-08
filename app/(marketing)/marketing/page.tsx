import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  "Unified inbox for comments and DMs",
  "Lead-gen AI replies with strict fallback safety",
  "Full audit trail for every outbound response"
];

const stats = [
  { label: "Avg reply speed", value: "< 30s" },
  { label: "Automation accuracy", value: "96.7%" },
  { label: "Accounts managed", value: "12+" }
];

export default function MarketingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1240px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      <section className="app-shell subtle-grid grid gap-4 p-3 sm:p-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-[1.8rem] border-white/60 p-6 sm:p-8 lg:p-10">
          <p className="inline-flex rounded-full bg-[#ececf7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#555684]">
            Instagram Automation Platform
          </p>
          <h1 className="pt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Elegant AI operations for every Instagram conversation.
          </h1>
          <p className="max-w-2xl pt-5 text-base text-muted sm:text-lg">
            Connect your Instagram accounts, classify intent from DMs and comments, and auto-respond in real time with
            strict safety fallback and complete audit visibility.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/login">
              <Button className="px-6 py-2.5">Start with WorkOS</Button>
            </Link>
            <Link href="/dashboard/inbox">
              <Button className="px-6 py-2.5" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div className="rounded-2xl border border-border bg-white p-4" key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className="pt-2 text-2xl font-bold tracking-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[1.8rem] border-white/60 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Core Capabilities</p>
          <div className="mt-4 space-y-3">
            {highlights.map((item, index) => (
              <div
                className="rounded-2xl border border-border bg-white p-4"
                key={item}
                style={{ backgroundColor: index === 0 ? "#f4e8cb" : index === 1 ? "#d8e6ff" : "#ececf2" }}
              >
                <p className="text-sm font-semibold text-[#26273a]">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-gradient-to-br from-[#6a67b6] via-[#7b80d9] to-[#748fca] p-5 text-white">
            <p className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">PRO</p>
            <p className="pt-3 text-2xl font-bold leading-tight">Scale support and lead-gen without scaling headcount.</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
