import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/types/wishlist";
import { formatCurrency } from "@/lib/order";
import MoveToCartButton from "./MoveToCartButton";
import RemoveWishlistButton from "./RemoveWishlistButton";

interface Props {
    item: WishlistItem;
}

export default function WishlistCard({ item }: Props) {
    const product = item.product;

    const image = product.media?.[0]?.url ?? "/placeholder.png";

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square">
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="space-y-4 p-4">
                <div>
                    <Link
                        href={`/products/${product.id}`}
                        className="font-medium hover:underline"
                    >
                        {product.title}
                    </Link>

                    <p className="mt-2 text-lg font-semibold">
                        {formatCurrency(product.price)}
                    </p>

                    <p
                        className={`mt-1 text-sm ${product.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        {product.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </p>
                </div>

                <div className="flex gap-2">
                    <MoveToCartButton
                        product={product}
                    />

                    <RemoveWishlistButton
                        productId={product.id}
                    />
                </div>
            </div>
        </div>
    );
}