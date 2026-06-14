import { AdminShell } from "@/components/layout/AdminShell";

/**
 * Admin shell layout.
 *
 * Replaces the public Header/Footer entirely — the /admin subtree only
 * inherits the root app/layout.tsx (HTML shell + fonts), not the public
 * site chrome. AdminShell renders its own sidebar + topbar.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
