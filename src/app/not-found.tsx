import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <SearchX className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Not found</h1>
        <p className="text-sm text-muted-foreground">This record doesn&apos;t exist. It may have been removed when the demo data was reset.</p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>
        Home
      </Button>
    </div>
  );
}
