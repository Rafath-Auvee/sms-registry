import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionBadge } from "@/components/assessments/submission-badge";
import { UploadForm } from "@/components/assessments/upload-form";
import { dateTime, fileSize } from "@/lib/format";

type Props = {
  assessment: { id: string; title: string; deadline: Date; module: { code: string; title: string } };
  submission: { id: string; fileName: string; sizeBytes: number; submittedAt: Date; version: number } | null;
  blocked: string | null;
};

export function StudentAssessmentCard({ assessment: a, submission: sub, blocked }: Props) {
  const closed = a.deadline < new Date();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{a.title}</CardTitle>
        <CardDescription>
          {a.module.code} {a.module.title} · {closed ? "Closed" : "Due"} {dateTime(a.deadline)}
        </CardDescription>
        <CardAction>
          <SubmissionBadge submittedAt={sub?.submittedAt ?? null} deadline={a.deadline} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {sub && (
          <p>
            <a href={`/api/submissions/${sub.id}/file`} className="font-medium hover:underline">
              {sub.fileName}
            </a>{" "}
            <span className="text-muted-foreground">
              ({fileSize(sub.sizeBytes)}) submitted {dateTime(sub.submittedAt)}
              {sub.version > 1 && `, version ${sub.version}`}
            </span>
          </p>
        )}
        {blocked ? (
          <p className="text-muted-foreground">{blocked}</p>
        ) : (
          <>
            {closed && !sub && <p className="text-amber-700 dark:text-amber-400">The deadline has passed. You can still submit once, and it will be marked late.</p>}
            {!closed && sub && <p className="text-muted-foreground">You can replace your file until the deadline.</p>}
            <UploadForm assessmentId={a.id} replacing={!!sub} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
