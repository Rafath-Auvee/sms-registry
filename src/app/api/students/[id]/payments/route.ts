import { route, ok, requireRole, ApiError, readJson } from "@/lib/api";
import { paymentInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// Overpayment is allowed and shows as credit: refusing money that has already arrived helps no one.
export const POST = route(async (req, { params }: RouteContext<"/api/students/[id]/payments">) => {
  await requireRole("staff");
  const { id } = await params;
  const { amount, paidOn, reference } = paymentInput.parse(await readJson(req));
  if (!(await db.student.findUnique({ where: { id }, select: { id: true } }))) throw new ApiError(404, "Student not found.");
  if (await db.payment.findUnique({ where: { reference }, select: { id: true } }))
    throw new ApiError(409, `Payment ${reference} is already recorded.`, { reference: ["This reference is already recorded"] });
  return ok(await db.payment.create({ data: { studentId: id, amountPoisha: amount, paidOn, reference } }), 201);
});
