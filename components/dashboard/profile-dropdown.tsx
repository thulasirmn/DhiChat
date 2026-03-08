"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type AppSession } from "@/lib/services/auth";
import { cn } from "@/lib/utils/cn";

function displayName(session: AppSession): string {
  const fullName = [session.firstName, session.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  return session.email ?? "Signed-in User";
}

function initials(session: AppSession): string {
  const first = session.firstName?.[0] ?? "";
  const last = session.lastName?.[0] ?? "";
  const fromName = `${first}${last}`.toUpperCase();
  if (fromName) return fromName;
  return (session.email?.slice(0, 2) ?? "U").toUpperCase();
}

const menuItems = [
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/accounts", label: "Organization switch" },
  { href: "/auth/logout", label: "Logout" }
] as const;

export function ProfileDropdown({ session }: { session: AppSession }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="focus-ring flex items-center gap-3 rounded-full border border-border bg-white px-2.5 py-1.5 text-left shadow-card"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {session.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={displayName(session)} className="h-8 w-8 rounded-full border border-border object-cover" src={session.profilePictureUrl} />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-panel text-xs font-semibold">
            {initials(session)}
          </div>
        )}
        <div className="hidden min-w-0 pr-1 sm:block">
          <p className="truncate text-sm font-semibold">{displayName(session)}</p>
          <p className="truncate text-xs text-muted">{session.email ?? "No email"}</p>
        </div>
      </button>

      <div
        className={cn(
          "absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-white p-2 shadow-soft transition duration-200",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
        role="menu"
      >
        {menuItems.map((item) => (
          <Link
            className="focus-ring pressable block rounded-xl px-3 py-2 text-sm text-muted interactive-soft hover:bg-panelSoft hover:text-text"
            href={item.href}
            key={item.href}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
