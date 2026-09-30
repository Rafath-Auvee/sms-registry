import { days, money } from "@/lib/format";
import type { FeeSummary } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function FeeSummaryGrid({ fees }: { fees: FeeSummary }) {
  const credit = fees.balancePoisha < 0;
  const items = [
    { label: "Charged", value: money(fees.chargedPoisha) },
    { label: "Paid", value: money(fees.paidPoisha) },
    { label: credit ? "In credit" : "Outstanding", value: money(Math.abs(fees.balancePoisha)), tone: credit ? "text-sky-600 dark:text-sky-400" : "" },
    {
      label: "Overdue",
      value: fees.overduePoisha ? `${money(fees.overduePoisha)}` : "None",
      hint: fees.overduePoisha ? `${days(fees.daysOverdue)} past due` : undefined,
      tone: fees.overduePoisha ? "text-red-600 dark:text-red-400" : "",
    },
  ];
  return (
    <div className="@container">
      <Reveal className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="min-w-0 rounded-xl border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">{i.label}</p>
          <p className={cn("truncate text-base font-semibold tabular-nums @md:text-lg", i.tone)} title={String(i.value)}>{i.value}</p>
          {i.hint && <p className="text-xs text-muted-foreground">{i.hint}</p>}
        </div>
      ))}
      </Reveal>
    </div>
  );
}
