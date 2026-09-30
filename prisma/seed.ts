// npm run db:seed: resets the database to the demo data (see src/lib/demo-data.ts).
import "dotenv/config";
import { db } from "../src/lib/db";
import { loadDemoData } from "../src/lib/demo-data";

loadDemoData()
  .then((summary) => console.log(summary))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
