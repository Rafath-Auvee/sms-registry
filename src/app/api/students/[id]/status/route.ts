import { route, ok, requireRole, ApiError, readJson } from "@/lib/api";
import { statusInput } from "@/lib/schemas";
import { db } from "@/lib/db";

export const POST = route(async (req, { params }: RouteContext<"/api/students/[id]/status">) => {
  await requireRole("staff");
  const { id } = await params;
  const { status, reason } = statusInput.parse(await readJson(req));
  const s = await db.student.findUnique({ where: { id }, select: { status: true } });
  if (!s) throw new ApiError(404, "Student not found.");
  if (s.status === status) throw new ApiError(400, "The student already has this status.");
  // Reinstating someone who left or finished is unusual enough to need a recorded reason.
  if ((s.status === "WITHDRAWN" || s.status === "COMPLETED") && !reason)
    throw new ApiError(400, "Give a reason for reinstating this student.", { reason: ["Required when reinstating"] });
  await db.$transaction([
    db.student.update({ where: { id }, data: { status } }),
    db.statusChange.create({ data: { studentId: id, from: s.status, to: status, reason } }),
  ]);
  return ok({ status });
});
