import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StudentForm } from "@/components/students/student-form";
import { db } from "@/lib/db";
import { isoDay } from "@/lib/format";
import { listProgrammes } from "@/lib/queries";

export default async function EditStudentPage({ params }: PageProps<"/staff/students/[id]/edit">) {
  const { id } = await params;
  const [s, programmes] = await Promise.all([db.student.findUnique({ where: { id } }), listProgrammes()]);
  if (!s) notFound();
  return (
    <>
      <PageHeader title={`Edit ${s.fullName}`} description={`${s.studentId}. The ID doesn't change.`} />
      <StudentForm
        programmes={programmes}
        initial={{ id: s.id, fullName: s.fullName, email: s.email, dateOfBirth: isoDay(s.dateOfBirth), programmeId: s.programmeId, academicYear: s.academicYear }}
      />
    </>
  );
}
