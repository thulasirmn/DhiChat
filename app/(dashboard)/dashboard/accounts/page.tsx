import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/dashboard/page-shell";
import { requireSession } from "@/lib/services/auth";
import { getAccountsData } from "@/lib/services/dashboard";

export default async function AccountsPage() {
  const session = await requireSession();
  const { accounts } = await getAccountsData();

  return (
    <PageShell
      pathname="/dashboard/accounts"
      title="Connected Accounts"
      subtitle="Manage account health, access status, and organization ownership in one place."
      session={session}
    >
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-[1.6rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-2xl font-bold tracking-tight">Instagram Accounts</p>
              <p className="text-sm text-muted">Business and Creator accounts linked to this workspace.</p>
            </div>
            <Button variant="outline">Connect Instagram Account</Button>
          </div>

          <div className="space-y-2">
            {accounts.map((account) => (
              <article
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-[#28293b]">@{account.handle}</p>
                  <p className="text-xs text-muted">{account.accountType} • ID {account.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={account.status === "connected" ? "success" : "warning"}>{account.status}</Badge>
                  <Button className="h-8 px-3 text-xs" variant="ghost">
                    Manage
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="rounded-[1.6rem] p-4 sm:p-5">
          <p className="text-2xl font-bold tracking-tight">Workspace Health</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#d8e6ff] p-4">
              <p className="text-xs font-semibold text-[#334b77]">Connected Accounts</p>
              <p className="pt-1 text-3xl font-bold">{accounts.length}</p>
            </div>
            <div className="rounded-2xl bg-[#f4e8cb] p-4">
              <p className="text-xs font-semibold text-[#564831]">Active Organization</p>
              <p className="truncate pt-1 text-sm font-semibold">{session.organizationId ?? "No active organization"}</p>
            </div>
            <div className="rounded-2xl bg-[#ececf2] p-4">
              <p className="text-xs font-semibold text-[#47485d]">Owner</p>
              <p className="truncate pt-1 text-sm font-semibold">{session.email ?? "Not available"}</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
