import { connection } from "next/server";
import { School } from "lucide-react";
import { SetupNotice } from "@/components/common/setup-notice";
import { EnterCards } from "@/components/landing/enter-cards";
import { FeatureBento } from "@/components/landing/feature-bento";
import { Hero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Reveal } from "@/components/motion/reveal";
import { dashboard, dbState, studentOptions } from "@/lib/queries";

export default async function LandingPage() {
  await connection(); // render per request: the numbers and the database state change at runtime
  const state = await dbState();
  const [students, d] = state === "ready" ? await Promise.all([studentOptions(), dashboard()]) : [[], null];

  return (
    <div className="relative flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b border-transparent bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <School className="size-4" />
            </div>
            SMS Registry
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {state !== "ready" || !d ? (
          <div className="mx-auto max-w-xl px-4 py-24">
            <SetupNotice state={state === "ready" ? "empty" : state} />
          </div>
        ) : (
          <>
            <Hero />
            <Reveal className="mx-auto max-w-6xl space-y-16 px-4 pb-20 sm:px-6">
              <StatsStrip students={d.counts.total} outstandingPoisha={d.outstandingPoisha} overdue={d.overdue.length} late={d.late.length} />
              <section className="space-y-6">
                <div className="max-w-2xl space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What the Registry does here</h2>
                  <p className="text-muted-foreground">The edge cases are handled for you: overdue fees, late work, withheld results.</p>
                </div>
                <FeatureBento />
              </section>
              <section id="views" className="scroll-mt-20 space-y-6">
                <div className="max-w-2xl space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Choose a view</h2>
                  <p className="text-muted-foreground">No sign in for the demo. Switch any time from the top bar.</p>
                </div>
                <EnterCards students={students} />
              </section>
            </Reveal>
          </>
        )}
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          Next.js, PostgreSQL and Prisma. Demo data only.
        </div>
      </footer>
    </div>
  );
}
