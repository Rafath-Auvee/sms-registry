import { Check } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { StaffCta } from "@/components/landing/staff-cta";
import { StudentCta } from "@/components/landing/student-cta";

const POINTS = ["Every rule checked on the server", "Full status and payment history", "Taka and Dhaka time"];

type Option = { id: string; studentId: string; fullName: string };

export function Hero({ preview, students }: { preview: React.ReactNode; students: Option[] }) {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <GridPattern
        width={56}
        height={56}
        className="-z-10 stroke-foreground/[0.06] [mask-image:linear-gradient(to_bottom,white,transparent_85%)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border bg-background/70 px-3 py-1 text-xs">
            <AnimatedShinyText>Student Management System · Registry module</AnimatedShinyText>
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Student records, fees and results, <span className="text-primary">in one system</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            The four workflows a Registry team runs every day: enrolment, fees and payments, coursework submission, and the
            marksheet. Built to catch the cases that go wrong.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StaffCta />
            <StudentCta students={students} />
          </div>
          <ul className="mt-8 flex flex-col gap-x-6 gap-y-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" /> {p}
              </li>
            ))}
          </ul>
        </div>
        {preview}
      </div>
    </section>
  );
}
