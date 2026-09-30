"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when a page fails to load, for example while the database is waking up.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <TriangleAlert className="size-8 text-amber-500" />
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">This page could not load</h1>
        <p className="text-sm text-muted-foreground">
          The database may be waking up or briefly unreachable. Try again in a few seconds.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Home
        </Button>
      </div>
    </div>
  );
}
