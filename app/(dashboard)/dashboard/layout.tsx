import { requireSession } from "@/lib/services/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return children;
}
