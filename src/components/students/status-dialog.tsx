"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";
import { STATUS_LABEL } from "@/lib/format";
import type { EnrolmentStatus } from "@/generated/prisma/enums";

export function StatusDialog({ studentId, current }: { studentId: string; current: EnrolmentStatus }) {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useSubmit();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    submit(() => send(`/api/students/${studentId}/status`, "POST", body), "Status updated", () => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Change status</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Change enrolment status</DialogTitle>
            <DialogDescription>Currently {STATUS_LABEL[current]}. The change is kept in the status history.</DialogDescription>
          </DialogHeader>
          <FormField label="New status" htmlFor="status" error={error("status")}>
            <NativeSelect id="status" name="status" className="w-full" defaultValue="">
              <NativeSelectOption value="" disabled>
                Choose a status
              </NativeSelectOption>
              {Object.entries(STATUS_LABEL)
                .filter(([v]) => v !== current)
                .map(([v, label]) => (
                  <NativeSelectOption key={v} value={v}>
                    {label}
                  </NativeSelectOption>
                ))}
            </NativeSelect>
          </FormField>
          <FormField label="Reason" htmlFor="reason" error={error("reason")} hint="Required when withdrawing or deferring">
            <Textarea id="reason" name="reason" rows={3} />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />}
              {pending ? "Saving..." : "Save status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
