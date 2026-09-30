import { route, ok, requireRole, ApiError, readJson, retryOnConflict } from "@/lib/api";
import { studentInput } from "@/lib/schemas";
import { db } from "@/lib/db";
import { listStudents } from "@/lib/queries";
import { nextStudentId } from "@/lib/student-id";
import { cohortYear } from "@/lib/registry";

export const POST = route(async (req) => {
  await requireRole("staff");
  const data = studentInput.parse(await readJson(req));
  if (!(await db.programme.findUnique({ where: { id: data.programmeId }, select: { id: true } })))
    throw new ApiError(400, "Choose a programme from the list.", { programmeId: ["Choose a programme from the list"] });
  if (await db.student.findUnique({ where: { email: data.email }, select: { id: true } }))
    throw new ApiError(409, "A student with this email already exists.", { email: ["Already used by another student"] });
  const student = await retryOnConflict(() =>
    db.$transaction(async (tx) => {
      const studentId = await nextStudentId(tx, cohortYear(data.academicYear));
      const s = await tx.student.create({ data: { ...data, studentId } });
      await tx.statusChange.create({ data: { studentId: s.id, to: "ENROLLED", reason: "New enrolment" } });
      return s;
    }),
  );
  return ok(student, 201);
});

// List with the same filters as the Students page: ?q=name, ID or email, &programme=<id>, &status=ENROLLED.
export const GET = route(async (req) => {
  await requireRole("staff");
  const p = new URL(req.url).searchParams;
  return ok(await listStudents({ q: p.get("q") ?? undefined, programme: p.get("programme") ?? undefined, status: p.get("status") ?? undefined }));
});
