import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date, money } from "@/lib/format";

type Charge = { id: string; description: string; amountPoisha: number; dueDate: Date };
type Payment = { id: string; reference: string; amountPoisha: number; paidOn: Date };

// Charges and payments in one statement, newest first, the way a student account is usually read.
export function Ledger({ charges, payments }: { charges: Charge[]; payments: Payment[] }) {
  const rows = [
    ...charges.map((c) => ({ id: c.id, on: c.dueDate, what: c.description, note: `Due ${date(c.dueDate)}`, amount: c.amountPoisha })),
    ...payments.map((p) => ({ id: p.id, on: p.paidOn, what: "Payment received", note: p.reference, amount: -p.amountPoisha })),
  ].sort((a, b) => +b.on - +a.on);

  if (!rows.length) return <p className="text-sm text-muted-foreground">No charges or payments yet.</p>;
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap">{date(r.on)}</TableCell>
              <TableCell>
                <div className="font-medium">{r.what}</div>
                <div className="text-xs text-muted-foreground">{r.note}</div>
              </TableCell>
              <TableCell className={`text-right tabular-nums ${r.amount < 0 ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {r.amount < 0 ? `-${money(-r.amount)}` : money(r.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
