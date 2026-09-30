import { route, ok, requireStudent, ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import { feeSummary } from "@/lib/registry";

// The student view in one call. Only published marks are included; unpublished ones are not sent at all.
export const GET = route(async () => {
  const id = await requireStudent();
  const s = await db.student.findUnique({
    where: { id },
    include: {
      programme: true,
      charges: { orderBy: { dueDate: "asc" } },
      payments: { orderBy: { paidOn: "desc" } },
      submissions: { omit: { data: true } },
      grades: { include: { assessment: { select: { title: true } } } },
    },
  });
  if (!s) throw new ApiError(404, "Student not found. Choose a student again.");
  const { grades, ...rest } = s;
  return ok({
    ...rest,
    fees: feeSummary(s.charges, s.payments),
    results: grades.map((g) => ({
      assessmentId: g.assessmentId,
      assessment: g.assessment.title,
      mark: g.published ? g.mark : null,
      status: g.published ? "published" : g.withheldReason ? "withheld" : "pending",
      withheldReason: g.withheldReason,
    })),
  });
});
