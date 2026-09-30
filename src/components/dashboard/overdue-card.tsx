import Link from "next/link";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { money } from "@/lib/format";
import type { FeeSummary } from "@/lib/registry";

type Row = { id: string; fullName: string; studentId: string; fees: FeeSummary };

export function OverdueCard({ students }: { students: Row[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue fees</CardTitle>
        <CardDescription>Oldest first. Consider withholding results until settled.</CardDescription>
        <CardAction>
          <Link href="/staff/fees?show=overdue" className="text-sm text-muted-foreground hover:underline">
            View all
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">No overdue balances.</p>
        ) : (
          <ul className="divide-y">
            {students.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <Link href={`/staff/students/${s.id}?tab=fees`} className="min-w-0 hover:underline">
                  <div className="truncate font-medium">{s.fullName}</div>
                  <div className="text-xs text-muted-foreground">{s.studentId}</div>
                </Link>
                <div className="shrink-0 text-right">
                  <div className="font-medium text-red-600 tabular-nums dark:text-red-400">{money(s.fees.overduePoisha)}</div>
                  <div className="text-xs text-muted-foreground">{s.fees.daysOverdue} days</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
