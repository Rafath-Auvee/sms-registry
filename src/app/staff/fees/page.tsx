import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { FilterTabs } from "@/components/common/filter-tabs";
import { PageHeader } from "@/components/common/page-header";
import { FeesTable } from "@/components/fees/fees-table";
import { money } from "@/lib/format";
import { listStudents } from "@/lib/queries";
import type { FeeSummary } from "@/lib/registry";

const FILTERS: Record<string, { label: string; test: (f: FeeSummary) => boolean }> = {
  "": { label: "All", test: () => true },
  overdue: { label: "Overdue", test: (f) => f.overduePoisha > 0 },
  outstanding: { label: "Outstanding", test: (f) => f.balancePoisha > 0 },
  credit: { label: "In credit", test: (f) => f.balancePoisha < 0 },
  uncharged: { label: "Not charged", test: (f) => f.chargedPoisha === 0 },
};

export default async function FeesPage({ searchParams }: PageProps<"/staff/fees">) {
  const { show } = await searchParams;
  const current = typeof show === "string" && show in FILTERS ? show : "";
  const all = await listStudents({});
  const students = all.filter((s) => FILTERS[current].test(s.fees)).sort((a, b) => b.fees.overduePoisha - a.fees.overduePoisha || b.fees.balancePoisha - a.fees.balancePoisha);
  const outstanding = all.reduce((sum, s) => sum + Math.max(0, s.fees.balancePoisha), 0);

  return (
    <>
      <PageHeader title="Fees" description={`${money(outstanding)} outstanding across ${all.filter((s) => s.fees.balancePoisha > 0).length} students.`} />
      <FilterTabs
        base="/staff/fees"
        param="show"
        current={current}
        options={Object.entries(FILTERS).map(([value, f]) => ({ value, label: f.label, count: all.filter((s) => f.test(s.fees)).length }))}
      />
      {students.length ? <FeesTable students={students} /> : <EmptyState icon={Wallet} title="Nobody in this list" />}
    </>
  );
}
