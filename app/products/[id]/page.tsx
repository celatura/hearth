import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DetailSkeleton } from "@/components/product/detail-skeleton";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { RelatedProducts } from "@/components/product/related-products";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { findProductById, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = findProductById(id);
  if (!product) return { title: "Piece not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  if (!findProductById(id)) notFound();

  return (
    <div className="shell py-8 md:py-12">
      <Suspense fallback={<DetailSkeleton />}>
        <QueryErrorBoundary>
          <ProductDetailView id={id} />
        </QueryErrorBoundary>
      </Suspense>

      <Suspense fallback={null}>
        <QueryErrorBoundary>
          <RelatedProducts id={id} />
        </QueryErrorBoundary>
      </Suspense>
    </div>
  );
}
