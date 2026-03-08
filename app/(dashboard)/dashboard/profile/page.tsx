import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/dashboard/page-shell";
import { requireSession } from "@/lib/services/auth";

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <PageShell
      pathname="/dashboard/profile"
      title="Profile"
      subtitle="Authenticated WorkOS identity and current workspace context."
      session={session}
    >
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[1.6rem] p-4 sm:p-5">
          <p className="text-2xl font-bold tracking-tight">Account Details</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">User ID</dt>
              <dd className="pt-1 text-sm">{session.userId}</dd>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Email</dt>
              <dd className="pt-1 text-sm">{session.email ?? "Not available"}</dd>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">First Name</dt>
              <dd className="pt-1 text-sm">{session.firstName ?? "Not available"}</dd>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Last Name</dt>
              <dd className="pt-1 text-sm">{session.lastName ?? "Not available"}</dd>
            </div>
          </dl>
        </Card>

        <Card className="rounded-[1.6rem] p-4 sm:p-5">
          <p className="text-2xl font-bold tracking-tight">Workspace</p>
          <div className="mt-4 rounded-2xl bg-[#d8e6ff] p-4">
            <p className="text-xs font-semibold text-[#334b77]">Organization ID</p>
            <p className="break-all pt-1 text-sm font-semibold text-[#2f3a5f]">
              {session.organizationId ?? "No active organization"}
            </p>
          </div>
          <div className="mt-3 rounded-2xl bg-[#ececf2] p-4">
            <p className="text-xs font-semibold text-[#4a4b63]">Role</p>
            <p className="pt-1 text-sm font-semibold">Workspace Admin</p>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
