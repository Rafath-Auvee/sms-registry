import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Reveal } from "@/components/motion/reveal";
import { StudentAssessmentCard } from "@/components/assessments/student-assessment-card";
import { studentAssessments } from "@/lib/queries";
import { submissionBlock } from "@/lib/registry";
import { getSession } from "@/lib/session";

export default async function MyAssessmentsPage() {
  const { studentId } = await getSession();
  const data = (await studentAssessments(studentId!))!;
  return (
    <>
      <PageHeader title="My assessments" description="Upload a PDF or DOCX (up to 10 MB). You can replace it until the deadline." />
      {data.assessments.length ? (
        <Reveal className="grid items-start gap-4 lg:grid-cols-2">
          {data.assessments.map((a) => {
            const sub = a.submissions[0] ?? null;
            return <StudentAssessmentCard key={a.id} assessment={a} submission={sub} blocked={submissionBlock(data.status, !!sub, a.deadline)} />;
          })}
        </Reveal>
      ) : (
        <EmptyState icon={ClipboardList} title="No assessments yet" description="Assessments for your programme will appear here." />
      )}
    </>
  );
}
