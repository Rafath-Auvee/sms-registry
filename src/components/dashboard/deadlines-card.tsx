import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dateTime } from "@/lib/format";

type Row = { id: string; title: string; deadline: Date; module: { code: string }; _count: { submissions: number } };

export function DeadlinesCard({ assessments }: { assessments: Row[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deadlines</CardTitle>
        <CardDescription>Next assessments to close.</CardDescription>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open assessments.</p>
        ) : (
          <ul className="divide-y">
            {assessments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <Link href={`/staff/assessments/${a.id}`} className="min-w-0 hover:underline">
                  <div className="truncate font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.module.code} · {a._count.submissions} submitted
                  </div>
                </Link>
                <span className="shrink-0 text-right text-xs text-muted-foreground">{dateTime(a.deadline)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
