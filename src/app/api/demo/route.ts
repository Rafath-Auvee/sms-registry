import { route, ok, ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import { loadDemoData } from "@/lib/demo-data";

// Loads the demo data, but only into an empty database, so it can never wipe real records.
// To reset a database that has data, run `npm run db:seed`.
export const POST = route(async () => {
  const [programmes, students] = await Promise.all([db.programme.count(), db.student.count()]);
  if (programmes || students) throw new ApiError(409, "The database already has data. Run `npm run db:seed` to reset it.");
  return ok({ message: await loadDemoData() }, 201);
});
