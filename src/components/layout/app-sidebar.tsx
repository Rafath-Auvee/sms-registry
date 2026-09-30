"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, GraduationCap, LayoutDashboard, School, Upload, User, Users, Wallet } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/lib/session";

const NAV = {
  staff: [
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/students", label: "Students", icon: Users },
    { href: "/staff/fees", label: "Fees", icon: Wallet },
    { href: "/staff/assessments", label: "Assessments", icon: ClipboardList },
    { href: "/staff/results", label: "Results", icon: GraduationCap },
  ],
  student: [
    { href: "/student", label: "My overview", icon: User },
    { href: "/student/assessments", label: "My assessments", icon: Upload },
    { href: "/student/results", label: "My results", icon: GraduationCap },
  ],
};

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const home = `/${role}`;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" onClick={() => setOpenMobile(false)} />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <School className="size-4" />
              </div>
              <div className="grid text-left text-sm leading-tight">
                <span className="truncate font-semibold">SMS Registry</span>
                <span className="truncate text-xs text-muted-foreground">{role === "staff" ? "Staff view" : "Student view"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "staff" ? "Registry" : "Student"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV[role].map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    tooltip={label}
                    isActive={href === home ? pathname === href : pathname.startsWith(href)}
                    render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
