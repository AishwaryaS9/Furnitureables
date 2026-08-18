"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Minus, Plus, Maximize2, X, AlertCircle } from "lucide-react";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductReviews from "@/components/product/ProductReviews";
import { Product } from "@/types/product";
import { useAddToCart } from "@/hooks/useAddToCart";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/order";
import { ProductReviews as ProductReviewsData } from "@/types/review";

export default function ProductClient({ product, reviews }: { product: Product; reviews: ProductReviewsData }) {
    const addToCart = useAddToCart();
    const [quantity, setQuantity] = useState(1);

    // Modal & Zoom State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
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

    const [selectedImage, setSelectedImage] = useState(
        () => images[0]?.url ?? "/images/placeholder.jpg"
    );

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    // Cursor tracking for modal high-res zoom
    const handleModalMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!modalImageRef.current) return;
        const { left, top, width, height } =
            modalImageRef.current.getBoundingClientRect();

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
        "description":
            product.description || `${product.title} crafted in premium materials.`,
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.price,
            "availability": isOutOfStock
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <main
                id="main-content"
                tabIndex={-1}
                className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background transition-colors duration-200"
            >
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">

                    {/* Breadcrumb Navigation */}
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground flex-wrap">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true" className="text-border">/</li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded-sm"
                                >
                                    Shop
                                </Link>
                            </li>
                            <li aria-hidden="true" className="text-border">/</li>
                            <li>
                                <span
                                    className="text-foreground font-semibold truncate max-w-50 sm:max-w-xs block"
                                    aria-current="page"
                                >
                                    {product.title}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Main Product Section Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* Left Canvas: Gallery Showcase */}
                        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">

                            {/* Main Image Canvas with Zoom Modal Trigger */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="group relative aspect-square sm:aspect-4/3 w-full max-h-115 rounded-2xl bg-secondary/40 border border-border/60 overflow-hidden shadow-xs cursor-pointer"
                                role="button"
                                tabIndex={0}
                                aria-label="Click to enlarge product image"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setIsModalOpen(true);
                                    }
                                }}
                            >
                                <Image
                                    src={selectedImage}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                    className="object-contain p-4 sm:p-8 transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Stock Status Pill Overlay */}
                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                    {isOutOfStock ? (
                                        <span className="rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md">
                                            Out of Stock
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-success/15 text-success border border-success/30 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md">
                                            In Stock
                                        </span>
                                    )}
                                </div>

                                {/* Expand / Zoom Hint Icon */}
                                <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-md border border-border p-2 rounded-xl text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all shadow-xs">
                                    <Maximize2 className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Thumbnails Header */}
                            <div className="flex items-center  text-[11px] text-muted-foreground px-1">
                                <span>Gallery</span>
                            </div>

                            {/* Thumbnail Selector Row */}
                            <div
                                role="region"
                                aria-label="Product image thumbnails"
                                className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
                            >
                                {images.map((image, index) => {
                                    const isSelected = selectedImage === image.url;
                                    return (
                                        <button
                                            key={image.id ?? index}
                                            type="button"
                                            onClick={() => setSelectedImage(image.url)}
                                            aria-label={`View image ${index + 1} of ${images.length} for ${product.title}`}
                                            aria-pressed={isSelected}
                                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-ring cursor-pointer
                        ${isSelected
                                                    ? "border-primary ring-2 ring-primary/20 bg-card"
                                                    : "border-border/80 bg-secondary/30 hover:border-muted-foreground/50 opacity-80 hover:opacity-100"
                                                }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={`${product.title} view ${index + 1}`}
                                                fill
                                                sizes="64px"
                                                className="object-cover p-1"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Canvas: Product Details Column */}
                        <div className="lg:col-span-6 space-y-5">

                            {/* Header Title & Pricing */}
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

                                {/* Low Stock Alert Text */}
                                {isLowStock && (
                                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 pt-0.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                        <span>Hurry! Only {product.stock} items left in stock.</span>
                                    </div>
                                )}

                                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-1 font-light">
                                    {product.description ||
                                        "Sustainably engineered furniture piece crafted to blend structural form with modern living aesthetics."}
                                </p>
                            </div>

                            {/* Summary Specs Block */}
                            {(product.material || product.type || product.color) && (
                                <div className="space-y-1.5 text-xs">
                                    <span className="text-muted-foreground font-semibold uppercase tracking-wider block text-[10px]">
                                        Specifications
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 bg-secondary/40 border border-border/60 p-3 rounded-xl">
                                        {product.material && (
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase">Material</span>
                                                <span className="font-medium text-foreground capitalize text-xs">{product.material}</span>
                                            </div>
                                        )}
                                        {product.type && (
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase">Type</span>
                                                <span className="font-medium text-foreground capitalize text-xs">{product.type}</span>
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

                            {/* Purchasing Controls Area */}
                            <div className="space-y-2.5 pt-1">
                                <label
                                    htmlFor="quantity-stepper"
                                    className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Quantity
                                </label>

                                <div className="flex items-center gap-3">

                                    {/* Stepper Input using Shadcn Ghost Buttons */}
                                    <div
                                        id="quantity-stepper"
                                        aria-label="Quantity selector"
                                        className="flex items-center justify-between border border-input rounded-xl bg-card h-11 w-28 px-1 shadow-xs"
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            disabled={quantity <= 1 || isOutOfStock}
                                            aria-label="Decrease quantity"
                                            className="w-7 h-7 text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                        >
                                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Button>

                                        <span className="font-semibold text-xs tabular-nums text-foreground">
                                            {quantity}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                            disabled={quantity >= product.stock || isOutOfStock}
                                            aria-label="Increase quantity"
                                            className="w-7 h-7 text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Button>
                                    </div>

                                    {/* Add to Bag Button */}
                                    <Button
                                        disabled={isOutOfStock}
                                        onClick={handleAddToCart}
                                        className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {isOutOfStock ? "Out of Stock" : "Add to Bag"}
                                    </Button>

                                    {/* Wishlist Toggle Button */}
                                    <div className="h-11 w-11 flex items-center justify-center border border-input bg-card rounded-xl shadow-xs shrink-0">
                                        <WishlistButton
                                            productId={product.id}
                                            isWishlisted={product.isWishlisted}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Trust Badges */}
                            <div className="space-y-2.5 pt-4 border-t border-border/80 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-secondary border border-border/50 text-foreground">
                                        <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs">Complimentary Insured Delivery</p>
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

                    {/* Bottom Section: Related Showcase */}
                    <section aria-label="Related products" className="mt-16 sm:mt-24 pt-10 border-t border-border">
                        <div className="text-left mb-6 space-y-1">
                            <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-foreground">
                                You Might Also Like
                            </h2>
                            <p className="text-xs text-muted-foreground font-light">
                                Explore complementary architectural pieces from our collection.
                            </p>
                        </div>

                        <RelatedProducts type={product.type} id={product.id} />
                    </section>

                    <ProductReviews productId={product.id} initialData={reviews} />

                </div>
            </main>

            {/* MYNTRA-STYLE ZOOM LIGHTBOX MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[85vw] lg:max-w-[65vw] xl:max-w-6xl h-[90vh] p-0 overflow-hidden bg-background border-border flex flex-col rounded-2xl [&>button[data-slot=dialog-close]]:hidden [&>button.absolute]:hidden">
                    <DialogTitle className="sr-only">
                        Image zoom viewer for {product.title}
                    </DialogTitle>

                    {/* Modal Header */}
                    <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border flex items-center justify-between bg-card shrink-0">
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">{product.title}</h3>
                            <p className="text-[11px] text-muted-foreground hidden sm:block">Move cursor over image to inspect fine detail</p>
                        </div>
                        <DialogClose render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-1.5 h-8 w-8 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        } />
                    </div>

                    {/* Modal Body: Large Magnifier View & Thumbnail Sidebar */}
                    <div className="flex-1 flex flex-col md:grid md:grid-cols-12 overflow-hidden min-h-0">

                        {/* Magnifier Canvas */}
                        <div
                            ref={modalImageRef}
                            onMouseMove={handleModalMouseMove}
                            className="flex-1 min-h-0 md:col-span-10 md:h-full relative w-full bg-secondary/20 overflow-hidden cursor-crosshair flex items-center justify-center"
                        >
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                priority
                                sizes="100vw"
                                style={{
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: "scale(2.5)",
                                }}
                                className="object-contain p-4 sm:p-6 md:p-10 transition-transform duration-75 ease-out pointer-events-none"
                            />
                        </div>

                        {/* Thumbnail Navigation Sidebar */}
                        <div className="md:col-span-2 shrink-0 p-3 sm:p-4 bg-card border-t md:border-t-0 md:border-l border-border flex flex-row md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto no-scrollbar">
                            {images.map((image, index) => {
                                const isSelected = selectedImage === image.url;
                                return (
                                    <button
                                        key={image.id ?? index}
                                        type="button"
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-full shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${isSelected
                                            ? "border-primary ring-2 ring-primary/20 bg-background"
                                            : "border-border/60 hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${product.title} preview ${index + 1}`}
                                            fill
                                            sizes="160px"
                                            className="object-contain p-1.5"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}