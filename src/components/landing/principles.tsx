import { History, Languages, ShieldCheck } from "lucide-react";

const PRINCIPLES = [
  { icon: ShieldCheck, title: "Rules enforced on the server", text: "Roles, deadlines and money checks live in the API, not just in the page." },
  { icon: History, title: "Nothing silently lost", text: "Records are never deleted. Status changes and payments keep their full history." },
  { icon: Languages, title: "Made for Bangladesh", text: "Bangladeshi Taka with lakh grouping, and every date in Dhaka time." },
];

export function Principles() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {PRINCIPLES.map(({ icon: Icon, title, text }) => (
        <div key={title} className="space-y-2">
          <Icon className="size-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}
