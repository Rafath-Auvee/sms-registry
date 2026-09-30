import { cookies } from "next/headers";
import { route, ok, ApiError } from "@/lib/api";
import { sessionInput } from "@/lib/schemas";
import { db } from "@/lib/db";

// The role toggle. A student view must point at a real student.
export const POST = route(async (req) => {
  const { role, studentId } = sessionInput.parse(await req.json());
  if (role === "student") {
    if (!studentId || !(await db.student.findUnique({ where: { id: studentId }, select: { id: true } })))
      throw new ApiError(400, "Choose a student to view as.");
  }
  const c = await cookies();
  c.set("role", role, { path: "/", sameSite: "lax" });
  if (role === "student") c.set("sid", studentId!, { path: "/", sameSite: "lax" });
  else c.delete("sid");
  return ok({ role });
});
