import { route, ok, requireRole, ApiError } from "@/lib/api";
import { gradeInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// Enter or correct a mark. A new mark starts unpublished; correcting one keeps its publication state.
export const PUT = route(async (req) => {
  await requireRole("staff");
  const { studentId, assessmentId, mark } = gradeInput.parse(await req.json());
  const [s, a] = await Promise.all([
    db.student.findUnique({ where: { id: studentId }, select: { programmeId: true } }),
    db.assessment.findUnique({ where: { id: assessmentId }, include: { module: { select: { programmeId: true } } } }),
  ]);
  if (!s || !a) throw new ApiError(404, "Student or assessment not found.");
  if (s.programmeId !== a.module.programmeId) throw new ApiError(400, "This student is not on the assessment's programme.");
  const grade = await db.grade.upsert({
    where: { studentId_assessmentId: { studentId, assessmentId } },
    create: { studentId, assessmentId, mark },
    update: { mark },
  });
  return ok(grade);
});
