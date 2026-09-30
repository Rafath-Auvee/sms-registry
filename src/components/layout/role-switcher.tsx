"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import { send, RequestError } from "@/lib/client";

type Option = { id: string; studentId: string; fullName: string };

// The brief allows a role toggle instead of auth. "Staff" or "view as <student>".
export function RoleSwitcher({ current, students }: { current: string; students: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function change(value: string) {
    const body = value === "staff" ? { role: "staff" } : { role: "student", studentId: value };
    start(async () => {
      try {
        await send("/api/session", "POST", body);
        router.push(value === "staff" ? "/staff" : "/student");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof RequestError ? e.message : "Could not switch view.");
      }
    });
  }

  return (
    <NativeSelect
      aria-label="Switch view"
      className="w-48 sm:w-80"
      value={current}
      disabled={pending}
      onChange={(e) => change(e.target.value)}
    >
      <NativeSelectOption value="staff">Staff (Registry)</NativeSelectOption>
      <NativeSelectOptGroup label="View as student">
        {students.map((s) => (
          <NativeSelectOption key={s.id} value={s.id}>
            {s.fullName} ({s.studentId})
          </NativeSelectOption>
        ))}
      </NativeSelectOptGroup>
    </NativeSelect>
  );
}
