import { PageHeader } from "@/components/common/page-header";
import { StudentForm } from "@/components/students/student-form";
import { listProgrammes } from "@/lib/queries";
import { currentAcademicYear } from "@/lib/registry";

export default async function NewStudentPage() {
  const programmes = await listProgrammes();
  return (
    <>
      <PageHeader title="Enrol student" description="A Student ID is generated when you save." />
      <StudentForm
        programmes={programmes}
        initial={{ fullName: "", email: "", dateOfBirth: "", programmeId: "", academicYear: currentAcademicYear() }}
      />
    </>
  );
}
