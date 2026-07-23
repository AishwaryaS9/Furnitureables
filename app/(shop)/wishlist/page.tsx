import EmptyWishlist from "@/components/wishlist/EmptyWishlist";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { graphqlServerClient } from "@/lib/graphql/server-client";
import { GET_WISHLIST } from "@/lib/graphql/queries";
import { WishlistResponse } from "@/types/wishlist";
import { auth } from "@clerk/nextjs/server";

export default async function WishlistPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-semibold">
          Please sign in to view your wishlist.
        </h2>
      </div>
    );
  }

  const client = await graphqlServerClient();

  const { wishlist } =
    await client.request<WishlistResponse>(
      GET_WISHLIST
    );

  if (!wishlist.length) {
    return <EmptyWishlist />;
  }

  return (
    <section className="container mx-auto max-w-7xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Wishlist
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your saved products.
        </p>
      </div>

      <WishlistGrid
        wishlist={wishlist}
      />
    </section>
  );
}