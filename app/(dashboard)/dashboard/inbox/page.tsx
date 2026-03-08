import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/dashboard/page-shell";
import { requireSession } from "@/lib/services/auth";
import { getInboxData } from "@/lib/services/dashboard";

const bars = [
  { day: "Sun", value: 24 },
  { day: "Mon", value: 70 },
  { day: "Tue", value: 52 },
  { day: "Wed", value: 84 },
  { day: "Thu", value: 72 },
  { day: "Fri", value: 62 },
  { day: "Sat", value: 18 }
];

const insightItems = [
  {
    title: "Lead Behavior Trends",
    text: "More users are requesting pricing details during evening hours.",
    tag: "Trend"
  },
  {
    title: "Risk and Anomaly Alerts",
    text: "Spam-like comments increased on one campaign post this week.",
    tag: "Alert"
  },
  {
    title: "Growth Suggestions",
    text: "Pin one CTA comment with booking link to improve conversion rates.",
    tag: "Tip"
  }
];

export default async function InboxPage() {
  const session = await requireSession();
  const { conversations } = await getInboxData();

  return (
    <PageShell
      pathname="/dashboard/inbox"
      title="Hello"
      subtitle="Monitor interactions and AI outcomes in one clean command center."
      session={session}
    >
      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4">
          <Card className="interactive-soft rounded-[1.6rem] p-3 sm:p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <article className="interactive-soft rounded-3xl bg-[#f4e8cb] p-4">
                <p className="text-sm font-semibold text-[#3e3a2b]">Total Interactions</p>
                <p className="pt-10 text-3xl font-bold tracking-tight">12,480</p>
              </article>
              <article className="interactive-soft rounded-3xl bg-[#d8e6ff] p-4">
                <p className="text-sm font-semibold text-[#2f3a5f]">Active Users</p>
                <p className="pt-10 text-3xl font-bold tracking-tight">1,376</p>
              </article>
              <article className="interactive-soft rounded-3xl bg-[#ececf2] p-4">
                <p className="text-sm font-semibold text-[#303143]">AI Accuracy</p>
                <p className="pt-10 text-3xl font-bold tracking-tight">96.7%</p>
              </article>
            </div>
          </Card>

          <Card className="interactive-soft rounded-[1.6rem] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Productivity Trends</h2>
                <p className="text-sm text-muted">Daily focus time on conversation handling</p>
              </div>
              <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold">Week</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[180px_1fr]">
              <div className="interactive-soft rounded-2xl border border-border bg-white p-4">
                <p className="text-4xl font-bold tracking-tight">14 h</p>
                <p className="pt-1 text-sm text-muted">logged this week</p>
                <p className="mt-4 inline-flex rounded-full bg-[#dff5e8] px-2.5 py-1 text-xs font-semibold text-[#23834c]">
                  +15% vs last week
                </p>
              </div>

              <div className="interactive-soft rounded-2xl border border-border bg-[#f3f2fb] p-4">
                <div className="flex h-[170px] items-end justify-between gap-2">
                  {bars.map((bar) => (
                    <div className="flex flex-1 flex-col items-center gap-2" key={bar.day}>
                      <div className="w-full rounded-full bg-white/70" style={{ height: `${Math.max(bar.value, 10)}%` }} />
                      <span className="text-xs text-muted">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="interactive-soft rounded-[1.6rem] p-4 sm:p-5">
            <h2 className="text-2xl font-bold tracking-tight">Latest Conversations</h2>
            <div className="mt-4 space-y-2">
              {conversations.map((conversation) => (
                <article key={conversation.id} className="interactive-soft rounded-2xl border border-border bg-white p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#28293b]">{conversation.title}</p>
                    <span className="rounded-full bg-[#15161f] px-2.5 py-1 text-xs font-semibold capitalize text-white">
                      {conversation.channel}
                    </span>
                  </div>
                  <p className="pt-2 text-sm text-muted">{conversation.lastMessage}</p>
                </article>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="interactive-soft rounded-[1.6rem] p-4">
            <div className="space-y-2">
              <div className="rounded-full bg-[#111218] px-4 py-3 text-white">
                <p className="text-3xl font-bold leading-none">16 h</p>
                <p className="pt-1 text-xs text-white/75">Saved this month</p>
              </div>
              <div className="rounded-full border border-border bg-white px-4 py-3">
                <p className="text-3xl font-bold leading-none">14 h</p>
                <p className="pt-1 text-xs text-muted">previous month</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-gradient-to-br from-[#6a67b6] via-[#7b80d9] to-[#748fca] p-4 text-white">
              <p className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">PRO</p>
              <h3 className="pt-3 text-3xl font-bold leading-tight">Switch to AI Insights Pro today!</h3>
            </div>
          </Card>

          <Card className="interactive-soft rounded-[1.6rem] p-4 sm:p-5">
            <h2 className="text-2xl font-bold tracking-tight">AI Insights</h2>
            <div className="mt-4 space-y-3">
              {insightItems.map((item) => (
                <article className="interactive-soft rounded-2xl border border-border bg-white p-3" key={item.title}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="rounded-full bg-[#efeff7] px-2 py-0.5 text-xs font-semibold text-[#53547b]">{item.tag}</span>
                  </div>
                  <p className="pt-2 text-sm text-muted">{item.text}</p>
                  <button className="mt-2 text-xs font-semibold text-accent" type="button">
                    View Details
                  </button>
                </article>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
