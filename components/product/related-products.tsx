"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/catalog/product-card";
import { relatedProductsQuery } from "@/lib/queries";

export function RelatedProducts({ id }: { id: string }) {
  const { data: related } = useSuspenseQuery(relatedProductsQuery(id));

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-16 border-t border-border/70 pt-10"
    >
      <h2
        id="related-heading"
        className="font-heading text-2xl font-medium tracking-tight"
      >
        You might also like
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
