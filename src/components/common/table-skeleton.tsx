import { Skeleton } from "@/components/ui/skeleton";

// Placeholder rows shaped like our tables: a two-line first column and a badge column.
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border" role="status" aria-label="Loading">
      <div className="flex gap-4 border-b p-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="ml-auto hidden h-4 w-24 md:block" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b p-3 last:border-0">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="ml-auto hidden h-4 w-40 md:block" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
