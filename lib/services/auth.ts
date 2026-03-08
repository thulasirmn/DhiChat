import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";

export type AppSession = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
  email: string | null;
  organizationId: string | null;
};

function toAppSession(auth: Awaited<ReturnType<typeof withAuth>>): AppSession | null {
  if (!auth.user) {
    return null;
  }

  return {
    userId: auth.user.id,
    firstName: auth.user.firstName ?? null,
    lastName: auth.user.lastName ?? null,
    profilePictureUrl: auth.user.profilePictureUrl ?? null,
    email: auth.user.email ?? null,
    organizationId: auth.organizationId ?? null
  };
}

export async function requireSession(): Promise<AppSession> {
  const auth = await withAuth({ ensureSignedIn: true });

  return {
    userId: auth.user.id,
    firstName: auth.user.firstName ?? null,
    lastName: auth.user.lastName ?? null,
    profilePictureUrl: auth.user.profilePictureUrl ?? null,
    email: auth.user.email ?? null,
    organizationId: auth.organizationId ?? null
  };
}

export async function getSession(): Promise<AppSession | null> {
  const auth = await withAuth();
  return toAppSession(auth);
}

export async function redirectIfSignedIn(pathname = "/dashboard/inbox"): Promise<void> {
  const session = await getSession();

  if (session) {
    redirect(pathname);
  }
}
