import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeDialog } from "@/components/fees/charge-dialog";
import { FeeSummaryGrid } from "@/components/fees/fee-summary";
import { Ledger } from "@/components/fees/ledger";
import { PaymentDialog } from "@/components/fees/payment-dialog";
import type { FeeSummary } from "@/lib/registry";
import type { EnrolmentStatus } from "@/generated/prisma/enums";
import { money, STATUS_LABEL } from "@/lib/format";

type Props = {
  student: {
    id: string;
    status: EnrolmentStatus;
    academicYear: string;
    programme: { annualFeePoisha: number };
    charges: { id: string; academicYear: string; description: string; amountPoisha: number; dueDate: Date }[];
    payments: { id: string; reference: string; amountPoisha: number; paidOn: Date }[];
    fees: FeeSummary;
  };
  readOnly?: boolean;
};

export function StudentFees({ student, readOnly }: Props) {
  const charged = student.charges.some((c) => c.academicYear === student.academicYear);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fees and payments</CardTitle>
        {!readOnly && (
          <CardAction className="flex flex-wrap gap-2">
            {!charged &&
              (student.status === "ENROLLED" ? (
                <ChargeDialog studentId={student.id} fee={money(student.programme.annualFeePoisha)} year={student.academicYear} />
              ) : (
                <span className="self-center text-xs text-muted-foreground">
                  {STATUS_LABEL[student.status]} students aren&apos;t charged new fees
                </span>
              ))}
            <PaymentDialog studentId={student.id} balance={money(Math.max(0, student.fees.balancePoisha))} />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <FeeSummaryGrid fees={student.fees} />
        <Ledger charges={student.charges} payments={student.payments} />
      </CardContent>
    </Card>
  );
}
