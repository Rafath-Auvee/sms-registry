import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassificationBadge, ResultStateBadge } from "@/components/results/result-badges";

type Grade = {
  id: string;
  mark: number;
  published: boolean;
  withheldReason: string | null;
  assessment: { title: string; module: { code: string } };
};

// Staff view of one student's marks.
export function GradesTable({ grades }: { grades: Grade[] }) {
  if (!grades.length) return <p className="text-sm text-muted-foreground">No marks entered yet.</p>;
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assessment</TableHead>
            <TableHead className="text-right">Mark</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead className="hidden sm:table-cell">State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((g) => (
            <TableRow key={g.id}>
              <TableCell>
                <div className="font-medium">{g.assessment.title}</div>
                <div className="text-xs text-muted-foreground">{g.assessment.module.code}</div>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">{g.mark}</TableCell>
              <TableCell>
                <ClassificationBadge mark={g.mark} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <ResultStateBadge published={g.published} withheldReason={g.withheldReason} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
