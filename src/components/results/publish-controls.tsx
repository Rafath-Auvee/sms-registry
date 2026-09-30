"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

// Publish or withhold all of one student's results. When fees are overdue the withhold
// reason is pre-filled, since that is the usual reason a Registry holds results back.
export function PublishControls({ studentId, name, overdue }: { studentId: string; name: string; overdue: boolean }) {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useSubmit();
  const url = `/api/students/${studentId}/results`;

  function withhold(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const reason = String(new FormData(e.currentTarget).get("reason") ?? "");
    submit(() => send(url, "POST", { publish: false, reason }), "Results withheld", () => setOpen(false));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => submit(() => send(url, "POST", { publish: true }), `Results published to ${name}`)}>
        Publish
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="sm" variant="outline" />}>Withhold</DialogTrigger>
        <DialogContent>
          <form onSubmit={withhold} className="grid gap-4" noValidate>
            <DialogHeader>
              <DialogTitle>Withhold results</DialogTitle>
              <DialogDescription>{name} will see that results are withheld and the reason, but not the marks.</DialogDescription>
            </DialogHeader>
            <FormField label="Reason" htmlFor="reason" error={error("reason")}>
              <Textarea id="reason" name="reason" rows={3} defaultValue={overdue ? "Outstanding tuition fees. Please contact the Registry." : ""} />
            </FormField>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Withhold results"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
