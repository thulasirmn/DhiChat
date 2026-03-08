import { signOut } from "@workos-inc/authkit-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LogoutPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const returnTo = `${appUrl.replace(/\/$/, "")}/marketing`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1240px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      <section className="app-shell subtle-grid grid min-h-[60vh] items-center p-3 sm:p-4">
        <Card className="mx-auto w-full max-w-md rounded-[1.8rem] border-white/60 p-6 sm:p-8">
          <h1 className="text-4xl font-bold tracking-tight">Sign out</h1>
          <p className="pt-3 text-sm text-muted">You will be signed out from your current WorkOS session.</p>
          <form
            action={async () => {
              "use server";
              await signOut({ returnTo });
            }}
          >
            <Button className="mt-6 w-full" type="submit">
              Confirm Sign out
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
