import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StudentFilters } from "@/components/students/student-filters";
import { StudentTable } from "@/components/students/student-table";
import { listProgrammes, listStudents } from "@/lib/queries";

export default async function StudentsPage({ searchParams }: PageProps<"/staff/students">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const filters = { q: one(sp.q), programme: one(sp.programme), status: one(sp.status) };
  const [students, programmes] = await Promise.all([listStudents(filters), listProgrammes()]);
  const filtered = Object.values(filters).some(Boolean);

  return (
    <>
      <PageHeader title="Students" description={`${students.length} ${filtered ? "matching" : "on record"}`}>
        <Button nativeButton={false} render={<Link href="/staff/students/new" />}>
          <Plus /> Enrol student
        </Button>
      </PageHeader>
      <StudentFilters programmes={programmes} />
      {students.length ? (
        <StudentTable students={students} />
      ) : (
        <EmptyState icon={Users} title={filtered ? "No students match" : "No students yet"} description={filtered ? "Try a different search or clear the filters." : "Enrol the first student to get started."} />
      )}
    </>
  );
}
