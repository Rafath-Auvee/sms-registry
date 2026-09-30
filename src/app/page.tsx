import { connection } from "next/server";
import { SetupNotice } from "@/components/common/setup-notice";
import { EnterCards } from "@/components/landing/enter-cards";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Principles } from "@/components/landing/principles";
import { ProductPreview } from "@/components/landing/product-preview";
import { SectionHeading } from "@/components/landing/section-heading";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Workflows } from "@/components/landing/workflows";
import { Reveal } from "@/components/motion/reveal";
import { dashboard, dbState, studentOptions } from "@/lib/queries";

export default async function LandingPage() {
  await connection(); // render per request: the preview and the database state change at runtime
  const state = await dbState();
  const [students, d] = state === "ready" ? await Promise.all([studentOptions(), dashboard()]) : [[], null];

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {state !== "ready" || !d ? (
          <div className="mx-auto max-w-xl px-4 py-24">
            <SetupNotice state={state === "ready" ? "empty" : state} />
          </div>
        ) : (
          <>
            <Hero
              students={students}
              preview={
                <ProductPreview
                  enrolled={d.counts.enrolled}
                  outstandingPoisha={d.outstandingPoisha}
                  pendingResults={d.pendingResults}
                  overdue={d.overdue}
                  late={d.late}
                />
              }
            />
            <Reveal className="mx-auto max-w-6xl space-y-24 px-4 py-20 sm:px-6">
              <section id="features" className="scroll-mt-20 space-y-10">
                <SectionHeading
                  eyebrow="Features"
                  title="Everything the Registry handles, in four workflows"
                  text="Each one covers the everyday job and the awkward cases: overdue fees, late work, deferred students, withheld results."
                />
                <Workflows />
              </section>
              <section id="how-it-works" className="scroll-mt-20 space-y-10">
                <SectionHeading
                  eyebrow="How it works"
                  title="From enrolment to published results"
                  text="One record follows each student through the year."
                />
                <HowItWorks />
              </section>
              <section className="rounded-2xl border bg-muted/30 p-8 sm:p-10">
                <Principles />
              </section>
              <section id="get-started" className="scroll-mt-20 space-y-10">
                <SectionHeading
                  eyebrow="Get started"
                  title="Explore the demo"
                  text="No sign in needed. Open the Registry as staff, or see it through a student's eyes. You can switch views at any time."
                />
                <EnterCards students={students} />
              </section>
            </Reveal>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
