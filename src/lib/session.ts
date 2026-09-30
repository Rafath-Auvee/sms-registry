import { cookies } from "next/headers";

// Auth is out of scope (the brief allows a role toggle). The role and the student being viewed
// live in cookies, and every API route checks them, so the separation holds server-side too.
export type Role = "staff" | "student";

export async function getSession() {
  const c = await cookies();
  const role: Role = c.get("role")?.value === "student" ? "student" : "staff";
  return { role, studentId: c.get("sid")?.value ?? null };
}
