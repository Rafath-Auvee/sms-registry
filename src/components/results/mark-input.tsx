"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

// Saves when the field loses focus or on Enter, only if the value changed.
// Clearing the field removes the mark.
export function MarkInput({ studentId, assessmentId, mark }: { studentId: string; assessmentId: string; mark: number | null }) {
  const [value, setValue] = useState(mark?.toString() ?? "");
  const { submit, pending, error } = useSubmit();

  function save() {
    const v = value.trim();
    if (v === (mark?.toString() ?? "")) return;
    if (v === "") return submit(() => send("/api/grades", "DELETE", { studentId, assessmentId }), "Mark removed");
    submit(() => send("/api/grades", "PUT", { studentId, assessmentId, mark: v }), "Mark saved");
  }

  return (
    <div>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={pending}
        placeholder="0 to 100"
        aria-label="Mark out of 100"
        aria-invalid={!!error("mark")}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === "Escape") setValue(mark?.toString() ?? "");
        }}
        className="h-8 w-24 tabular-nums"
      />
      {error("mark") && <p className="mt-1 text-xs text-destructive">{error("mark")}</p>}
    </div>
  );
}
