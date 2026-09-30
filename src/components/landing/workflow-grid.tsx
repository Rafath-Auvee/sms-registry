import { ClipboardList, GraduationCap, UserPlus, Wallet } from "lucide-react";

const WORKFLOWS = [
  { icon: UserPlus, title: "Enrolment", text: "Student records with generated IDs, status changes kept with a reason, search and filters." },
  { icon: Wallet, title: "Fees and payments", text: "Programme fees, payments by reference, live balance, credit, and overdue flags on the dashboard." },
  { icon: ClipboardList, title: "Submissions", text: "PDF or DOCX uploads, resubmission until the deadline, late work accepted and flagged." },
  { icon: GraduationCap, title: "Marksheet", text: "Marks 0 to 100 with Pass, Merit and Distinction. Students see results only once published." },
];

export function WorkflowGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {WORKFLOWS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-xl border p-4">
          <Icon className="mb-2 size-5 text-muted-foreground" />
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}
