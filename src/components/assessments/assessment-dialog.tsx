"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

type Programme = { id: string; code: string; name: string; modules: { id: string; code: string; title: string }[] };

export function AssessmentDialog({ programmes }: { programmes: Programme[] }) {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useSubmit();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const local = String(form.get("deadline") || "");
    // datetime-local has no timezone; convert in the browser so the server stores the moment the user meant.
    const body = { ...Object.fromEntries(form), deadline: local ? new Date(local).toISOString() : "" };
    submit(() => send("/api/assessments", "POST", body), "Assessment created", () => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button disabled={!programmes.some((p) => p.modules.length)} />}>
        <Plus /> New assessment
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>New assessment</DialogTitle>
            <DialogDescription>Students on the module&apos;s programme can submit until the deadline. Late work is still accepted and flagged.</DialogDescription>
          </DialogHeader>
          <FormField label="Title" htmlFor="title" error={error("title")}>
            <Input id="title" name="title" placeholder="Coursework 1: Essay" />
          </FormField>
          <FormField label="Module" htmlFor="moduleId" error={error("moduleId")}>
            <NativeSelect id="moduleId" name="moduleId" className="w-full" defaultValue="">
              <NativeSelectOption value="" disabled>
                Choose a module
              </NativeSelectOption>
              {programmes.map((p) => (
                <NativeSelectOptGroup key={p.id} label={`${p.code}: ${p.name}`}>
                  {p.modules.map((m) => (
                    <NativeSelectOption key={m.id} value={m.id}>
                      {m.code} {m.title}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Submission deadline" htmlFor="deadline" error={error("deadline")} hint="Your local time">
            <Input id="deadline" name="deadline" type="datetime-local" />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Spinner />}
              {pending ? "Creating..." : "Create assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
