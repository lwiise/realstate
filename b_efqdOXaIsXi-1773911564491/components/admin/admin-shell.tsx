"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Globe,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MenuSquare,
  MessageSquareText,
  Settings,
  UserRound,
} from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminShellProps {
  siteName: string;
  userName: string;
  children: React.ReactNode;
}

const primaryLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Propriétés", icon: Home },
  { href: "/admin/agents", label: "Agents", icon: UserRound },
  { href: "/admin/property-types", label: "Types de propriété", icon: Building2 },
  { href: "/admin/transaction-types", label: "Types de transaction", icon: Globe },
  { href: "/admin/media", label: "Médias", icon: ImageIcon },
  { href: "/admin/inquiries", label: "Demandes", icon: MessageSquareText },
];

const contentLinks = [
  { href: "/admin/content/home", label: "Accueil" },
  { href: "/admin/content/buy", label: "Acheter" },
  { href: "/admin/content/rent", label: "Louer" },
  { href: "/admin/content/daily-rent", label: "Location journalière" },
  { href: "/admin/content/about", label: "À propos" },
  { href: "/admin/content/contact", label: "Contact" },
];

const settingsLinks = [
  { href: "/admin/navigation", label: "Barre de navigation", icon: MenuSquare },
  { href: "/admin/footer", label: "Pied de page", icon: FileText },
  { href: "/admin/settings", label: "Paramètres du site", icon: Settings },
];

export function AdminShell({ siteName, userName, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <div className="space-y-1 px-2">
            <p className="text-xs uppercase tracking-[0.25em] text-sidebar-foreground/60">
              CMS
            </p>
            <p className="text-sm font-medium text-sidebar-foreground">{siteName}</p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarMenu>
              {primaryLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Contenu des pages</SidebarGroupLabel>
            <SidebarMenu>
              {contentLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <FileText />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Site</SidebarGroupLabel>
            <SidebarMenu>
              {settingsLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-md border border-sidebar-border p-3">
            <p className="text-xs uppercase tracking-wide text-sidebar-foreground/60">Connecté</p>
            <p className="mt-1 text-sm font-medium text-sidebar-foreground">{userName}</p>
          </div>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-sidebar-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
          <SidebarTrigger />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Administration</p>
            <p className="text-sm font-medium text-foreground">Gestion du contenu</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
