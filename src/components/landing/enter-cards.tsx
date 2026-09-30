"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { send, RequestError } from "@/lib/client";

type Option = { id: string; studentId: string; fullName: string };

// No login (the brief allows a role toggle): pick a view and go.
export function EnterCards({ students }: { students: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");

  function enter(role: "staff" | "student") {
    start(async () => {
      try {
        await send("/api/session", "POST", role === "staff" ? { role } : { role, studentId });
        router.push(`/${role}`);
      } catch (e) {
        toast.error(e instanceof RequestError ? e.message : "Could not open that view.");
      }
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <ShieldCheck className="size-6 text-primary" />
          <CardTitle className="text-lg">Registry staff</CardTitle>
          <CardDescription>Enrol students, record payments, create assessments, enter marks and publish results.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1" />
        <CardFooter>
          <Button className="w-full sm:w-auto" disabled={pending} onClick={() => enter("staff")}>
            Open staff view <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <GraduationCap className="size-6 text-primary" />
          <CardTitle className="text-lg">Student</CardTitle>
          <CardDescription>See your balance, upload coursework and read your published marksheet.</CardDescription>
        </CardHeader>
        <CardContent>
          <NativeSelect aria-label="Student to view as" className="w-full" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {students.map((s) => (
              <NativeSelectOption key={s.id} value={s.id}>
                {s.fullName} ({s.studentId})
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full sm:w-auto" disabled={pending || !studentId} onClick={() => enter("student")}>
            Open student view <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
