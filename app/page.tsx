import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";
import { CatalogSkeleton } from "@/components/catalog/grid-skeleton";
import { Button } from "@/components/ui/button";
import { findProductById } from "@/lib/products";

function Hero() {
  const vase = findProductById("terra-vase");
  const lamp = findProductById("lumen-table-lamp");
  if (!vase || !lamp) return null;

  return (
    <section className="shell pt-10 pb-12 md:pt-16 md:pb-16">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-6">
          <h1 className="rise rise-1 font-heading text-[2.75rem] leading-[1.04] font-medium tracking-tight text-balance sm:text-6xl md:text-7xl">
            Considered objects for everyday living.
          </h1>
          <p className="rise rise-2 mt-6 max-w-md text-base text-pretty text-muted-foreground md:text-lg">
            Twelve quiet pieces for the home — vessels, textiles, and light,
            chosen to be used daily and kept for years.
          </p>
          <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild className="h-11 px-6 text-sm">
              <Link href="#catalog">Shop the collection</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free shipping over $50
            </p>
          </div>
        </div>

        <div className="rise rise-2 lg:col-span-6">
          <div className="ml-auto grid max-w-lg grid-cols-5 gap-4">
            <Link
              href={`/products/${vase.id}`}
              className="relative col-span-3 aspect-square overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Image
                src={vase.image}
                alt={vase.name}
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="object-cover"
              />
            </Link>
            <Link
              href={`/products/${lamp.id}`}
              className="relative col-span-2 mt-12 aspect-square self-start overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Image
                src={lamp.image}
                alt={lamp.name}
                fill
                priority
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover"
              />
            </Link>
          </div>
        </div>
      </div>

      <dl className="mt-12 grid gap-5 border-t border-border/70 pt-6 text-sm sm:grid-cols-3 sm:gap-8">
        <div>
          <dt className="text-xs text-muted-foreground">Shipping</dt>
          <dd className="mt-1 font-medium">Free on orders over $50</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Collection</dt>
          <dd className="mt-1 font-medium">Twelve pieces, four collections</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Checkout</dt>
          <dd className="mt-1 font-medium">Simulated — no payment taken</dd>
        </div>
      </dl>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <section id="catalog" className="scroll-mt-16">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView />
        </Suspense>
      </section>
    </>
  );
}
