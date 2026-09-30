"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestError } from "@/lib/client";

// Runs a request, shows a toast, keeps field errors for the form, and refreshes server data on success.
export function useSubmit() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fields, setFields] = useState<Record<string, string[] | undefined>>({});

  function submit<T>(request: () => Promise<T>, success: string | ((res: T) => string), onDone?: (res: T) => void) {
    setFields({});
    start(async () => {
      try {
        const res = await request();
        toast.success(typeof success === "string" ? success : success(res));
        onDone?.(res);
        router.refresh();
      } catch (e) {
        if (e instanceof RequestError) {
          setFields(e.fields);
          toast.error(e.message);
        } else toast.error("Could not reach the server. Please try again.");
      }
    });
  }

  return { submit, pending, fields, error: (name: string) => fields[name]?.[0] };
}
