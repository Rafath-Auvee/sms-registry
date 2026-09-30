import { route, ok, requireRole, ApiError } from "@/lib/api";
import { chargeInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// Charges the programme's current fee for the student's academic year. The amount is copied,
// so a later price change doesn't rewrite what this student was billed.
export const POST = route(async (req, { params }: RouteContext<"/api/students/[id]/charges">) => {
  await requireRole("staff");
  const { id } = await params;
  const { dueDate } = chargeInput.parse(await req.json());
  const s = await db.student.findUnique({ where: { id }, include: { programme: true } });
  if (!s) throw new ApiError(404, "Student not found.");
  if (await db.feeCharge.findUnique({ where: { studentId_academicYear: { studentId: id, academicYear: s.academicYear } } }))
    throw new ApiError(409, `Fees for ${s.academicYear} are already charged.`);
  const charge = await db.feeCharge.create({
    data: {
      studentId: id,
      academicYear: s.academicYear,
      description: `${s.programme.name} tuition ${s.academicYear}`,
      amountPoisha: s.programme.annualFeePoisha,
      dueDate,
    },
  });
  return ok(charge, 201);
});
