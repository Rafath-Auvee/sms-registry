import { AlertTriangle, Clock, FileCheck, Banknote, Users } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { DeadlinesCard } from "@/components/dashboard/deadlines-card";
import { LateCard } from "@/components/dashboard/late-card";
import { OverdueCard } from "@/components/dashboard/overdue-card";
import { dashboard } from "@/lib/queries";

export default async function DashboardPage() {
  const d = await dashboard();
  return (
    <>
      <PageHeader title="Registry dashboard" description="What needs attention today." />
      <Reveal className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Enrolled students" value={<CountUp value={d.counts.enrolled} />} hint={`${d.counts.total} records in total`} icon={Users} href="/staff/students?status=ENROLLED" />
        <StatCard label="Fees outstanding" value={<CountUp value={d.outstandingPoisha} currency />} icon={Banknote} href="/staff/fees?show=outstanding" />
        <StatCard label="Overdue students" value={<CountUp value={d.overdue.length} />} icon={AlertTriangle} href="/staff/fees?show=overdue" alert={d.overdue.length > 0} />
        <StatCard label="Late submissions" value={<CountUp value={d.late.length} />} icon={Clock} href="/staff/assessments" />
        <StatCard label="Marks to publish" value={<CountUp value={d.pendingResults} />} icon={FileCheck} href="/staff/results" />
      </Reveal>
      <Reveal className="grid items-start gap-4 lg:grid-cols-3">
        <OverdueCard students={d.overdue} />
        <LateCard submissions={d.late} />
        <DeadlinesCard assessments={d.deadlines} />
      </Reveal>
    </>
  );
}
