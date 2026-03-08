import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/dashboard/inbox", label: "Inbox" },
  { href: "/dashboard/accounts", label: "Accounts" },
  { href: "/dashboard/automation", label: "Automation" },
  { href: "/dashboard/audit", label: "Audit" }
];

export function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="grid grid-cols-2 gap-2 lg:hidden" role="navigation">
      {items.map((item) => (
        <Link
          className={cn(
            "focus-ring pressable rounded-2xl border px-3 py-2 text-center text-sm font-semibold interactive-soft",
            pathname === item.href
              ? "border-transparent bg-[#15161f] text-white"
              : "border-border/60 bg-panelSoft text-muted hover:text-text"
          )}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
