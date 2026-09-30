import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeadlineBadge } from "@/components/assessments/submission-badge";
import { dateTime } from "@/lib/format";

type Row = {
  id: string;
  title: string;
  deadline: Date;
  module: { code: string; title: string; programme: { code: string } };
  _count: { submissions: number; grades: number };
};

export function AssessmentTable({ assessments }: { assessments: Row[] }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assessment</TableHead>
            <TableHead className="hidden md:table-cell">Deadline</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Submitted</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Graded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((a) => (
            <TableRow key={a.id} className="relative">
              <TableCell>
                <Link href={`/staff/assessments/${a.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                  {a.title}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {a.module.code} {a.module.title} · {a.module.programme.code}
                </div>
                <div className="text-xs text-muted-foreground md:hidden">Due {dateTime(a.deadline)}</div>
              </TableCell>
              <TableCell className="hidden whitespace-nowrap md:table-cell">{dateTime(a.deadline)}</TableCell>
              <TableCell>
                <DeadlineBadge deadline={a.deadline} />
              </TableCell>
              <TableCell className="hidden text-right tabular-nums sm:table-cell">{a._count.submissions}</TableCell>
              <TableCell className="hidden text-right tabular-nums sm:table-cell">{a._count.grades}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
