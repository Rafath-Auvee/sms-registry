import { route, ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

// Staff can download any submission; a student only their own.
export const GET = route(async (_req, { params }: RouteContext<"/api/submissions/[id]/file">) => {
  const { id } = await params;
  const s = await db.submission.findUnique({ where: { id } });
  const session = await getSession();
  if (!s || (session.role === "student" && session.studentId !== s.studentId)) throw new ApiError(404, "File not found.");
  return new Response(s.data, {
    headers: {
      "Content-Type": s.mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(s.fileName)}`,
    },
  });
});
