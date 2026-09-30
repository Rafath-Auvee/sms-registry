// Demo data. Clears every table and rebuilds the same data set, with dates relative to today
// so overdue fees, late submissions and closed assessments stay that way whenever it runs.
import "dotenv/config";
import { db } from "../src/lib/db";
import { nextStudentId } from "../src/lib/student-id";
import { cohortYear, currentAcademicYear } from "../src/lib/registry";
import type { EnrolmentStatus } from "../src/generated/prisma/enums";

const DAY = 86_400_000;
const days = (n: number, hour = 12) => {
  const d = new Date(Date.now() + n * DAY);
  d.setUTCHours(hour, 0, 0, 0);
  return d;
};
const dateOnly = (n: number) => new Date(days(n).toISOString().slice(0, 10));
const taka = (n: number) => Math.round(n * 100); // to poisha

// Smallest valid one-page PDF, so downloads open in a viewer.
const pdf = (text: string) =>
  new TextEncoder().encode(
    `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n` +
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n` +
      `4 0 obj<</Length ${text.length + 35}>>stream\nBT /F1 18 Tf 72 760 Td (${text}) Tj ET\nendstream endobj\n` +
      `5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n`,
  );

async function main() {
  const year = currentAcademicYear();
  const lastYear = `${cohortYear(year) - 1}/${String(cohortYear(year) % 100).padStart(2, "0")}`;

  await db.$transaction([
    db.grade.deleteMany(),
    db.submission.deleteMany(),
    db.assessment.deleteMany(),
    db.payment.deleteMany(),
    db.feeCharge.deleteMany(),
    db.statusChange.deleteMany(),
    db.student.deleteMany(),
    db.module.deleteMany(),
    db.programme.deleteMany(),
    db.idCounter.deleteMany(),
  ]);

  const cs = await db.programme.create({
    data: {
      code: "BSC-CS",
      name: "BSc Computer Science",
      annualFeePoisha: taka(120_000),
      modules: { create: [{ code: "CS101", title: "Programming Fundamentals" }, { code: "CS102", title: "Databases" }] },
    },
    include: { modules: true },
  });
  const bm = await db.programme.create({
    data: {
      code: "BA-BM",
      name: "BA Business Management",
      annualFeePoisha: taka(95_000),
      modules: { create: [{ code: "BM101", title: "Principles of Marketing" }, { code: "BM102", title: "Accounting Basics" }] },
    },
    include: { modules: true },
  });
  const mod = Object.fromEntries([...cs.modules, ...bm.modules].map((m) => [m.code, m.id]));

  type Seed = {
    name: string;
    email: string;
    dob: string;
    programme: typeof cs;
    year?: string;
    status?: EnrolmentStatus;
    reason?: string;
    fee?: { dueIn: number; paid: number[] }; // dueIn days from today (negative = past)
  };
  // Each student shows a different Registry case; see the comment on each line.
  const seeds: Seed[] = [
    { name: "Amelia Hart", email: "amelia.hart@example.ac.uk", dob: "2006-03-14", programme: cs, fee: { dueIn: -30, paid: [120_000] } }, // paid in full
    { name: "Omar Farouk", email: "omar.farouk@example.ac.uk", dob: "2005-11-02", programme: cs, fee: { dueIn: 20, paid: [40_000] } }, // part paid, not yet due
    { name: "Priya Nair", email: "priya.nair@example.ac.uk", dob: "2006-07-21", programme: cs, fee: { dueIn: -45, paid: [25_000] } }, // overdue 45 days
    { name: "Yusuf Ahmed", email: "yusuf.ahmed@example.ac.uk", dob: "2007-01-09", programme: cs }, // new, fee not charged yet
    { name: "Daniel Okafor", email: "daniel.okafor@example.ac.uk", dob: "2005-05-30", programme: cs, status: "DEFERRED", reason: "Medical grounds, returning next September", fee: { dueIn: 60, paid: [20_000] } },
    { name: "Sofia Rossi", email: "sofia.rossi@example.ac.uk", dob: "2006-09-18", programme: bm, fee: { dueIn: -10, paid: [60_000, 40_000] } }, // overpaid, in credit
    { name: "Liam Walsh", email: "liam.walsh@example.ac.uk", dob: "2006-02-11", programme: bm, fee: { dueIn: -12, paid: [] } }, // overdue, results withheld
    { name: "Chloe Martin", email: "chloe.martin@example.ac.uk", dob: "2005-12-25", programme: bm, status: "WITHDRAWN", reason: "Left for employment", fee: { dueIn: -60, paid: [45_000] } },
    { name: "Hannah Lee", email: "hannah.lee@example.ac.uk", dob: "2004-04-04", programme: bm, year: lastYear, status: "COMPLETED", reason: "Programme completed", fee: { dueIn: -300, paid: [95_000] } },
  ];

  let ref = 1000;
  const students: Record<string, string> = {};
  for (const s of seeds) {
    const academicYear = s.year ?? year;
    const created = await db.$transaction(async (tx) => {
      const studentId = await nextStudentId(tx, cohortYear(academicYear));
      const st = await tx.student.create({
        data: {
          studentId,
          fullName: s.name,
          email: s.email,
          dateOfBirth: new Date(s.dob),
          programmeId: s.programme.id,
          academicYear,
          status: s.status ?? "ENROLLED",
        },
      });
      await tx.statusChange.create({ data: { studentId: st.id, to: "ENROLLED", reason: "New enrolment", changedAt: days(-90) } });
      if (s.status) await tx.statusChange.create({ data: { studentId: st.id, from: "ENROLLED", to: s.status, reason: s.reason } });
      if (s.fee) {
        await tx.feeCharge.create({
          data: {
            studentId: st.id,
            academicYear,
            description: `${s.programme.name} tuition ${academicYear}`,
            amountPoisha: s.programme.annualFeePoisha,
            dueDate: dateOnly(s.fee.dueIn),
          },
        });
        for (const [i, amount] of s.fee.paid.entries())
          await tx.payment.create({
            data: { studentId: st.id, amountPoisha: taka(amount), paidOn: dateOnly(Math.min(-1, s.fee.dueIn - 5 + i * 3)), reference: `TRX-${ref++}` },
          });
      }
      return st;
    });
    students[s.name] = created.id;
  }

  const a = {
    algorithms: await db.assessment.create({ data: { title: "Coursework 1: Algorithms report", moduleId: mod.CS101, deadline: days(-14, 11) } }), // 17:00 Dhaka
    dbProject: await db.assessment.create({ data: { title: "Database design project", moduleId: mod.CS102, deadline: days(10, 11) } }), // 17:00 Dhaka
    marketing: await db.assessment.create({ data: { title: "Marketing plan", moduleId: mod.BM101, deadline: days(-20, 11) } }), // 17:00 Dhaka
    accounting: await db.assessment.create({ data: { title: "Accounting case study", moduleId: mod.BM102, deadline: days(5, 11) } }), // 17:00 Dhaka
  };

  const submit = (who: string, assessment: { id: string; deadline: Date }, offsetHours: number, version = 1) =>
    db.submission.create({
      data: {
        studentId: students[who],
        assessmentId: assessment.id,
        fileName: `${who.split(" ")[1].toLowerCase()}-${assessment.id.slice(-4)}.pdf`,
        mimeType: "application/pdf",
        data: pdf(`${who}: ${assessment.id}`),
        sizeBytes: pdf(`${who}: ${assessment.id}`).length,
        submittedAt: new Date(+assessment.deadline + offsetHours * 3_600_000),
        version,
      },
    });
  await Promise.all([
    submit("Amelia Hart", a.algorithms, -30), // on time
    submit("Omar Farouk", a.algorithms, 50), // 2 days late
    submit("Priya Nair", a.algorithms, -2),
    // Yusuf never submitted: shows as Missing
    submit("Amelia Hart", a.dbProject, -60, 2), // resubmitted before the deadline
    submit("Sofia Rossi", a.marketing, -5),
    submit("Liam Walsh", a.marketing, 5), // 5 hours late
    submit("Hannah Lee", a.marketing, -48),
  ]);

  const grade = (who: string, assessment: { id: string }, mark: number, published = false, withheldReason?: string) =>
    db.grade.create({ data: { studentId: students[who], assessmentId: assessment.id, mark, published, withheldReason } });
  await Promise.all([
    grade("Amelia Hart", a.algorithms, 74, true), // Distinction, published
    grade("Omar Farouk", a.algorithms, 58), // Pass, waiting to be published
    grade("Priya Nair", a.algorithms, 35), // Fail, waiting to be published
    grade("Yusuf Ahmed", a.algorithms, 0), // non-submission recorded as 0
    grade("Sofia Rossi", a.marketing, 66, true), // Merit, published
    grade("Liam Walsh", a.marketing, 45, false, "Outstanding tuition fees. Please contact the Registry."), // withheld
    grade("Hannah Lee", a.marketing, 81, true), // Distinction, published
  ]);

  console.log(`Seeded 2 programmes, ${seeds.length} students, 4 assessments, 7 submissions, 7 grades (${year}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
