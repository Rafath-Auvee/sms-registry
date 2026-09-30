import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  alert,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: LucideIcon;
  href?: string;
  alert?: boolean;
}) {
  const card = (
    <Card className={cn("h-full transition-colors", href && "hover:bg-muted/50", alert && "ring-red-300 dark:ring-red-900")}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={cn("text-2xl font-semibold tabular-nums", alert && "text-red-600 dark:text-red-400")}>{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}
