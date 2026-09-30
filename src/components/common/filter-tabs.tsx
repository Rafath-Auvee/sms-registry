import Link from "next/link";
import { cn } from "@/lib/utils";

// Link-based tabs for list filters: no client JS, and the filter stays in the URL.
export function FilterTabs({ base, param, current, options }: {
  base: string;
  param: string;
  current: string;
  options: { value: string; label: string; count?: number }[];
}) {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1 text-sm">
      {options.map((o) => (
        <Link
          key={o.value}
          href={o.value ? `${base}?${param}=${o.value}` : base}
          className={cn(
            "rounded-md px-3 py-1 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
            current === o.value && "bg-background text-foreground shadow-sm",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="ml-1.5 text-xs tabular-nums opacity-70">{o.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
