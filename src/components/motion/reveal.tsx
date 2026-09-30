"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fades and lifts its direct children in, one after another, on first render.
export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.dataset.reveal = "done";
      return;
    }
    const anim = animate(el.children, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 520,
      delay: stagger(70),
      ease: "outCubic",
      onComplete: () => {
        el.dataset.reveal = "done";
      },
    });
    return () => {
      anim.pause();
      el.dataset.reveal = "done";
      for (const c of el.children) (c as HTMLElement).style.opacity = "1";
    };
  }, []);

  return (
    <div ref={ref} data-reveal="pending" className={className}>
      {children}
    </div>
  );
}
