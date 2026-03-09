import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { withAuth } from "@workos-inc/authkit-nextjs";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "DHIFLOW | Instagram Automation",
  description: "Minimalist AI automation for Instagram comments and DMs"
};

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const nextTheme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = nextTheme;
  } catch (_) {}
})();
`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const auth = await withAuth();
  const { accessToken, ...initialAuth } = auth;
  void accessToken;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AuthKitProvider initialAuth={initialAuth}>{children}</AuthKitProvider>
      </body>
    </html>
  );
}
