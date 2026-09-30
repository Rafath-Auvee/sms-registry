"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

const MAX_BYTES = 10 * 1024 * 1024;

export function UploadForm({ assessmentId, replacing }: { assessmentId: string; replacing: boolean }) {
  const { submit, pending } = useSubmit();
  const form = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const file = data.get("file");
    // Quick checks before uploading; the server checks again, including the file's contents.
    if (!(file instanceof File) || !file.size) return void toast.error("Choose a file to upload.");
    if (!/\.(pdf|docx)$/i.test(file.name)) return void toast.error("Upload a PDF or DOCX file.");
    if (file.size > MAX_BYTES) return void toast.error("The file is over 10 MB.");
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
        {pending ? <Spinner /> : <Upload />} {pending ? "Uploading..." : replacing ? "Replace file" : "Submit"}
      </Button>
    </form>
  );
}
