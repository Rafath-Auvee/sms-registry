import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, cohortYear, currentAcademicYear, feeSummary, isLate, submissionBlock } from "./registry";

const d = (s: string) => new Date(s);

test("classification boundaries", () => {
  assert.equal(classify(39), "Fail");
  assert.equal(classify(40), "Pass");
  assert.equal(classify(59), "Pass");
  assert.equal(classify(60), "Merit");
  assert.equal(classify(69), "Merit");
  assert.equal(classify(70), "Distinction");
  assert.equal(classify(100), "Distinction");
});

test("fees: paid, part paid, overdue, credit", () => {
  const today = d("2026-10-01");
  const charge = { amountPoisha: 100_000, dueDate: d("2026-09-01") };
  assert.deepEqual(feeSummary([charge], [{ amountPoisha: 100_000 }], today), {
    chargedPoisha: 100_000, paidPoisha: 100_000, balancePoisha: 0, overduePoisha: 0, daysOverdue: 0,
  });
  const part = feeSummary([charge], [{ amountPoisha: 30_000 }], today);
  assert.equal(part.overduePoisha, 70_000);
  assert.equal(part.daysOverdue, 30);
  const credit = feeSummary([charge], [{ amountPoisha: 120_000 }], today);
  assert.equal(credit.balancePoisha, -20_000);
  assert.equal(credit.overduePoisha, 0);
});

test("fees: not overdue on or before the due date", () => {
  const charge = { amountPoisha: 50_000, dueDate: d("2026-10-01") };
  assert.equal(feeSummary([charge], [], d("2026-10-01T23:00:00Z")).overduePoisha, 0);
  assert.equal(feeSummary([charge], [], d("2026-10-02")).daysOverdue, 1);
});

test("fees: payments settle the oldest charge first", () => {
  const charges = [
    { amountPoisha: 50_000, dueDate: d("2026-11-01") }, // not yet due
    { amountPoisha: 50_000, dueDate: d("2026-09-01") }, // past due
  ];
  const s = feeSummary(charges, [{ amountPoisha: 50_000 }], d("2026-10-01"));
  assert.equal(s.overduePoisha, 0); // the payment cleared the older charge
  assert.equal(s.balancePoisha, 50_000);
});

test("submissions: late flag and resubmission rules", () => {
  const deadline = d("2026-10-01T17:00:00Z");
  assert.equal(isLate(d("2026-10-01T16:59:00Z"), deadline), false);
  assert.equal(isLate(d("2026-10-01T17:01:00Z"), deadline), true);
  const before = d("2026-09-30T12:00:00Z");
  const after = d("2026-10-02T12:00:00Z");
  assert.equal(submissionBlock("ENROLLED", false, deadline, before), null);
  assert.equal(submissionBlock("ENROLLED", true, deadline, before), null); // resubmit before deadline
  assert.equal(submissionBlock("ENROLLED", false, deadline, after), null); // first submission late is accepted
  assert.match(submissionBlock("ENROLLED", true, deadline, after)!, /deadline has passed/);
  assert.match(submissionBlock("WITHDRAWN", false, deadline, before)!, /Only enrolled/);
});

test("academic year helpers", () => {
  assert.equal(cohortYear("2026/27"), 2026);
  assert.equal(currentAcademicYear(d("2026-09-01")), "2026/27");
  assert.equal(currentAcademicYear(d("2026-08-31")), "2025/26");
  assert.equal(currentAcademicYear(d("2099-12-01")), "2099/00");
});
