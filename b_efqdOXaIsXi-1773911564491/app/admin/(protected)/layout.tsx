import { AdminShell } from "@/components/admin/admin-shell";
import { getSiteSettings } from "@/lib/cms";
import { requireAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, siteSettings] = await Promise.all([requireAdminUser(), getSiteSettings()]);

  return (
    <AdminShell siteName={siteSettings.siteName} userName={user.name}>
      {children}
    </AdminShell>
  );
}
