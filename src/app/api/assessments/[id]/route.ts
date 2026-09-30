import { route, ok, requireRole, ApiError } from "@/lib/api";
import { getAssessment } from "@/lib/queries";

// The assessment with every student on its programme: submission (without file contents) and grade.
export const GET = route(async (_req, { params }: RouteContext<"/api/assessments/[id]">) => {
  await requireRole("staff");
  const a = await getAssessment((await params).id);
  if (!a) throw new ApiError(404, "Assessment not found.");
  return ok(a);
});
