import { DatabaseZap, DatabaseBackup, Unplug } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadDemoButton } from "@/components/common/load-demo-button";
import type { DbState } from "@/lib/queries";

// What to do when the database isn't ready: shown instead of the page.
export function SetupNotice({ state }: { state: Exclude<DbState, "ready"> }) {
  if (state === "empty")
    return (
      <EmptyState icon={DatabaseBackup} title="The database is empty" description="There are no programmes or students yet. Load the demo data to explore, or run `npm run db:seed`.">
        <LoadDemoButton />
      </EmptyState>
    );
  if (state === "no-tables")
    return (
      <EmptyState icon={DatabaseZap} title="The database isn't set up" description="Its tables don't exist yet. In the project folder run `npm run setup` (creates the tables and loads demo data), then reload." />
    );
  return (
    <EmptyState
      icon={Unplug}
      title="Can't reach the database"
      description="Check DATABASE_URL in .env and that the database is running. A free Neon database can take a few seconds to wake; reload to try again."
    />
  );
}
