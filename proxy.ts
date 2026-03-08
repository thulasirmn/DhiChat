import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

export const config = {
  // Ensure AuthKit headers are available for any route using withAuth().
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
