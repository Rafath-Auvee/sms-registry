import type { Prisma } from "@/generated/prisma/client";

// SMS-2026-0001. The counter row is incremented inside the caller's transaction, so two
// enrolments at the same moment get different numbers, and a failed enrolment rolls the counter back.
export async function nextStudentId(tx: Prisma.TransactionClient, year: number) {
  const { last } = await tx.idCounter.upsert({
    where: { year },
    create: { year, last: 1 },
    update: { last: { increment: 1 } },
  });
  return `SMS-${year}-${String(last).padStart(4, "0")}`;
}
