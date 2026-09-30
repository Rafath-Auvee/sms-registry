"use client";

import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

export function LoadDemoButton() {
  const { submit, pending } = useSubmit();
  return (
    <Button disabled={pending} onClick={() => submit(() => send("/api/demo", "POST"), "Demo data loaded")}>
      <Database /> {pending ? "Loading demo data..." : "Load demo data"}
    </Button>
  );
}
