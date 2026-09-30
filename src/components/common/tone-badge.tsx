import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Tone = "green" | "amber" | "red" | "blue" | "grey";

const TONES: Record<Tone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  blue: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  grey: "text-muted-foreground",
};

export function ToneBadge({ tone, className, children }: { tone: Tone; className?: string; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn(TONES[tone], className)}>
      {children}
    </Badge>
  );
}
