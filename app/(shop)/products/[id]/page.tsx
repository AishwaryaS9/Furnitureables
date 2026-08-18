import { Metadata } from "next";
import { notFound } from "next/navigation";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { PRODUCT_BY_ID, PRODUCT_REVIEWS } from "@/lib/graphql/queries";
import { ProductResponse } from "@/types/graphql";
import { ProductReviews } from "@/types/review";
import ProductClient from "./ProductClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const client = await graphqlServerClient();

  try {
    const { product } = await client.request<ProductResponse>(PRODUCT_BY_ID, {
      id,
    });

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested furniture piece could not be found.",
        robots: { index: false, follow: false },
      };
    }

    const title = `${product.title} | Premium Solid Wood Furniture`;
    const description =
      product.description ||
      `Discover the ${product.title}, handcrafted in ${product.material || "solid wood"}. Designed for modern architectural living.`;

    const primaryImage =
      product.media && product.media.length > 0
        ? product.media[0].url
        : "/images/placeholder.jpg";

    return {
      title,
      description,
      keywords: [
        product.title,
        product.material,
        product.type,
        "solid wood furniture",
        "modern furniture",
        "architectural interior",
      ].filter(Boolean) as string[],
      alternates: {
        canonical: `/products/${product.id}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: `/products/${product.id}`,
        images: [
          {
            url: primaryImage,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [primaryImage],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Product | Furniture Catalog",
      description: "Explore our collection of sustainably engineered solid wood furniture.",
    };
  }
}

// 2. Main Page Component
export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const client = await graphqlServerClient();

  const { product } = await client.request<ProductResponse>(PRODUCT_BY_ID, {
    id,
  });

  if (!product) {
    // Triggers Next.js built-in 404 page with proper 404 HTTP response status code for search engines
    notFound();
  }

  const { productReviews } = await client.request<{ productReviews: ProductReviews }>(
    PRODUCT_REVIEWS,
    { productId: id }
  );

  return <ProductClient product={product} reviews={productReviews} />;
}