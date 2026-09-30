"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

// Saves when the field loses focus or on Enter, only if the value changed.
export function MarkInput({ studentId, assessmentId, mark }: { studentId: string; assessmentId: string; mark: number | null }) {
  const [value, setValue] = useState(mark?.toString() ?? "");
  const { submit, pending, error } = useSubmit();

  function save() {
    if (value.trim() === "" || value === mark?.toString()) return;
    submit(() => send("/api/grades", "PUT", { studentId, assessmentId, mark: value }), "Mark saved");
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
        aria-label="Mark out of 100"
        aria-invalid={!!error("mark")}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), e.preventDefault())}
        className="h-8 w-20 tabular-nums"
      />
      {error("mark") && <p className="mt-1 text-xs text-destructive">{error("mark")}</p>}
    </div>
  );
}
