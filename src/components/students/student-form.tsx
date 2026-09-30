"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { FormField } from "@/components/common/form-field";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

type Values = { id?: string; fullName: string; email: string; dateOfBirth: string; programmeId: string; academicYear: string };

// Create and edit share this form. Status is changed separately so every change is logged with a reason.
export function StudentForm({ programmes, initial }: { programmes: { id: string; code: string; name: string }[]; initial: Values }) {
  const router = useRouter();
  const { submit, pending, error } = useSubmit();
  const editing = !!initial.id;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    submit(
      () => send<{ id: string; studentId: string }>(editing ? `/api/students/${initial.id}` : "/api/students", editing ? "PATCH" : "POST", body),
      (s) => (editing ? "Student updated" : `Enrolled as ${s.studentId}`),
      (s) => router.push(`/staff/students/${s.id}`),
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset disabled={pending} aria-busy={pending} className="grid max-w-2xl gap-4 disabled:opacity-80 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField label="Full name" htmlFor="fullName" error={error("fullName")}>
          <Input id="fullName" name="fullName" defaultValue={initial.fullName} autoComplete="off" aria-invalid={!!error("fullName")} />
        </FormField>
      </div>
      <FormField label="Email" htmlFor="email" error={error("email")}>
        <Input id="email" name="email" type="email" defaultValue={initial.email} aria-invalid={!!error("email")} />
      </FormField>
      <FormField label="Date of birth" htmlFor="dateOfBirth" error={error("dateOfBirth")}>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={initial.dateOfBirth} aria-invalid={!!error("dateOfBirth")} />
      </FormField>
      <FormField label="Programme" htmlFor="programmeId" error={error("programmeId")}>
        <NativeSelect id="programmeId" name="programmeId" className="w-full" defaultValue={initial.programmeId} aria-invalid={!!error("programmeId")}>
          <NativeSelectOption value="">Choose a programme</NativeSelectOption>
          {programmes.map((p) => (
            <NativeSelectOption key={p.id} value={p.id}>
              {p.code}: {p.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </FormField>
      <FormField label="Academic year" htmlFor="academicYear" error={error("academicYear")} hint="For example 2026/27">
        <Input id="academicYear" name="academicYear" defaultValue={initial.academicYear} aria-invalid={!!error("academicYear")} />
      </FormField>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          {pending ? (editing ? "Saving..." : "Enrolling...") : editing ? "Save changes" : "Enrol student"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      </fieldset>
    </form>
  );
}
