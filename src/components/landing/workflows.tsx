import { ClipboardList, GraduationCap, UserPlus, Wallet, type LucideIcon } from "lucide-react";
import { ToneBadge, type Tone } from "@/components/common/tone-badge";

type Workflow = { icon: LucideIcon; title: string; text: string; points: string[]; badges: [Tone, string][] };

const WORKFLOWS: Workflow[] = [
  {
    icon: UserPlus,
    title: "Enrolment",
    text: "Create and maintain student records.",
    points: ["Student IDs generated per cohort", "Status changes kept with a reason", "Search by name, ID or email"],
    badges: [["green", "Enrolled"], ["amber", "Deferred"], ["red", "Withdrawn"], ["blue", "Completed"]],
  },
  {
    icon: Wallet,
    title: "Fees and payments",
    text: "Know what every student owes, at a glance.",
    points: ["Fees charged from the programme", "Payments tracked by reference", "Overdue balances flagged by age"],
    badges: [["red", "Overdue 12 days"], ["amber", "৳80,000.00 due"], ["blue", "Credit"]],
  },
  {
    icon: ClipboardList,
    title: "Coursework submission",
    text: "Collect work against clear deadlines.",
    points: ["PDF or DOCX, checked by content", "Replace freely until the deadline", "Late and missing work surfaced"],
    badges: [["green", "On time"], ["amber", "Late"], ["red", "Missing"]],
  },
  {
    icon: GraduationCap,
    title: "Marksheet and results",
    text: "Grade, classify, then release on your terms.",
    points: ["Marks 0 to 100, classified automatically", "Publish or withhold per student", "Students never see unpublished marks"],
    badges: [["green", "Distinction"], ["blue", "Merit"], ["grey", "Pass"], ["red", "Withheld"]],
  },
];

export function Workflows() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {WORKFLOWS.map(({ icon: Icon, title, text, points, badges }) => (
        <article key={title} className="flex flex-col rounded-xl border bg-card p-6 transition-colors hover:border-primary/40">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {badges.map(([tone, label]) => (
              <ToneBadge key={label} tone={tone}>
                {label}
              </ToneBadge>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
