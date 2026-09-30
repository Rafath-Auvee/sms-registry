import { ToneBadge, type Tone } from "@/components/common/tone-badge";
import { STATUS_LABEL } from "@/lib/format";
import type { EnrolmentStatus } from "@/generated/prisma/enums";

const TONE: Record<EnrolmentStatus, Tone> = { ENROLLED: "green", DEFERRED: "amber", WITHDRAWN: "red", COMPLETED: "blue" };

export function StatusBadge({ status }: { status: EnrolmentStatus }) {
  return <ToneBadge tone={TONE[status]}>{STATUS_LABEL[status]}</ToneBadge>;
}
