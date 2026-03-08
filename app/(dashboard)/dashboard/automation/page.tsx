import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageShell } from "@/components/dashboard/page-shell";
import { requireSession } from "@/lib/services/auth";

export default async function AutomationPage() {
  const session = await requireSession();

  return (
    <PageShell
      pathname="/dashboard/automation"
      title="Automation Settings"
      subtitle="Define tone, language behavior, and strict fallback policy for every auto-reply."
      session={session}
    >
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[1.6rem] p-4 sm:p-5">
          <p className="text-2xl font-bold tracking-tight">Brand Voice</p>
          <p className="pt-1 text-sm text-muted">Prompt profile used by AI for DM and comment responses.</p>

          <div className="mt-4 space-y-3">
            <Input defaultValue="Calm, concise, premium" />
            <Textarea
              rows={7}
              defaultValue="Use confident language, keep replies short, and ask one conversion-oriented follow-up question."
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button>Save Voice Settings</Button>
            <Button variant="outline">Reset to Default</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[1.6rem] p-4 sm:p-5">
            <p className="text-2xl font-bold tracking-tight">Safety Policy</p>
            <div className="mt-4 rounded-2xl bg-[#ececf2] p-4">
              <p className="text-sm font-semibold">Strict fallback is active</p>
              <p className="pt-1 text-sm text-muted">Low-confidence or risky intent returns safe template responses.</p>
            </div>
            <Button className="mt-4" variant="outline">
              Configure Rules
            </Button>
          </Card>

          <Card className="rounded-[1.6rem] p-4 sm:p-5">
            <p className="text-2xl font-bold tracking-tight">Language Mode</p>
            <div className="mt-4 rounded-2xl bg-[#d8e6ff] p-4">
              <p className="text-sm font-semibold text-[#2f3a5f]">Auto detect + same-language reply</p>
              <p className="pt-1 text-sm text-[#4b5a84]">Current workspace behavior for all connected accounts.</p>
            </div>
            <p className="mt-3 truncate text-xs text-muted">Organization: {session.organizationId ?? "No active organization"}</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
