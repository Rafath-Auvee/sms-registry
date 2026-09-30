import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/common/table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-8 sm:w-80" />
        <Skeleton className="h-8 sm:w-48" />
        <Skeleton className="h-8 sm:w-40" />
      </div>
      <TableSkeleton rows={8} />
    </>
  );
}
