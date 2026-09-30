// Registry rules in one place, free of Prisma and React so they are easy to test (registry.test.ts).
import type { EnrolmentStatus } from "@/generated/prisma/enums";

export type Classification = "Distinction" | "Merit" | "Pass" | "Fail";

export function classify(mark: number): Classification {
  if (mark >= 70) return "Distinction";
  if (mark >= 60) return "Merit";
  if (mark >= 40) return "Pass";
  return "Fail";
}

const DAY = 86_400_000;

export type FeeSummary = {
  chargedPoisha: number;
  paidPoisha: number;
  balancePoisha: number; // negative means the student is in credit
  overduePoisha: number;
  daysOverdue: number; // counted from the oldest unpaid due date
};

// Payments settle the oldest charge first; whatever is still unpaid on a charge past its due date is overdue.
export function feeSummary(
  charges: { amountPoisha: number; dueDate: Date }[],
  payments: { amountPoisha: number }[],
  today = new Date(),
): FeeSummary {
  const chargedPoisha = charges.reduce((s, c) => s + c.amountPoisha, 0);
  const paidPoisha = payments.reduce((s, p) => s + p.amountPoisha, 0);
  let credit = paidPoisha;
  let overduePoisha = 0;
  let oldestUnpaid: Date | null = null;
  for (const c of [...charges].sort((a, b) => +a.dueDate - +b.dueDate)) {
    const unpaid = Math.max(0, c.amountPoisha - credit);
    credit = Math.max(0, credit - c.amountPoisha);
    if (unpaid > 0 && c.dueDate < startOfDay(today)) {
      overduePoisha += unpaid;
      oldestUnpaid ??= c.dueDate;
    }
  }
  return {
    chargedPoisha,
    paidPoisha,
    balancePoisha: chargedPoisha - paidPoisha,
    overduePoisha,
    daysOverdue: oldestUnpaid ? Math.floor((+startOfDay(today) - +oldestUnpaid) / DAY) : 0,
  };
}

function startOfDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export const isLate = (submittedAt: Date, deadline: Date) => submittedAt > deadline;

// Why a student may not upload right now, or null when they may.
export function submissionBlock(
  status: EnrolmentStatus,
  existing: boolean,
  deadline: Date,
  now = new Date(),
): string | null {
  if (status !== "ENROLLED") return `Only enrolled students can submit (status: ${status.toLowerCase()}).`;
  if (existing && now > deadline) return "The deadline has passed, so this submission can no longer be replaced.";
  return null;
}

// "2026/27" -> 2026. Student IDs use the cohort's start year.
export const cohortYear = (academicYear: string) => Number(academicYear.slice(0, 4));

export function currentAcademicYear(today = new Date()) {
  const y = today.getUTCMonth() >= 8 ? today.getUTCFullYear() : today.getUTCFullYear() - 1; // academic year starts in September
  return `${y}/${String((y + 1) % 100).padStart(2, "0")}`;
}
