"use client";

import { useState, useRef, useEffect, useCallback, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, Minus, Plus, Maximize2, X, AlertCircle, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductReviews from "@/components/product/ProductReviews";
import { Product } from "@/types/product";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useCartStore } from "@/store/cart";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/order";
import { ProductReviews as ProductReviewsData } from "@/types/review";

export default function ProductClient({ product, reviews }: { product: Product; reviews: ProductReviewsData }) {
    const addToCart = useAddToCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const isInCart = useCartStore((s) =>
        s.items.some((item) => item.id === product.id)
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isZooming, setIsZooming] = useState(false);
    const modalImageRef = useRef<HTMLDivElement>(null);

    const images =
        product.media && product.media.length > 0
            ? product.media
            : [
                {
                    id: "placeholder",
                    url: "/images/placeholder.jpg",
                    type: "IMAGE",
                    altText: null,
                    sortOrder: 0,
                },
            ];

    const [activeIndex, setActiveIndex] = useState(0);
    const selectedImage = images[activeIndex]?.url ?? "/images/placeholder.jpg";
    const hasMultipleImages = images.length > 1;

    const goToIndex = useCallback(
        (index: number) => setActiveIndex((index + images.length) % images.length),
        [images.length]
    );
    const goPrev = useCallback((e?: MouseEvent) => {
        e?.stopPropagation();
        goToIndex(activeIndex - 1);
    }, [activeIndex, goToIndex]);

    const goNext = useCallback((e?: MouseEvent) => {
        e?.stopPropagation();
        goToIndex(activeIndex + 1);
    }, [activeIndex, goToIndex]);

    useEffect(() => {
        if (!hasMultipleImages) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToIndex(activeIndex - 1);
            if (e.key === "ArrowRight") goToIndex(activeIndex + 1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, hasMultipleImages, goToIndex]);

    const handleAddToCart = () => {
        if (isInCart) { router.push("/cart"); return; }
        addToCart(product, quantity);
    };

    const handleModalMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!modalImageRef.current) return;
        const { left, top, width, height } = modalImageRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
        setZoomPos({ x, y });
    };

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock < 5;

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": images.map((img) => img.url),
        "description": product.description || `${product.title} crafted in premium materials.`,
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.price,
            "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

            <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground 
            selection:text-background transition-colors duration-200">
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">

                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground flex-wrap">
                            <li><Link href="/" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded-sm">
                                Home
                            </Link>
                            </li>
                            <li aria-hidden="true" className="text-border">/</li>
                            <li><Link href="/products"
                                className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded-sm">
                                Shop
                            </Link>
                            </li>
                            <li aria-hidden="true" className="text-border">/</li>
                            <li><span className="text-foreground font-semibold truncate max-w-50 sm:max-w-xs block"
                                aria-current="page">
                                {product.title}
                            </span>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* Left Canvas */}
                        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">

                            {/* Hero frame */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="group relative aspect-4/3 w-full max-h-95 rounded-xl overflow-hidden bg-secondary/40 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                aria-label="Click to enlarge product image"
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsModalOpen(true); }}
                            >
                                <Image
                                    key={selectedImage}
                                    src={selectedImage}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />

                                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/25 to-transparent" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/25 to-transparent" />

                                <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
                                    {isOutOfStock ? (
                                        <span className="rounded-full bg-destructive/90 text-destructive-foreground px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
                                            Out of Stock
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-white/90 text-foreground px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
                                            In Stock
                                        </span>
                                    )}
                                </div>

                                {hasMultipleImages && (
                                    <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none font-serif text-xs text-white tabular-nums">
                                        {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                                    </div>
                                )}

                                {hasMultipleImages && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            aria-label="Previous image"
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white/0 text-white opacity-0 group-hover:opacity-100 group-hover:bg-white/15 hover:bg-white/25 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            aria-label="Next image"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white/0 text-white 
                                            opacity-0 group-hover:opacity-100 group-hover:bg-white/15 hover:bg-white/25 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                                        >
                                            <ChevronRight className="w-5 h-5" aria-hidden="true" />
                                        </button>
                                    </>
                                )}

                                <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 text-white text-[11px] font-medium tracking-wide 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span className="hidden sm:inline">View full size</span>
                                </div>

                                {hasMultipleImages && (
                                    <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 sm:hidden">
                                        {images.map((image, index) => (
                                            <span
                                                key={image.id ?? index}
                                                className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex ? "w-4 bg-white" : "w-1 bg-white/50"}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-baseline justify-between px-0.5 border-b border-border/60 pb-3">
                                <p className="font-serif text-sm text-foreground italic truncate pr-4">
                                    {product.material ? `${product.material} — plate ${String(activeIndex + 1).padStart(2, "0")}` : `Plate ${String(activeIndex + 1).padStart(2, "0")}`}
                                </p>
                                {hasMultipleImages && (
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                                        {images.length} views
                                    </span>
                                )}
                            </div>

                            {hasMultipleImages && (
                                <div
                                    role="region"
                                    aria-label="Product image thumbnails"
                                    className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
                                >
                                    {images.map((image, index) => {
                                        const isSelected = activeIndex === index;
                                        return (
                                            <button
                                                key={image.id ?? index}
                                                type="button"
                                                onClick={() => setActiveIndex(index)}
                                                aria-label={`View image ${index + 1} of ${images.length} for ${product.title}`}
                                                aria-pressed={isSelected}
                                                className="relative shrink-0 h-16 w-13 overflow-hidden rounded-md cursor-pointer"
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={`${product.title} view ${index + 1}`}
                                                    fill
                                                    sizes="64px"
                                                    className={`object-cover transition-all duration-200 ${isSelected ? "opacity-100" : "opacity-60 hover:opacity-80"}`}
                                                />
                                                <span
                                                    className={`pointer-events-none absolute inset-0 rounded-md transition-all duration-200 ${isSelected ? "ring-1 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Canvas: Product Details Column */}
                        <div className="lg:col-span-6 space-y-5">
                            <div className="space-y-2.5 pb-5 border-b border-border/80">
                                {product.material && (
                                    <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase block">
                                        {product.material}
                                    </span>
                                )}
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground leading-[1.1]">
                                    {product.title}
                                </h1>
                                <p className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                                    {formatCurrency(product.price)}
                                </p>
                                {isLowStock && (
                                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 pt-0.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                        <span>Hurry! Only {product.stock} items left in stock.</span>
                                    </div>
                                )}
                                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-1 font-light">
                                    {product.description || "Sustainably engineered furniture piece crafted to blend structural form with modern living aesthetics."}
                                </p>
                            </div>

                            {(product.material || product.type || product.color) && (
                                <div className="space-y-1.5 text-xs">
                                    <span className="text-muted-foreground font-semibold uppercase tracking-wider block text-[10px]">
                                        Specifications
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 bg-secondary/40 border border-border/60 p-3 rounded-xl">
                                        {product.material && (
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase">
                                                    Material
                                                </span>
                                                <span className="font-medium text-foreground capitalize text-xs">
                                                    {product.material}
                                                </span>
                                            </div>
                                        )}
                                        {product.type && (
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase">
                                                    Type
                                                </span>
                                                <span className="font-medium text-foreground capitalize text-xs">
                                                    {product.type}
                                                </span>
                                            </div>
                                        )}
                                        {product.color && (
                                            <div className="col-span-2 pt-1 border-t border-border/40 flex items-center justify-between">
                                                <span className="text-muted-foreground text-[10px] uppercase">Color Finish</span>
                                                <span className="font-medium text-foreground capitalize text-xs">{product.color}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2.5 pt-1">
                                <label htmlFor="quantity-stepper" className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <div id="quantity-stepper"
                                        aria-label="Quantity selector"
                                        className="flex items-center justify-between border border-input rounded-xl bg-card h-11 w-28 px-1 shadow-xs"
                                    >
                                        <Button type="button" variant="ghost" size="icon"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            disabled={quantity <= 1 || isOutOfStock}
                                            aria-label="Decrease quantity"
                                            className="w-7 h-7 text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer">
                                            <Minus className="w-3.5 h-3.5"
                                                aria-hidden="true" />
                                        </Button>
                                        <span className="font-semibold text-xs tabular-nums text-foreground">
                                            {quantity}
                                        </span>
                                        <Button type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                            disabled={quantity >= product.stock || isOutOfStock}
                                            aria-label="Increase quantity"
                                            className="w-7 h-7 text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-secondary 
                                        transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer">
                                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Button>
                                    </div>
                                    <Button disabled={isOutOfStock}
                                        onClick={handleAddToCart}
                                        className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl text-xs 
                                    transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed gap-1.5">
                                        {isOutOfStock ? "Out of Stock" : isInCart ? (<><ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />Go to Cart</>) : "Add to Bag"}
                                    </Button>
                                    <div className="h-11 w-11 flex items-center justify-center shrink-0">
                                        <WishlistButton productId={product.id} isWishlisted={product.isWishlisted} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5 pt-4 border-t border-border/80 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-secondary border border-border/50 text-foreground">
                                        <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs">
                                            Complimentary Insured Delivery
                                        </p>
                                        <p className="font-light text-[10px]">Dispatched via specialized white-glove transport.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-secondary border border-border/50 text-foreground">
                                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs">Authenticity & Structural Guarantee</p>
                                        <p className="font-light text-[10px]">Includes 5-year solid wood craftsmanship coverage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section aria-label="Related products" className="mt-16 sm:mt-24 pt-10 border-t border-border">
                        <div className="text-left mb-6 space-y-1">
                            <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-foreground">You Might Also Like</h2>
                            <p className="text-xs text-muted-foreground font-light">Explore complementary architectural pieces from our collection.</p>
                        </div>
                        <RelatedProducts type={product.type} id={product.id} />
                    </section>

                    <ProductReviews productId={product.id} initialData={reviews} />
                </div>
            </main>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[85vw] lg:max-w-[65vw] xl:max-w-6xl h-[90vh] p-0 overflow-hidden 
                bg-background border-border flex flex-col rounded-2xl [&>button[data-slot=dialog-close]]:hidden [&>button.absolute]:hidden">
                    <DialogTitle className="sr-only">Image zoom viewer for {product.title}</DialogTitle>

                    <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border flex items-center justify-between bg-card shrink-0">
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">{product.title}</h3>
                            <p className="text-[11px] text-muted-foreground hidden sm:block">Move cursor over image to inspect fine detail</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {hasMultipleImages && (
                                <span className="text-[11px] font-medium tabular-nums text-muted-foreground px-2">{activeIndex + 1} / {images.length}</span>
                            )}
                            <DialogClose render={
                                <Button variant="ghost" size="icon" className="p-1.5 h-8 w-8 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0">
                                    <X className="w-5 h-5" />
                                </Button>
                            } />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:grid md:grid-cols-12 overflow-hidden min-h-0">
                        <div
                            ref={modalImageRef}
                            onMouseMove={handleModalMouseMove}
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            className="group/zoom flex-1 min-h-0 md:col-span-10 md:h-full relative w-full bg-secondary/20 overflow-hidden cursor-crosshair flex items-center justify-center"
                        >
                            <Image
                                key={selectedImage}
                                src={selectedImage}
                                alt={product.title}
                                fill
                                priority
                                sizes="100vw"
                                style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: isZooming ? "scale(2.5)" : "scale(1)" }}
                                className="object-contain p-4 sm:p-6 md:p-10 transition-transform duration-150 ease-out pointer-events-none"
                            />
                            {hasMultipleImages && (
                                <>
                                    <button type="button"
                                        onClick={goPrev}
                                        aria-label="Previous image"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border text-muted-foreground opacity-0 group-hover/zoom:opacity-100 hover:text-foreground hover:scale-110 transition-all duration-200 shadow-xs cursor-pointer">
                                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                    <button type="button" onClick={goNext}
                                        aria-label="Next image"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border text-muted-foreground opacity-0 group-hover/zoom:opacity-100 hover:text-foreground hover:scale-110 transition-all duration-200 shadow-xs cursor-pointer">
                                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation Sidebar */}
                        <div className="md:col-span-2 shrink-0 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col overflow-hidden">
                            <div className="hidden md:block px-4 pt-4 pb-2 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                                {images.length} views
                            </div>
                            <div className="flex flex-row md:flex-col gap-2.5 sm:gap-3 p-3 sm:p-4 md:pt-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto no-scrollbar">
                                {images.map((image, index) => {
                                    const isSelected = activeIndex === index;
                                    return (
                                        <button
                                            key={image.id ?? index}
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={`View image ${index + 1} of ${images.length}`}
                                            aria-pressed={isSelected}
                                            className={`group/thumb relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-full shrink-0 overflow-hidden rounded-lg cursor-pointer 
                                                transition-all duration-200 ${isSelected ? "" : "hover:-translate-y-0.5"
                                                }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={`${product.title} preview ${index + 1}`}
                                                fill
                                                sizes="160px"
                                                className={`object-cover transition-all duration-200 ${isSelected
                                                    ? "opacity-100"
                                                    : "opacity-50 group-hover/thumb:opacity-85"
                                                    }`}
                                            />

                                            <span
                                                className={`pointer-events-none absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] 
                                                    font-semibold tabular-nums transition-colors duration-200 
                                                    ${isSelected
                                                        ? "bg-foreground text-background"
                                                        : " text-white opacity-0 group-hover/thumb:opacity-100"
                                                    }`}
                                            >
                                                {index + 1}
                                            </span>

                                            <span
                                                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-foreground transition-transform duration-200 
                                                    origin-left ${isSelected ? "scale-x-100" : "scale-x-0"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}