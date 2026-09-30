import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BalanceBadge } from "@/components/fees/balance-badge";
import { money } from "@/lib/format";
import type { FeeSummary } from "@/lib/registry";

type Row = { id: string; studentId: string; fullName: string; programme: { code: string }; fees: FeeSummary };

export function FeesTable({ students }: { students: Row[] }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead className="hidden text-right md:table-cell">Charged</TableHead>
            <TableHead className="hidden text-right md:table-cell">Paid</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="hidden sm:table-cell">State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id} className="relative">
              <TableCell>
                <Link href={`/staff/students/${s.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                  {s.fullName}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {s.studentId} · {s.programme.code}
                </div>
              </TableCell>
              <TableCell className="hidden text-right tabular-nums md:table-cell">{money(s.fees.chargedPoisha)}</TableCell>
              <TableCell className="hidden text-right tabular-nums md:table-cell">{money(s.fees.paidPoisha)}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {s.fees.balancePoisha < 0 ? `${money(-s.fees.balancePoisha)} CR` : money(s.fees.balancePoisha)}
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
