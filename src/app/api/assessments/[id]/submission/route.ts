import { route, ok, requireStudent, ApiError, readForm } from "@/lib/api";
import { db } from "@/lib/db";
import { isLate, submissionBlock } from "@/lib/registry";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] }, // zip
};

// Student uploads or replaces their file. Checked by extension and by the file's first bytes,
// so a renamed image is refused.
export const POST = route(async (req, { params }: RouteContext<"/api/assessments/[id]/submission">) => {
  const studentId = await requireStudent();
  const { id: assessmentId } = await params;
  const file = (await readForm(req)).get("file");
  if (!(file instanceof File) || file.size === 0) throw new ApiError(400, "Choose a file to upload.");
  if (file.size > MAX_BYTES) throw new ApiError(400, "The file is over 10 MB.");
  const type = TYPES[file.name.split(".").pop()?.toLowerCase() as keyof typeof TYPES];
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!type || !type.magic.every((b, i) => bytes[i] === b)) throw new ApiError(400, "Upload a PDF or DOCX file.");

  const [student, assessment, existing] = await Promise.all([
    db.student.findUnique({ where: { id: studentId }, select: { status: true, programmeId: true } }),
    db.assessment.findUnique({ where: { id: assessmentId }, include: { module: { select: { programmeId: true } } } }),
    db.submission.findUnique({ where: { studentId_assessmentId: { studentId, assessmentId } }, select: { id: true } }),
  ]);
  if (!student) throw new ApiError(404, "Student not found. Choose a student again from the switcher.");
  if (!assessment) throw new ApiError(404, "Assessment not found.");
  if (student.programmeId !== assessment.module.programmeId) throw new ApiError(403, "This assessment is not on your programme.");
  const now = new Date();
  const blocked = submissionBlock(student.status, !!existing, assessment.deadline, now);
  if (blocked) throw new ApiError(409, blocked);

  const upload = { fileName: file.name, mimeType: type.mime, sizeBytes: file.size, data: bytes, submittedAt: now };
  await db.submission.upsert({
    where: { studentId_assessmentId: { studentId, assessmentId } },
    create: { studentId, assessmentId, ...upload },
    update: { ...upload, version: { increment: 1 } },
  });
  return ok({ late: isLate(now, assessment.deadline), resubmitted: !!existing }, existing ? 200 : 201);
});
