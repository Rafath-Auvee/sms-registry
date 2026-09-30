import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { studentOptions } from "@/lib/queries";
import type { Role } from "@/lib/session";

export async function AppShell({ role, current, children }: { role: Role; current: string; children: React.ReactNode }) {
  const students = await studentOptions();
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <span className="hidden text-sm text-muted-foreground sm:inline">{role === "staff" ? "Registry Administrator" : "Student portal"}</span>
          <div className="ml-auto flex items-center gap-1">
            <RoleSwitcher current={current} students={students} />
            <ThemeToggle />
          </div>
        </header>
        <main className="w-full max-w-[1600px] flex-1 space-y-6 p-4 sm:p-6 lg:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
