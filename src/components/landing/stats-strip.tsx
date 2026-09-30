import { CountUp } from "@/components/motion/count-up";

type Props = { students: number; outstandingPoisha: number; overdue: number; late: number };

// Live numbers from the database, so the landing page shows the demo is real.
export function StatsStrip({ students, outstandingPoisha, overdue, late }: Props) {
  const items = [
    { label: "Students on record", value: <CountUp value={students} /> },
    { label: "Fees outstanding", value: <CountUp value={outstandingPoisha} currency /> },
    { label: "Overdue balances", value: <CountUp value={overdue} /> },
    { label: "Late submissions", value: <CountUp value={late} /> },
  ];
  return (
    <dl className="grid grid-cols-2 divide-border overflow-hidden rounded-2xl border bg-card/50 backdrop-blur md:grid-cols-4 md:divide-x">
      {items.map((i) => (
        <div key={i.label} className="p-5 text-center">
          <dd className="text-2xl font-semibold tabular-nums sm:text-3xl">{i.value}</dd>
          <dt className="mt-1 text-xs text-muted-foreground">{i.label}</dt>
        </div>
      ))}
    </dl>
  );
}
