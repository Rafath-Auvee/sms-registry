import { ClipboardList, GraduationCap, Languages, ShieldCheck, UserPlus, Wallet, type LucideIcon } from "lucide-react";
import { ToneBadge } from "@/components/common/tone-badge";
import { cn } from "@/lib/utils";

type Tile = { icon: LucideIcon; title: string; text: string; className?: string; preview?: React.ReactNode };

// Each tile previews the real badges the app uses, instead of stock illustrations.
const TILES: Tile[] = [
  {
    icon: UserPlus,
    title: "Enrolment",
    text: "Generated Student IDs, every status change kept with a reason, search by name, ID or email.",
    className: "md:col-span-2",
    preview: (
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md border px-2 py-0.5 font-mono text-xs">SMS-2026-0001</span>
        <ToneBadge tone="green">Enrolled</ToneBadge>
        <ToneBadge tone="amber">Deferred</ToneBadge>
        <ToneBadge tone="red">Withdrawn</ToneBadge>
        <ToneBadge tone="blue">Completed</ToneBadge>
      </div>
    ),
  },
  {
    icon: Wallet,
    title: "Fees and payments",
    text: "Programme fees, payments by reference, a live balance, credit, and overdue flags.",
    preview: (
      <div className="flex flex-wrap gap-1.5">
        <ToneBadge tone="red">Overdue 12 days</ToneBadge>
        <ToneBadge tone="blue">৳5,000.00 credit</ToneBadge>
      </div>
    ),
  },
  {
    icon: ClipboardList,
    title: "Submissions",
    text: "PDF or DOCX, replaceable until the deadline. Late work is accepted and flagged.",
    preview: (
      <div className="flex flex-wrap gap-1.5">
        <ToneBadge tone="green">On time</ToneBadge>
        <ToneBadge tone="amber">Late · 5 h late</ToneBadge>
        <ToneBadge tone="red">Missing</ToneBadge>
      </div>
    ),
  },
  {
    icon: GraduationCap,
    title: "Marksheet",
    text: "Marks from 0 to 100, classified automatically. Students see results only once published, or the reason they're withheld.",
    className: "md:col-span-2",
    preview: (
      <div className="flex flex-wrap gap-1.5">
        <ToneBadge tone="green">Distinction</ToneBadge>
        <ToneBadge tone="blue">Merit</ToneBadge>
        <ToneBadge tone="grey">Pass</ToneBadge>
        <ToneBadge tone="red">Fail</ToneBadge>
        <ToneBadge tone="amber">Not published</ToneBadge>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Checked on the server",
    text: "Every rule and role is enforced by the API, not just hidden in the page.",
    className: "md:col-span-2",
  },
  {
    icon: Languages,
    title: "Made for Bangladesh",
    text: "Bangladeshi Taka with lakh grouping and dates in Dhaka time.",
  },
];

export function FeatureBento() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {TILES.map(({ icon: Icon, title, text, className, preview }) => (
        <div
          key={title}
          className={cn(
            "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-card/60 p-5 transition-colors hover:border-primary/40",
            className,
          )}
        >
          <div className="absolute -top-16 -right-16 size-40 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          <Icon className="size-5 text-primary" />
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
          {preview && <div className="mt-auto pt-1">{preview}</div>}
        </div>
      ))}
    </div>
  );
}
