import { route, ok, requireRole, ApiError, readJson } from "@/lib/api";
import { assessmentInput } from "@/lib/schemas";
import { db } from "@/lib/db";
import { listAssessments } from "@/lib/queries";

export const POST = route(async (req) => {
  await requireRole("staff");
  const data = assessmentInput.parse(await readJson(req));
  if (!(await db.module.findUnique({ where: { id: data.moduleId }, select: { id: true } }))) throw new ApiError(400, "Module not found.");
  return ok(await db.assessment.create({ data }), 201);
});

export const GET = route(async () => {
  await requireRole("staff");
  return ok(await listAssessments());
});
