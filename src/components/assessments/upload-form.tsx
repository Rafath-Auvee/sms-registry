"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

export function UploadForm({ assessmentId, replacing }: { assessmentId: string; replacing: boolean }) {
  const { submit, pending } = useSubmit();
  const form = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submit(
      () => send<{ late: boolean; resubmitted: boolean }>(`/api/assessments/${assessmentId}/submission`, "POST", data),
      (r) => `${r.resubmitted ? "Resubmitted" : "Submitted"}${r.late ? ". It was after the deadline, so it's marked late." : ""}`,
      () => form.current?.reset(),
    );
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        name="file"
        type="file"
        required
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-label="Choose a PDF or DOCX file"
        className="sm:max-w-xs"
      />
      <Button type="submit" size="sm" disabled={pending}>
        <Upload /> {pending ? "Uploading..." : replacing ? "Replace file" : "Submit"}
      </Button>
    </form>
  );
}
