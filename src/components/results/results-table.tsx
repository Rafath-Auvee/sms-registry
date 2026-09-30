import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BalanceBadge } from "@/components/fees/balance-badge";
import { PublishControls } from "@/components/results/publish-controls";
import { ToneBadge } from "@/components/common/tone-badge";
import type { FeeSummary } from "@/lib/registry";

type Row = {
  id: string;
  studentId: string;
  fullName: string;
  programme: { code: string };
  grades: { mark: number; published: boolean; withheldReason: string | null }[];
  fees: FeeSummary;
};

function state(grades: Row["grades"]) {
  const withheld = grades.find((g) => g.withheldReason);
  if (withheld) return <ToneBadge tone="red">Withheld</ToneBadge>;
  const published = grades.filter((g) => g.published).length;
  if (published === grades.length) return <ToneBadge tone="green">All published</ToneBadge>;
  if (published) return <ToneBadge tone="amber">{grades.length - published} new unpublished</ToneBadge>;
  return <ToneBadge tone="amber">Not published</ToneBadge>;
}

export function ResultsTable({ students }: { students: Row[] }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Marks</TableHead>
            <TableHead className="hidden sm:table-cell">Results</TableHead>
            <TableHead className="hidden md:table-cell">Fees</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <Link href={`/staff/students/${s.id}?tab=results`} className="font-medium hover:underline">
                  {s.fullName}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {s.studentId} · {s.programme.code}
                </div>
                <div className="mt-1 sm:hidden">{state(s.grades)}</div>
              </TableCell>
              <TableCell className="hidden text-right tabular-nums sm:table-cell">{s.grades.length}</TableCell>
              <TableCell className="hidden sm:table-cell">{state(s.grades)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <BalanceBadge fees={s.fees} />
              </TableCell>
              <TableCell>
                <PublishControls studentId={s.id} name={s.fullName} overdue={s.fees.overduePoisha > 0} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
