import { ToneBadge } from "@/components/common/tone-badge";
import { money } from "@/lib/format";
import type { FeeSummary } from "@/lib/registry";

export function BalanceBadge({ fees }: { fees: FeeSummary }) {
  if (fees.overduePoisha > 0)
    return <ToneBadge tone="red">Overdue {fees.daysOverdue} {fees.daysOverdue === 1 ? "day" : "days"}</ToneBadge>;
  if (fees.balancePoisha > 0) return <ToneBadge tone="amber">{money(fees.balancePoisha)} due</ToneBadge>;
  if (fees.balancePoisha < 0) return <ToneBadge tone="blue">{money(-fees.balancePoisha)} credit</ToneBadge>;
  if (fees.chargedPoisha > 0) return <ToneBadge tone="green">Paid</ToneBadge>;
  return <ToneBadge tone="grey">Not charged</ToneBadge>;
}
