import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/types/wishlist";
import { formatCurrency } from "@/lib/order";
import MoveToCartButton from "./MoveToCartButton";
import RemoveWishlistButton from "./RemoveWishlistButton";
import { ArrowUpRight, Heart } from "lucide-react";

interface Props {
    item: WishlistItem;
}

export default function WishlistCard({ item }: Props) {
    const product = item.product;
    const image = product.media?.[0]?.url ?? "/placeholder.png";

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock < 5;

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:border-border hover:shadow-xl hover:shadow-primary/5">

            {/* Media Gallery Canvas */}
            <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-secondary/30">

                <Link
                    href={`/products/${product.id}`}
                    aria-label={`View details for ${product.title}`}
                    className="relative block h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-ring"
                >
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Quick Details Hover Indicator */}
                    <div className="absolute inset-0 bg-background/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground shadow-lg border border-border/60 transition-transform duration-300 group-hover:scale-105">
                            View Piece
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                    </div>
                </Link>

                {/* Stock Status Badge */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    {isOutOfStock ? (
                        <span className="rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md shadow-xs">
                            Out of Stock
                        </span>
                    ) : isLowStock ? (
                        <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md shadow-xs">
                            Only {product.stock} left
                        </span>
                    ) : (
                        <span className="rounded-full bg-success/15 text-success border border-success/30 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md shadow-xs">
                            In Stock
                        </span>
                    )}
                </div>

                {/* Quick Remove Action */}
                <div className="absolute top-3 right-3 z-10">
                    <RemoveWishlistButton productId={product.id} />
                </div>
            </div>

            {/* Ticket Perforation Seam */}
            <div className="relative border-t border-dashed border-border">
                <span className="absolute left-0 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" aria-hidden="true" />
                <span className="absolute right-0 top-0 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" aria-hidden="true" />
            </div>

            {/* Editorial Content Block */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">

                <div className="space-y-2.5">
                    {(product.material || product.type) && (
                        <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 fill-primary/70 text-primary/70" aria-hidden="true" />
                            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase truncate">
                                {[product.material, product.type].filter(Boolean).join(" • ")}
                            </span>
                        </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            <Link
                                href={`/products/${product.id}`}
                                className="focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
                            >
                                {product.title}
                            </Link>
                        </h2>

                        {/* Price Tag */}
                        <div className="relative shrink-0 flex items-center gap-1.5 rounded-full border border-dashed border-border bg-secondary/50 py-0.5 pl-2.5 pr-3">
                            {/* <span className="h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" /> */}
                            {/* <p className="text-sm sm:text-base font-semibold tracking-tight text-foreground whitespace-nowrap"> */}
                            <p className="text-sm font-semibold tracking-tight text-foreground">
                                {formatCurrency(product.price)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Redeem Action */}
                <div className="pt-1">
                    <MoveToCartButton product={product} />
                </div>

            </div>

        </article >
    );
}