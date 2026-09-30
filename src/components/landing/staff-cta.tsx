"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spinner } from "@/components/ui/spinner";
import { send, RequestError } from "@/lib/client";
import { cn } from "@/lib/utils";

// Enters the staff view. The shimmer is kept subtle: a thin light edge, not a glow.
export function StaffCta({ size = "default" }: { size?: "sm" | "default" }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <ShimmerButton
      background="var(--primary)"
      shimmerColor="rgba(255,255,255,0.55)"
      shimmerDuration="4s"
      borderRadius="0.6rem"
      className={cn("gap-2 font-medium", size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm")}
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
      {pending && <Spinner className={size === "sm" ? "size-3.5" : undefined} />}
      Open staff view
      {!pending && size === "default" && <ArrowRight className="size-4" />}
    </ShimmerButton>
  );
}
