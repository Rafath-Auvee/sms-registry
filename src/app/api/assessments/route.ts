import { route, ok, requireRole, ApiError } from "@/lib/api";
import { assessmentInput } from "@/lib/schemas";
import { db } from "@/lib/db";

export const POST = route(async (req) => {
  await requireRole("staff");
  const data = assessmentInput.parse(await req.json());
  if (!(await db.module.findUnique({ where: { id: data.moduleId }, select: { id: true } }))) throw new ApiError(400, "Module not found.");
  return ok(await db.assessment.create({ data }), 201);
});
