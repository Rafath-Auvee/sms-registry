import type { EnrolmentStatus } from "@/generated/prisma/enums";

// Taka with lakh grouping and Latin digits: ৳1,20,000.00. Stored as integer poisha (1/100 taka).
const bdt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "BDT", currencyDisplay: "narrowSymbol" });
export const money = (poisha: number) => bdt.format(poisha / 100);

// Calendar dates (date of birth, due dates) are stored at UTC midnight, so format them in UTC.
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const date = (d: Date) => day.format(d);

// Deadlines and submission times are moments; show them in Bangladesh time.
const moment = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka",
});
export const dateTime = (d: Date) => moment.format(d);

export const STATUS_LABEL: Record<EnrolmentStatus, string> = {
  ENROLLED: "Enrolled",
  DEFERRED: "Deferred",
  WITHDRAWN: "Withdrawn",
  COMPLETED: "Completed",
};

// For <input type="date"> and <input type="datetime-local"> default values.
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export function lateBy(submittedAt: Date, deadline: Date) {
  const mins = Math.round((+submittedAt - +deadline) / 60_000);
  if (mins < 60) return `${mins} min late`;
  if (mins < 60 * 48) return `${Math.round(mins / 60)} h late`;
  return `${Math.round(mins / 1440)} days late`;
}

export const fileSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
