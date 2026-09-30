import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/students/status-badge";
import { dateTime } from "@/lib/format";
import type { EnrolmentStatus } from "@/generated/prisma/enums";

type Change = { id: string; from: EnrolmentStatus | null; to: EnrolmentStatus; reason: string | null; changedAt: Date };

export function StatusHistory({ changes }: { changes: Change[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status history</CardTitle>
      </CardHeader>
      <CardContent>
        {changes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No changes recorded.</p>
        ) : (
          <ol className="space-y-3">
            {changes.map((c) => (
              <li key={c.id} className="flex flex-col gap-1 border-l-2 pl-3 text-sm">
                <div className="flex flex-wrap items-center gap-1.5">
                  {c.from && (
                    <>
                      <StatusBadge status={c.from} />
                      <span className="text-muted-foreground">to</span>
                    </>
                  )}
                  <StatusBadge status={c.to} />
                </div>
                {c.reason && <p>{c.reason}</p>}
                <p className="text-xs text-muted-foreground">{dateTime(c.changedAt)}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
