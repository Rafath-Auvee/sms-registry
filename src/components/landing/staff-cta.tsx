"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spinner } from "@/components/ui/spinner";
import { send, RequestError } from "@/lib/client";

export function StaffCta() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <ShimmerButton
      background="var(--primary)"
      shimmerColor="#c7d2fe"
      className="gap-2 px-6 py-2.5 text-sm font-medium"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            await send("/api/session", "POST", { role: "staff" });
            router.push("/staff");
          } catch (e) {
            toast.error(e instanceof RequestError ? e.message : "Could not open the staff view.");
          }
        })
      }
    >
      {pending ? <Spinner /> : null}
      Open staff view
      {!pending && <ArrowRight className="size-4" />}
    </ShimmerButton>
  );
}
