import { unstable_cache } from "next/cache";
import { fetchFeaturedProducts, fetchProductCategories } from "@/lib/data/catalog";
import { fetchAnonymousPromotion } from "@/lib/data/promotion";

/**
 * Cached (data-cache) wrappers around the public storefront queries.
 * Revalidated in the background, and invalidated with `revalidateTag`
 * ("products" / "promotion") if you want changes to show up immediately.
 */
export const getFeaturedProducts = unstable_cache(
    () => fetchFeaturedProducts(8),
    ["storefront-featured-products"],
    { revalidate: 300, tags: ["products"] }
);

export const getTopCategories = unstable_cache(
    () => fetchProductCategories(5),
    ["storefront-top-categories"],
    { revalidate: 300, tags: ["products"] }
);

export const getAnonymousPromotion = unstable_cache(
    () => fetchAnonymousPromotion(),
    ["storefront-anonymous-promotion"],
    { revalidate: 60, tags: ["promotion"] }
);
