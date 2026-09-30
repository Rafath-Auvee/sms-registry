const STEPS = [
  { title: "Enrol", text: "Add the student to a programme. Their Student ID is generated and the enrolment is recorded." },
  { title: "Bill and collect", text: "Charge the programme fee with a due date and record payments as they arrive. Overdue balances surface on the dashboard." },
  { title: "Assess and publish", text: "Students submit coursework, staff enter marks, and the Registry publishes or withholds results." },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative rounded-xl border bg-card p-6">
          <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
