import { School } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StudentForm } from "@/components/students/student-form";
import { listProgrammes } from "@/lib/queries";
import { currentAcademicYear } from "@/lib/registry";

export default async function NewStudentPage() {
  const programmes = await listProgrammes();
  if (!programmes.length)
    return <EmptyState icon={School} title="No programmes yet" description="Students enrol on a programme. Load the demo data or add programmes first." />;
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
