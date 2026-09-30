"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useSearchPending } from "@/components/students/search-pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { STATUS_LABEL } from "@/lib/format";

// Filters live in the URL, so a filtered list can be bookmarked or shared.
export function StudentFilters({ programmes }: { programmes: { id: string; code: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  // Set by Clear so the typing delay below doesn't re-apply the old filters mid-navigation.
  const cleared = useRef(false);
  const { pending, start } = useSearchPending();

  function set(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`${pathname}?${next}`));
  }

  // Search as you type, after a short pause.
  useEffect(() => {
    if (cleared.current) {
      cleared.current = false;
      return;
    }
    if (q === (params.get("q") ?? "")) return;
    const t = setTimeout(() => set("q", q.trim()), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const active = params.size > 0;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        {pending ? (
          <Spinner className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" aria-label="Searching" />
        ) : (
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, ID or email"
          aria-label="Search students"
          className="pl-8"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <NativeSelect aria-label="Programme" className="w-full sm:w-48" value={params.get("programme") ?? ""} onChange={(e) => set("programme", e.target.value)}>
          <NativeSelectOption value="">All programmes</NativeSelectOption>
          {programmes.map((p) => (
            <NativeSelectOption key={p.id} value={p.id}>
              {p.code}: {p.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect aria-label="Status" className="w-full sm:w-40" value={params.get("status") ?? ""} onChange={(e) => set("status", e.target.value)}>
          <NativeSelectOption value="">All statuses</NativeSelectOption>
          {Object.entries(STATUS_LABEL).map(([v, label]) => (
            <NativeSelectOption key={v} value={v}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start sm:self-auto"
          onClick={() => {
            cleared.current = true;
            setQ("");
            start(() => router.replace(pathname));
          }}
        >
          <X /> Clear
        </Button>
      )}
    </div>
  );
}
