import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/session";
import { SetupNotice } from "@/components/common/setup-notice";
import { dbState } from "@/lib/queries";

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  const { role } = await getSession();
  if (role !== "staff") redirect("/student");
  const state = await dbState();
  if (state !== "ready")
    return (
      <main className="mx-auto max-w-xl p-6 pt-24">
        <SetupNotice state={state} />
      </main>
    );
  return (
    <AppShell role="staff" current="staff">
      {children}
    </AppShell>
  );
}
