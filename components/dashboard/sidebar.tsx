import Link from "next/link";
import { signOut } from "@workos-inc/authkit-nextjs";
import { cn } from "@/lib/utils/cn";
import { type AppSession } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";

const mainItems = [
  { href: "/dashboard/inbox", label: "Dashboard" },
  { href: "/dashboard/audit", label: "Insights" },
  { href: "/dashboard/accounts", label: "Reports" },
  { href: "/dashboard/profile", label: "Profile" }
];

const toolItems = [
  { href: "/dashboard/automation", label: "Automation" },
  { href: "/dashboard/accounts", label: "Organization" }
];

function displayName(session: AppSession): string {
  const fullName = [session.firstName, session.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (session.email) return session.email;
  return "Signed-in User";
}

function initials(session: AppSession): string {
  const first = session.firstName?.[0] ?? "";
  const last = session.lastName?.[0] ?? "";
  const fromName = `${first}${last}`.toUpperCase();
  if (fromName) return fromName;
  return (session.email?.slice(0, 2) ?? "U").toUpperCase();
}

function NavGroup({
  title,
  pathname,
  items
}: {
  title: string;
  pathname: string;
  items: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="px-2 text-xs font-semibold text-muted">{title}</p>
      <nav className="mt-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "focus-ring pressable block rounded-full px-4 py-2.5 text-sm font-semibold interactive-soft",
              pathname === item.href
                ? "bg-[#12131a] text-white shadow-card"
                : "text-[#4f5062] hover:bg-white hover:text-text"
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ pathname, session }: { pathname: string; session: AppSession }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const returnTo = `${appUrl.replace(/\/$/, "")}/marketing`;

  return (
    <aside className="hidden min-h-[calc(100vh-3rem)] flex-col rounded-[1.6rem] border border-border bg-[#efeff5] p-4 lg:flex">
      <div className="interactive-soft rounded-2xl bg-white px-3 py-4">
        <p className="text-lg font-bold tracking-tight text-[#222335]">DHI CHAT</p>
        <p className="pt-1 text-xs text-muted">Instagram Automation</p>
      </div>

      <div className="interactive-soft mt-4 space-y-5 rounded-2xl border border-border/70 bg-panel p-3">
        <NavGroup items={mainItems} pathname={pathname} title="Main" />
        <NavGroup items={toolItems} pathname={pathname} title="Tools" />
      </div>

      <div className="mt-auto space-y-3 pt-4">
        <div className="interactive-soft rounded-2xl border border-border bg-white p-3">
          <div className="flex items-center gap-3">
            {session.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={displayName(session)}
                className="h-10 w-10 rounded-full border border-border object-cover"
                src={session.profilePictureUrl}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#d6d3fa] text-xs font-semibold">
                {initials(session)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName(session)}</p>
              <p className="truncate text-xs text-muted">{session.email ?? "No email"}</p>
            </div>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ returnTo });
          }}
        >
          <Button className="w-full" variant="outline">
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
