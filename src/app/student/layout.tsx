import { redirect } from "next/navigation";
import { UserX } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/empty-state";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SetupNotice } from "@/components/common/setup-notice";
import { dbState } from "@/lib/queries";

export default async function StudentLayout({ children }: LayoutProps<"/student">) {
  const { role, studentId } = await getSession();
  if (role !== "student") redirect("/staff");
  const state = await dbState();
  if (state !== "ready")
    return (
      <main className="mx-auto max-w-xl p-6 pt-24">
        <SetupNotice state={state} />
      </main>
    );
  const exists = studentId && (await db.student.findUnique({ where: { id: studentId }, select: { id: true } }));
  return (
    <AppShell role="student" current={exists ? studentId : "staff"}>
      {exists ? (
        children
      ) : (
        <EmptyState icon={UserX} title="Choose a student" description="This student no longer exists (for example after re-seeding). Pick one from the switcher above." />
      )}
    </AppShell>
  );
}
