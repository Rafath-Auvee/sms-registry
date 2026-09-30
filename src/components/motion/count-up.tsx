"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { money } from "@/lib/format";

// Counts a number up from zero. The server renders the final value, so without JS it's still right.
export function CountUp({ value, currency }: { value: number; currency?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => (currency ? money(Math.round(n)) : Math.round(n).toLocaleString("en-IN"));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { n: 0 };
    const anim = animate(state, {
      n: value,
      duration: 900,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = format(state.n);
      },
    });
    return () => {
      anim.pause();
      el.textContent = format(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, currency]);

  return <span ref={ref}>{format(value)}</span>;
}
