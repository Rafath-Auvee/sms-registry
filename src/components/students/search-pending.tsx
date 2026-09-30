"use client";

import { createContext, useContext, useTransition, type TransitionStartFunction } from "react";
import { cn } from "@/lib/utils";

// Lets the filters and the results share one "search in progress" state:
// the filters start the navigation, the results dim until the new list arrives.
const Pending = createContext<{ pending: boolean; start: TransitionStartFunction } | null>(null);

export function SearchPendingProvider({ children }: { children: React.ReactNode }) {
  const [pending, start] = useTransition();
  return <Pending value={{ pending, start }}>{children}</Pending>;
}

export function useSearchPending() {
  const ctx = useContext(Pending);
  if (!ctx) throw new Error("useSearchPending must be used inside SearchPendingProvider");
  return ctx;
}

export function PendingArea({ children }: { children: React.ReactNode }) {
  const pending = useContext(Pending)?.pending;
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}
