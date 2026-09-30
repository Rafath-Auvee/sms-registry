import { ToneBadge, type Tone } from "@/components/common/tone-badge";
import { classify, type Classification } from "@/lib/registry";

const TONE: Record<Classification, Tone> = { Distinction: "green", Merit: "blue", Pass: "grey", Fail: "red" };

export function ClassificationBadge({ mark }: { mark: number }) {
  const c = classify(mark);
  return <ToneBadge tone={TONE[c]}>{c}</ToneBadge>;
}

export function ResultStateBadge({ published, withheldReason }: { published: boolean; withheldReason: string | null }) {
  if (published) return <ToneBadge tone="green">Published</ToneBadge>;
  if (withheldReason) return <ToneBadge tone="red">Withheld</ToneBadge>;
  return <ToneBadge tone="amber">Not published</ToneBadge>;
}
