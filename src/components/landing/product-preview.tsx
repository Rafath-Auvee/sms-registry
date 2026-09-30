import { ToneBadge } from "@/components/common/tone-badge";
import { days, money } from "@/lib/format";
import type { FeeSummary } from "@/lib/registry";

type Props = {
  enrolled: number;
  outstandingPoisha: number;
  pendingResults: number;
  overdue: { id: string; fullName: string; studentId: string; fees: FeeSummary }[];
  late: { id: string; student: { fullName: string }; assessment: { title: string } }[];
};

// A framed, read-only snapshot of the real dashboard, filled with live data.
export function ProductPreview({ enrolled, outstandingPoisha, pendingResults, overdue, late }: Props) {
  // Outstanding goes first and spans the row on phones, where a taka amount needs the width.
  const stats = [
    { label: "Outstanding", value: money(outstandingPoisha), wide: true },
    { label: "Enrolled", value: String(enrolled) },
    { label: "To publish", value: String(pendingResults) },
  ];
  return (
    <div className="relative" aria-label="Preview of the Registry dashboard" role="img">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl" />
      <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/20 ring-1 ring-foreground/5">
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 truncate text-xs text-muted-foreground">Registry dashboard</span>
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className={`min-w-0 rounded-lg border p-2.5 ${s.wide ? "col-span-2 sm:col-span-1" : ""}`}>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="truncate text-sm font-semibold tabular-nums sm:text-base">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border">
            <p className="border-b px-3 py-2 text-xs font-medium">Overdue fees</p>
            {overdue.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 border-b px-3 py-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{s.fullName}</p>
                  <p className="text-[11px] text-muted-foreground">{s.studentId}</p>
                </div>
                <ToneBadge tone="red">
                  {money(s.fees.overduePoisha)} · {days(s.fees.daysOverdue)}
                </ToneBadge>
              </div>
            ))}
          </div>
          {late[0] && (
            <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{late[0].student.fullName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{late[0].assessment.title}</p>
              </div>
              <ToneBadge tone="amber">Late</ToneBadge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
