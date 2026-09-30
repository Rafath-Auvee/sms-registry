import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { AssessmentRoster } from "@/components/assessments/assessment-roster";
import { DeadlineBadge } from "@/components/assessments/submission-badge";
import { dateTime } from "@/lib/format";
import { getAssessment } from "@/lib/queries";
import { isLate } from "@/lib/registry";

export default async function AssessmentPage({ params }: PageProps<"/staff/assessments/[id]">) {
  const { id } = await params;
  const a = await getAssessment(id);
  if (!a) notFound();
  // Deferred, withdrawn and completed students are listed but not expected to submit.
  const expected = a.rows.filter((r) => r.student.status === "ENROLLED" || r.submission);
  const submitted = a.rows.filter((r) => r.submission);
  const late = submitted.filter((r) => isLate(r.submission!.submittedAt, a.deadline)).length;
  const closed = a.deadline < new Date();

  return (
    <>
      <PageHeader
        title={a.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {a.module.code} {a.module.title} · {a.module.programme.code} · Deadline {dateTime(a.deadline)}
            <DeadlineBadge deadline={a.deadline} />
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Submitted" value={`${submitted.length} / ${expected.length}`} />
        <StatCard label="Late" value={late} alert={late > 0} />
        <StatCard label={closed ? "Missing" : "Not yet submitted"} value={expected.length - submitted.length} alert={closed && expected.length > submitted.length} />
        <StatCard label="Marked" value={`${a.rows.filter((r) => r.grade).length} / ${expected.length}`} />
      </div>
      <AssessmentRoster assessmentId={a.id} deadline={a.deadline} rows={a.rows} />
      <p className="text-xs text-muted-foreground">New marks are not visible to students until you publish them on the Results page.</p>
    </>
  );
}
