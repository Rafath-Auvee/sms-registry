import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassificationBadge } from "@/components/results/result-badges";

// What a student sees. The page passes a mark only for published results, so an unpublished
// mark never reaches the browser.
export type MarksheetRow = { id: string; title: string; module: string; mark: number | null };

export function Marksheet({ rows, withheldReason }: { rows: MarksheetRow[]; withheldReason: string | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marksheet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {withheldReason && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            <p className="font-medium">Your results are withheld</p>
            <p>{withheldReason}</p>
          </div>
        )}
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead className="text-right">Mark</TableHead>
                <TableHead className="hidden sm:table-cell">Classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.module}</div>
                    {r.mark !== null && (
                      <div className="mt-1 sm:hidden">
                        <ClassificationBadge mark={r.mark} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{r.mark ?? "Pending"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {r.mark === null ? <span className="text-sm text-muted-foreground">Awaiting publication</span> : <ClassificationBadge mark={r.mark} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
