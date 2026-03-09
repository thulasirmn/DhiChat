import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/dashboard/page-shell";
import { requireSession } from "@/lib/services/auth";
import { getAuditData } from "@/lib/services/dashboard";

export default async function AuditPage() {
  const session = await requireSession();
  const { events } = await getAuditData(session.userId);

  return (
    <PageShell
      pathname="/dashboard/audit"
      title="Audit Timeline"
      subtitle="Complete trace of classification, generation, fallback, and outbound delivery actions."
      session={session}
    >
      <Card className="rounded-[1.6rem] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <Input className="max-w-sm" placeholder="Search event, conversation, or intent" />
          <div className="flex items-center gap-2">
            <Badge>Last 24h</Badge>
            <Badge>All Channels</Badge>
          </div>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3"
            >
              <div>
                <p className="text-sm font-semibold">{event.summary}</p>
                <p className="text-xs text-muted">Conversation: {event.conversationId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#efeff7] px-2.5 py-1 text-xs font-semibold text-[#555684]">{event.eventType}</span>
                <p className="text-xs text-muted">{new Date(event.createdAt).toLocaleTimeString()}</p>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
