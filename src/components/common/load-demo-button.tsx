"use client";

import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSubmit } from "@/hooks/use-submit";
import { send } from "@/lib/client";

export function LoadDemoButton() {
  const { submit, pending } = useSubmit();
  return (
    <Button disabled={pending} onClick={() => submit(() => send("/api/demo", "POST"), "Demo data loaded")}>
      {pending ? <Spinner /> : <Database />} {pending ? "Loading demo data..." : "Load demo data"}
    </Button>
  );
}
