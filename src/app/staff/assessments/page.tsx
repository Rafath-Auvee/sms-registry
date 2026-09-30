import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { AssessmentDialog } from "@/components/assessments/assessment-dialog";
import { AssessmentTable } from "@/components/assessments/assessment-table";
import { listAssessments, listProgrammes } from "@/lib/queries";

export default async function AssessmentsPage() {
  const [assessments, programmes] = await Promise.all([listAssessments(), listProgrammes()]);
  return (
    <>
      <PageHeader title="Assessments" description="Create assessments, follow submissions and enter marks.">
        <AssessmentDialog programmes={programmes} />
      </PageHeader>
      {assessments.length ? (
        <AssessmentTable assessments={assessments} />
      ) : (
        <EmptyState icon={ClipboardList} title="No assessments yet" description="Create one for a module; its programme's students can then submit." />
      )}
    </>
  );
}
