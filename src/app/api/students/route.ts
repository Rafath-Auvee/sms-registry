import { route, ok, requireRole, ApiError } from "@/lib/api";
import { studentInput } from "@/lib/schemas";
import { db } from "@/lib/db";
import { nextStudentId } from "@/lib/student-id";
import { cohortYear } from "@/lib/registry";

export const POST = route(async (req) => {
  await requireRole("staff");
  const data = studentInput.parse(await req.json());
  if (await db.student.findUnique({ where: { email: data.email }, select: { id: true } }))
    throw new ApiError(409, "A student with this email already exists.");
  const student = await db.$transaction(async (tx) => {
    const studentId = await nextStudentId(tx, cohortYear(data.academicYear));
    const s = await tx.student.create({ data: { ...data, studentId } });
    await tx.statusChange.create({ data: { studentId: s.id, to: "ENROLLED", reason: "New enrolment" } });
    return s;
  });
  return ok(student, 201);
});
