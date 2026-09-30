import { route, ok, requireRole, ApiError, readJson } from "@/lib/api";
import { studentInput } from "@/lib/schemas";
import { db } from "@/lib/db";
import { getStudent } from "@/lib/queries";

// Edits details only. The Student ID never changes, and status has its own route so every change is logged.
export const PATCH = route(async (req, { params }: RouteContext<"/api/students/[id]">) => {
  await requireRole("staff");
  const { id } = await params;
  const data = studentInput.parse(await readJson(req));
  const s = await db.student.findUnique({
    where: { id },
    select: { programmeId: true, _count: { select: { submissions: true, grades: true } } },
  });
  if (!s) throw new ApiError(404, "Student not found.");
  const clash = await db.student.findUnique({ where: { email: data.email }, select: { id: true } });
  if (clash && clash.id !== id) throw new ApiError(409, "Another student already uses this email.", { email: ["Already used by another student"] });
  // Coursework belongs to the programme it was set on. Moving a student with work on record would
  // leave it attached to the wrong programme, so that is a withdrawal and a new enrolment instead.
  if (data.programmeId !== s.programmeId) {
    if (s._count.submissions || s._count.grades)
      throw new ApiError(409, "This student has coursework on their current programme. Withdraw them and enrol on the new programme instead.", {
        programmeId: ["Can't change: coursework on record"],
      });
    if (!(await db.programme.findUnique({ where: { id: data.programmeId }, select: { id: true } })))
      throw new ApiError(400, "Choose a programme from the list.", { programmeId: ["Choose a programme from the list"] });
  }
  return ok(await db.student.update({ where: { id }, data }));
});

// One student with status history, charges, payments, submissions (without file contents) and grades.
export const GET = route(async (_req, { params }: RouteContext<"/api/students/[id]">) => {
  await requireRole("staff");
  const s = await getStudent((await params).id);
  if (!s) throw new ApiError(404, "Student not found.");
  return ok(s);
});
