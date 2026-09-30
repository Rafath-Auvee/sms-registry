import { route, ok } from "@/lib/api";
import { listProgrammes } from "@/lib/queries";

// Programmes with their modules. Open to both views (the enrolment and assessment forms need them).
export const GET = route(async () => ok(await listProgrammes()));
