import Link from "next/link";
import { Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmissionBadge } from "@/components/assessments/submission-badge";
import { ToneBadge } from "@/components/common/tone-badge";
import { StatusBadge } from "@/components/students/status-badge";
import { MarkInput } from "@/components/results/mark-input";
import { ClassificationBadge, ResultStateBadge } from "@/components/results/result-badges";
import { dateTime, fileSize } from "@/lib/format";
import type { EnrolmentStatus } from "@/generated/prisma/enums";

type Row = {
  student: { id: string; studentId: string; fullName: string; status: EnrolmentStatus };
  submission: { id: string; fileName: string; sizeBytes: number; submittedAt: Date; version: number } | null;
  grade: { mark: number; published: boolean; withheldReason: string | null } | null;
};

// Everyone on the programme, so missing work is as visible as late work. Marks are entered inline.
export function AssessmentRoster({ assessmentId, deadline, rows }: { assessmentId: string; deadline: Date; rows: Row[] }) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Submission</TableHead>
            <TableHead className="hidden lg:table-cell">File</TableHead>
            <TableHead className="w-24">Mark</TableHead>
            <TableHead className="hidden md:table-cell">Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ student: s, submission: sub, grade }) => (
            <TableRow key={s.id}>
              <TableCell>
                <Link href={`/staff/students/${s.id}`} className="font-medium hover:underline">
                  {s.fullName}
                </Link>
                <div className="text-xs text-muted-foreground">{s.studentId}</div>
                {s.status !== "ENROLLED" && (
                  <div className="mt-1">
                    <StatusBadge status={s.status} />
                  </div>
                )}
              </TableCell>
              <TableCell>
                {!sub && s.status !== "ENROLLED" ? (
                  <ToneBadge tone="grey">Not expected</ToneBadge>
                ) : (
                  <SubmissionBadge submittedAt={sub?.submittedAt ?? null} deadline={deadline} />
                )}
                {sub && <div className="mt-1 text-xs text-muted-foreground">{dateTime(sub.submittedAt)}</div>}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {sub ? (
                  <a href={`/api/submissions/${sub.id}/file`} className="inline-flex items-center gap-1 text-sm hover:underline">
                    <Download className="size-3.5" />
                    <span className="max-w-40 truncate">{sub.fileName}</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
                {sub && (
                  <div className="text-xs text-muted-foreground">
                    {fileSize(sub.sizeBytes)}
                    {sub.version > 1 && ` · version ${sub.version}`}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <MarkInput studentId={s.id} assessmentId={assessmentId} mark={grade?.mark ?? null} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {grade ? (
                  <div className="flex flex-wrap gap-1">
                    <ClassificationBadge mark={grade.mark} />
                    <ResultStateBadge published={grade.published} withheldReason={grade.withheldReason} />
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not graded</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
