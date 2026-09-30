import { z } from "zod";
import { EnrolmentStatus } from "@/generated/prisma/enums";
import { dhakaToday } from "@/lib/registry";

const yearsAgo = (n: number) => {
  const d = dhakaToday();
  d.setUTCFullYear(d.getUTCFullYear() - n);
  return d;
};

// "2026/27": second year must follow the first.
const academicYear = z
  .string()
  .regex(/^\d{4}\/\d{2}$/, "Use the format 2026/27")
  .refine((v) => (Number(v.slice(0, 4)) + 1) % 100 === Number(v.slice(5)), "The second year must follow the first")
  .refine((v) => Math.abs(Number(v.slice(0, 4)) - dhakaToday().getUTCFullYear()) <= 10, "Check the academic year");

export const studentInput = z.object({
  fullName: z.string().trim().min(2, "Enter the full name").max(100),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  dateOfBirth: z.coerce
    .date({ error: "Enter a date of birth" })
    .refine((d) => d <= yearsAgo(16), "Students must be at least 16")
    .refine((d) => d >= yearsAgo(100), "Check the year of birth"),
  programmeId: z.string().min(1, "Choose a programme"),
  academicYear,
});

export const statusInput = z
  .object({
    status: z.enum(EnrolmentStatus),
    reason: z.string().trim().max(300).optional().transform((v) => v || undefined),
  })
  .refine((v) => !(v.status === "WITHDRAWN" || v.status === "DEFERRED") || v.reason, {
    message: "Give a reason for withdrawing or deferring",
    path: ["reason"],
  });

// Taka in, poisha out, so money is never a float in the database.
const taka = z.coerce
  .number({ error: "Enter an amount" })
  .positive("Amount must be more than zero")
  .max(100_000_000)
  .refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6, "Use at most 2 decimal places")
  .transform((v) => Math.round(v * 100));

export const paymentInput = z.object({
  amount: taka,
  paidOn: z.coerce.date({ error: "Enter the payment date" }).refine((d) => d <= dhakaToday(), "Payment date can't be in the future"),
  reference: z.string().trim().toUpperCase().min(3, "Enter the payment reference").max(50),
});

export const chargeInput = z.object({
  dueDate: z.coerce.date({ error: "Enter a due date" }),
});

export const assessmentInput = z.object({
  title: z.string().trim().min(3, "Enter a title").max(120),
  moduleId: z.string().min(1, "Choose a module"),
  deadline: z.coerce.date({ error: "Enter a deadline" }).refine((d) => d > new Date(), "The deadline must be in the future"),
});

export const gradeInput = z.object({
  studentId: z.string().min(1),
  assessmentId: z.string().min(1),
  mark: z.coerce.number().int("Marks are whole numbers").min(0, "Marks are 0 to 100").max(100, "Marks are 0 to 100"),
});

export const resultsInput = z
  .object({
    publish: z.boolean(),
    reason: z.string().trim().max(300).optional().transform((v) => v || undefined),
  })
  .refine((v) => v.publish || v.reason, { message: "Give a reason for withholding", path: ["reason"] });

export const sessionInput = z.object({
  role: z.enum(["staff", "student"]),
  studentId: z.string().optional(),
});
