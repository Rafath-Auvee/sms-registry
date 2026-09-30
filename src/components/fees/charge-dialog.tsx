"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

// Assigns the programme fee for the student's academic year. Hidden once that year is charged.
export function ChargeDialog({ studentId, fee, year }: { studentId: string; fee: string; year: string }) {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useSubmit();
  const [in30Days] = useState(() => new Date(Date.now() + 30 * 86_400_000).toLocaleDateString("en-CA"));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    submit(() => send(`/api/students/${studentId}/charges`, "POST", body), "Fee charged", () => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Charge {year} fee</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Charge tuition fee</DialogTitle>
            <DialogDescription>
              {fee} for {year}, from the programme&apos;s fee. The amount is fixed on the charge, so later price changes won&apos;t alter it.
            </DialogDescription>
          </DialogHeader>
          <FormField label="Due date" htmlFor="dueDate" error={error("dueDate")}>
            <Input id="dueDate" name="dueDate" type="date" defaultValue={in30Days} />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Charge fee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
