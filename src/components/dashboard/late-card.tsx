import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lateBy } from "@/lib/format";

type Row = {
  id: string;
  submittedAt: Date;
  student: { id: string; fullName: string; studentId: string };
  assessment: { id: string; title: string; deadline: Date };
};

export function LateCard({ submissions }: { submissions: Row[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Late submissions</CardTitle>
        <CardDescription>Accepted after the deadline and flagged for markers.</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No late submissions.</p>
        ) : (
          <ul className="divide-y">
            {submissions.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{s.student.fullName}</div>
                  <Link href={`/staff/assessments/${s.assessment.id}`} className="block truncate text-xs text-muted-foreground hover:underline">
                    {s.assessment.title}
                  </Link>
                </div>
                <span className="shrink-0 text-xs text-amber-700 dark:text-amber-400">{lateBy(s.submittedAt, s.assessment.deadline)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
