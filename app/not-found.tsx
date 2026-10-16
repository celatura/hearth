import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-heading text-3xl font-medium tracking-tight">
        This piece went missing
      </h1>
      <p className="mt-3 max-w-sm text-sm text-pretty text-muted-foreground">
        It may have sold out or never existed. The rest of the collection is
        still here.
      </p>
      <Button asChild className="mt-6 h-10 px-5">
        <Link href="/">Back to the collection</Link>
      </Button>
    </div>
  );
}
