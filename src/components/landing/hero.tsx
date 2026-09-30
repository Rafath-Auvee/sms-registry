import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { StaffCta } from "@/components/landing/staff-cta";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <GridPattern
        width={48}
        height={48}
        squares={[[4, 2], [9, 1], [13, 4], [6, 5], [17, 2], [2, 6]]}
        className="-z-10 fill-primary/10 stroke-foreground/10 [mask-image:radial-gradient(ellipse_at_top,white,transparent_70%)]"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <div className="rounded-full border bg-background/60 px-3 py-1 text-xs backdrop-blur">
          <AnimatedShinyText className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Student Management System · Registry module
          </AnimatedShinyText>
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Every student, fee and mark, <AuroraText colors={["#6366f1", "#8b5cf6", "#22d3ee", "#6366f1"]}>in one place</AuroraText>
        </h1>
        <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          Enrol students, track what they owe, collect coursework and publish results. Built for the four jobs a Registry team does
          every day.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <StaffCta />
          <Button variant="ghost" nativeButton={false} render={<Link href="#views" />}>
            View as a student
          </Button>
        </div>
      </div>
    </section>
  );
}
