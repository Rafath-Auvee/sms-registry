import { route, ok, requireRole, ApiError, readJson } from "@/lib/api";
import { resultsInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// Publish or withhold every result for one student.
export const POST = route(async (req, { params }: RouteContext<"/api/students/[id]/results">) => {
  await requireRole("staff");
  const { id } = await params;
  const { publish, reason } = resultsInput.parse(await readJson(req));
  const { count } = await db.grade.updateMany({
    where: { studentId: id },
    data: publish ? { published: true, withheldReason: null } : { published: false, withheldReason: reason },
  });
  if (!count) throw new ApiError(400, "This student has no grades yet.");
  return ok({ count });
});
