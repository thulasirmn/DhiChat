import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { type AppSession } from "@/lib/services/auth";

export function PageShell({ pathname, title, subtitle, session, children }: {
  pathname: string;
  title: string;
  subtitle: string;
  session: AppSession;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1240px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      <div className="app-shell subtle-grid p-3 sm:p-4">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <Sidebar pathname={pathname} session={session} />
          <main className="space-y-4">
            <header className="animate-enter interactive-soft relative z-20 space-y-4 rounded-[1.6rem] border border-border bg-panel p-4 shadow-card sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{title}</h1>
                  <p className="pt-2 text-sm text-muted">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <ProfileDropdown session={session} />
                </div>
              </div>
              <MobileNav pathname={pathname} />
            </header>
            <section className="animate-enter relative z-10 space-y-4 [animation-delay:90ms]">{children}</section>
          </main>
        </div>
      </div>
    </div>
  );
}
