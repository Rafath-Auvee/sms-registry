import { route, ok, requireRole, ApiError } from "@/lib/api";
import { studentInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// Edits details only. The Student ID never changes, and status has its own route so every change is logged.
export const PATCH = route(async (req, { params }: RouteContext<"/api/students/[id]">) => {
  await requireRole("staff");
  const { id } = await params;
  const data = studentInput.parse(await req.json());
  const clash = await db.student.findUnique({ where: { email: data.email }, select: { id: true } });
  if (clash && clash.id !== id) throw new ApiError(409, "Another student already uses this email.");
  return ok(await db.student.update({ where: { id }, data }));
});
