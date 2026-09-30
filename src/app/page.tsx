import { School } from "lucide-react";
import { EnterCards } from "@/components/landing/enter-cards";
import { WorkflowGrid } from "@/components/landing/workflow-grid";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Reveal } from "@/components/motion/reveal";
import { studentOptions } from "@/lib/queries";

export default async function LandingPage() {
  const students = await studentOptions();
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-96 max-w-3xl rounded-full bg-primary/25 blur-3xl" />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <School className="size-4" />
          </div>
          SMS Registry
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1">
        <Reveal className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-14">
        <section className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Student Management System</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The Registry module</h1>
          <p className="text-muted-foreground">
            The four workflows a Registry Administrator uses every day: enrolment, fees, assessment submission and results. Choose a
            view to start; you can switch at any time from the top bar.
          </p>
        </section>
        <EnterCards students={students} />
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">What it covers</h2>
          <WorkflowGrid />
        </section>
        </Reveal>
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
        Next.js, PostgreSQL and Prisma. Demo data only.
      </footer>
    </div>
  );
}
