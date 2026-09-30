import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/motion/reveal";
import { StudentFees } from "@/components/fees/student-fees";
import { StatusBadge } from "@/components/students/status-badge";
import { StudentDetails } from "@/components/students/student-details";
import { getStudent } from "@/lib/queries";
import { getSession } from "@/lib/session";

export default async function StudentHome() {
  const { studentId } = await getSession();
  const s = (await getStudent(studentId!))!;
  return (
    <>
      <PageHeader
        title={`Hello, ${s.fullName.split(" ")[0]}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {s.programme.name} · {s.academicYear}
            <StatusBadge status={s.status} />
          </span>
        }
      />
      <Reveal className="grid items-start gap-4 xl:grid-cols-[2fr_3fr]">
        <StudentDetails student={s} />
        <StudentFees student={s} readOnly />
      </Reveal>
    </>
  );
}
