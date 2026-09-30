import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Marksheet, type MarksheetRow } from "@/components/results/marksheet";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function MyResultsPage() {
  const { studentId } = await getSession();
  const grades = await db.grade.findMany({
    where: { studentId: studentId! },
    include: { assessment: { include: { module: true } } },
    orderBy: { assessment: { deadline: "asc" } },
  });
  // Strip unpublished marks here, on the server, so they are never sent to the browser.
  const rows: MarksheetRow[] = grades.map((g) => ({
    id: g.id,
    title: g.assessment.title,
    module: `${g.assessment.module.code} ${g.assessment.module.title}`,
    mark: g.published ? g.mark : null,
    withheld: !g.published && !!g.withheldReason,
  }));
  const withheld = grades.find((g) => g.withheldReason)?.withheldReason ?? null;

  return (
    <>
      <PageHeader title="My results" description="Marks appear once the Registry publishes them." />
      {grades.length ? (
        <Marksheet rows={rows} withheldReason={withheld} />
      ) : (
        <EmptyState icon={GraduationCap} title="No results yet" description="Your marks will appear here once they are published." />
      )}
    </>
  );
}
