"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/common/form-field";
import { send, RequestError } from "@/lib/client";

type Option = { id: string; studentId: string; fullName: string };

// Pick a student and open their view, without leaving the hero.
export function StudentCta({ students }: { students: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");

  function open() {
    start(async () => {
      try {
        await send("/api/session", "POST", { role: "student", studentId });
        router.push("/student");
      } catch (e) {
        toast.error(e instanceof RequestError ? e.message : "Could not open the student view.");
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="h-10 rounded-[0.6rem] px-5 text-sm" disabled={!students.length} />}>
        View as a student
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View as a student</DialogTitle>
          <DialogDescription>See the portal the way this student does: their balance, coursework and published results.</DialogDescription>
        </DialogHeader>
        <FormField label="Student" htmlFor="hero-student">
          <NativeSelect id="hero-student" className="w-full" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {students.map((s) => (
              <NativeSelectOption key={s.id} value={s.id}>
                {s.fullName} ({s.studentId})
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <DialogFooter>
          <Button onClick={open} disabled={pending || !studentId}>
            {pending && <Spinner />}
            {pending ? "Opening..." : "Open student view"}
            {!pending && <ArrowRight />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
