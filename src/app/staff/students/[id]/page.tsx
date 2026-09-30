import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { SubmissionBadge } from "@/components/assessments/submission-badge";
import { StudentFees } from "@/components/fees/student-fees";
import { GradesTable } from "@/components/results/grades-table";
import { PublishControls } from "@/components/results/publish-controls";
import { StatusBadge } from "@/components/students/status-badge";
import { StatusDialog } from "@/components/students/status-dialog";
import { StatusHistory } from "@/components/students/status-history";
import { StudentDetails } from "@/components/students/student-details";
import { dateTime } from "@/lib/format";
import { getStudent } from "@/lib/queries";

const TABS = ["overview", "fees", "submissions", "results"] as const;

export default async function StudentPage({ params, searchParams }: PageProps<"/staff/students/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const s = await getStudent(id);
  if (!s) notFound();
  const tab = TABS.find((t) => t === sp.tab) ?? "overview";

  return (
    <>
      <PageHeader
        title={s.fullName}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{s.studentId}</span>
            <StatusBadge status={s.status} />
          </span>
        }
      >
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/staff/students/${s.id}/edit`} />}>
          <Pencil /> Edit
        </Button>
        <StatusDialog studentId={s.id} current={s.status} />
      </PageHeader>

      <Tabs defaultValue={tab}>
        <TabsList className="max-w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="grid items-start gap-4 lg:grid-cols-2">
          <StudentDetails student={s} />
          <StatusHistory changes={s.statusChanges} />
        </TabsContent>
        <TabsContent value="fees">
          <StudentFees student={s} />
        </TabsContent>
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {s.submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing submitted yet.</p>
              ) : (
                <ul className="divide-y">
                  {s.submissions.map((sub) => (
                    <li key={sub.id} className="flex flex-col gap-1 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <Link href={`/staff/assessments/${sub.assessmentId}`} className="font-medium hover:underline">
                          {sub.assessment.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {sub.assessment.module.code} ·{" "}
                          <a href={`/api/submissions/${sub.id}/file`} className="hover:underline">
                            {sub.fileName}
                          </a>{" "}
                          · {dateTime(sub.submittedAt)}
                        </div>
                      </div>
                      <SubmissionBadge submittedAt={sub.submittedAt} deadline={sub.assessment.deadline} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              {s.grades.length > 0 && (
                <CardAction>
                  <PublishControls studentId={s.id} name={s.fullName} overdue={s.fees.overduePoisha > 0} />
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              <GradesTable grades={s.grades} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
