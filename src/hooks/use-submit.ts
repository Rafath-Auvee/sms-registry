"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestError } from "@/lib/client";

// Runs a request, keeps field errors for the form, and refreshes server data on success.
// The success toast and onDone (usually "close the dialog") wait until the refreshed data is on
// screen, so the page never looks unchanged after a save. Pass `go` to navigate instead of refresh.
export function useSubmit() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fields, setFields] = useState<Record<string, string[] | undefined>>({});
  const finish = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (pending || !finish.current) return;
    const done = finish.current;
    finish.current = null;
    done();
  }, [pending]);

  function submit<T>(
    request: () => Promise<T>,
    success: string | ((res: T) => string),
    onDone?: (res: T) => void,
    go?: (res: T) => string,
  ) {
    setFields({});
    start(async () => {
      try {
        const res = await request();
        finish.current = () => {
          toast.success(typeof success === "string" ? success : success(res));
          onDone?.(res);
        };
        if (go) router.push(go(res));
        else router.refresh();
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
