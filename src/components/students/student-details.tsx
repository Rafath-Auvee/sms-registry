import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { date } from "@/lib/format";

type Student = {
  studentId: string;
  email: string;
  dateOfBirth: Date;
  academicYear: string;
  createdAt: Date;
  programme: { code: string; name: string };
};

export function StudentDetails({ student }: { student: Student }) {
  const rows: [string, React.ReactNode][] = [
    ["Student ID", <span key="id" className="font-mono">{student.studentId}</span>],
    ["Email", <a key="e" href={`mailto:${student.email}`} className="break-all hover:underline">{student.email}</a>],
    ["Date of birth", date(student.dateOfBirth)],
    ["Programme", `${student.programme.code}: ${student.programme.name}`],
    ["Academic year", student.academicYear],
    ["Record created", date(student.createdAt)],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
