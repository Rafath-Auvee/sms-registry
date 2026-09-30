import "server-only";
import { db } from "@/lib/db";
import { feeSummary, isLate } from "@/lib/registry";
import type { EnrolmentStatus, Prisma } from "@/generated/prisma/client";

const money = { charges: { select: { amountPoisha: true, dueDate: true } }, payments: { select: { amountPoisha: true } } };

export const listProgrammes = () =>
  db.programme.findMany({ orderBy: { name: "asc" }, include: { modules: { orderBy: { code: "asc" } } } });

export type StudentFilters = { q?: string; programme?: string; status?: string };

export async function listStudents({ q, programme, status }: StudentFilters) {
  const where: Prisma.StudentWhereInput = {};
  if (q?.trim())
    where.OR = [
      { fullName: { contains: q.trim(), mode: "insensitive" } },
      { studentId: { contains: q.trim(), mode: "insensitive" } },
      { email: { contains: q.trim(), mode: "insensitive" } },
    ];
  if (programme) where.programmeId = programme;
  if (status) where.status = status as EnrolmentStatus;
  const rows = await db.student.findMany({
    where,
    orderBy: { studentId: "asc" },
    include: { programme: { select: { code: true, name: true } }, ...money },
  });
  return rows.map(({ charges, payments, ...s }) => ({ ...s, fees: feeSummary(charges, payments) }));
}

export const studentOptions = () =>
  db.student.findMany({ orderBy: { fullName: "asc" }, select: { id: true, studentId: true, fullName: true } });

export async function getStudent(id: string) {
  const s = await db.student.findUnique({
    where: { id },
    include: {
      programme: true,
      statusChanges: { orderBy: { changedAt: "desc" } },
      charges: { orderBy: { dueDate: "asc" } },
      payments: { orderBy: { paidOn: "desc" } },
      submissions: { omit: { data: true }, include: { assessment: { include: { module: true } } } },
      grades: { include: { assessment: { include: { module: true } } } },
    },
  });
  return s && { ...s, fees: feeSummary(s.charges, s.payments) };
}

export async function dashboard() {
  const [students, submissions, pending, deadlines] = await Promise.all([
    db.student.findMany({ include: { programme: { select: { code: true } }, ...money } }),
    db.submission.findMany({
      omit: { data: true },
      include: { student: { select: { id: true, fullName: true, studentId: true } }, assessment: true },
      orderBy: { submittedAt: "desc" },
    }),
    db.grade.count({ where: { published: false, withheldReason: null } }),
    db.assessment.findMany({
      where: { deadline: { gte: new Date() } },
      orderBy: { deadline: "asc" },
      take: 5,
      include: { module: true, _count: { select: { submissions: true } } },
    }),
  ]);
  const withFees = students.map(({ charges, payments, ...s }) => ({ ...s, fees: feeSummary(charges, payments) }));
  const byStatus = (st: EnrolmentStatus) => students.filter((s) => s.status === st).length;
  return {
    counts: { enrolled: byStatus("ENROLLED"), deferred: byStatus("DEFERRED"), total: students.length },
    outstandingPoisha: withFees.reduce((sum, s) => sum + Math.max(0, s.fees.balancePoisha), 0),
    overdue: withFees.filter((s) => s.fees.overduePoisha > 0).sort((a, b) => b.fees.daysOverdue - a.fees.daysOverdue),
    late: submissions.filter((s) => isLate(s.submittedAt, s.assessment.deadline)),
    pendingResults: pending,
    deadlines,
  };
}

export const listAssessments = () =>
  db.assessment.findMany({
    orderBy: { deadline: "desc" },
    include: { module: { include: { programme: true } }, _count: { select: { submissions: true, grades: true } } },
  });

// Everyone on the module's programme, with their submission and grade for this assessment.
export async function getAssessment(id: string) {
  const a = await db.assessment.findUnique({ where: { id }, include: { module: { include: { programme: true } } } });
  if (!a) return null;
  const students = await db.student.findMany({
    where: { programmeId: a.module.programmeId },
    orderBy: { fullName: "asc" },
    include: {
      submissions: { where: { assessmentId: id }, omit: { data: true } },
      grades: { where: { assessmentId: id } },
    },
  });
  return {
    ...a,
    rows: students.map(({ submissions, grades, ...s }) => ({ student: s, submission: submissions[0] ?? null, grade: grades[0] ?? null })),
  };
}

// Staff results view: one row per student who has at least one grade.
export async function listResults() {
  const students = await db.student.findMany({
    where: { grades: { some: {} } },
    orderBy: { fullName: "asc" },
    include: { programme: { select: { code: true } }, grades: { include: { assessment: true } }, ...money },
  });
  return students.map(({ charges, payments, ...s }) => ({ ...s, fees: feeSummary(charges, payments) }));
}

// Student view: assessments on their programme, with their own submission.
export async function studentAssessments(studentId: string) {
  const s = await db.student.findUnique({ where: { id: studentId }, select: { programmeId: true, status: true } });
  if (!s) return null;
  const assessments = await db.assessment.findMany({
    where: { module: { programmeId: s.programmeId } },
    orderBy: { deadline: "asc" },
    include: { module: true, submissions: { where: { studentId }, omit: { data: true } } },
  });
  return { status: s.status, assessments };
}
