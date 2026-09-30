import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { ResultsTable } from "@/components/results/results-table";
import { listResults } from "@/lib/queries";

export default async function ResultsPage() {
  const students = await listResults();
  return (
    <>
      <PageHeader
        title="Results"
        description="Students see their marksheet only after you publish it. Withheld results show the reason, never the marks."
      />
      {students.length ? (
        <ResultsTable students={students} />
      ) : (
        <EmptyState icon={GraduationCap} title="No marks entered yet" description="Enter marks from an assessment's page." />
      )}
    </>
  );
}
