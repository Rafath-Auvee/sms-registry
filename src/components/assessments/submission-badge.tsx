import { ToneBadge } from "@/components/common/tone-badge";
import { lateBy } from "@/lib/format";
import { isLate } from "@/lib/registry";

export function SubmissionBadge({ submittedAt, deadline }: { submittedAt: Date | null; deadline: Date }) {
  if (!submittedAt) return deadline < new Date() ? <ToneBadge tone="red">Missing</ToneBadge> : <ToneBadge tone="grey">Not submitted</ToneBadge>;
  if (isLate(submittedAt, deadline)) return <ToneBadge tone="amber">Late · {lateBy(submittedAt, deadline)}</ToneBadge>;
  return <ToneBadge tone="green">On time</ToneBadge>;
}

export function DeadlineBadge({ deadline }: { deadline: Date }) {
  return deadline < new Date() ? <ToneBadge tone="grey">Closed</ToneBadge> : <ToneBadge tone="blue">Open</ToneBadge>;
}
