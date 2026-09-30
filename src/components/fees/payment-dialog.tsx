"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";
import { localToday } from "@/lib/format";

export function PaymentDialog({ studentId, balance }: { studentId: string; balance: string }) {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useSubmit();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    submit(() => send(`/api/students/${studentId}/payments`, "POST", body), "Payment recorded", () => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus /> Record payment
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
            <DialogDescription>Outstanding now: {balance}. Paying more than this leaves the student in credit.</DialogDescription>
          </DialogHeader>
          <FormField label="Amount (৳)" htmlFor="amount" error={error("amount")}>
            <Input id="amount" name="amount" type="number" inputMode="decimal" step="0.01" min="0.01" />
          </FormField>
          <FormField label="Date received" htmlFor="paidOn" error={error("paidOn")}>
            <Input id="paidOn" name="paidOn" type="date" defaultValue={localToday()} max={localToday()} />
          </FormField>
          <FormField label="Reference" htmlFor="reference" error={error("reference")} hint="Bank or receipt reference. Each can be used once.">
            <Input id="reference" name="reference" autoComplete="off" />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
