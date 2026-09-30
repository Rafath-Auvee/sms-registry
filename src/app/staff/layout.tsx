import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/session";

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  const { role } = await getSession();
  if (role !== "staff") redirect("/student");
  return (
    <AppShell role="staff" current="staff">
      {children}
    </AppShell>
  );
}
