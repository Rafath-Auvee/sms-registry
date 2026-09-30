import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/students/status-badge";
import { BalanceBadge } from "@/components/fees/balance-badge";
import type { EnrolmentStatus } from "@/generated/prisma/enums";
import type { FeeSummary } from "@/lib/registry";

type Row = {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  academicYear: string;
  status: EnrolmentStatus;
  programme: { code: string; name: string };
  fees: FeeSummary;
};

export function StudentTable({ students }: { students: Row[] }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead className="hidden md:table-cell">Programme</TableHead>
            <TableHead className="hidden lg:table-cell">Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Fees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id} className="relative">
              <TableCell>
                <Link href={`/staff/students/${s.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                  {s.fullName}
                </Link>
                <div className="text-xs text-muted-foreground">{s.studentId}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="font-medium">{s.programme.code}</span>{" "}
                <span className="text-muted-foreground">{s.programme.name}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{s.academicYear}</TableCell>
              <TableCell>
                <StatusBadge status={s.status} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <BalanceBadge fees={s.fees} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
