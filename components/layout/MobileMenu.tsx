"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, ChevronDown, PackageIcon, MapPinned, ArrowRight } from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductCategories } from "@/hooks/useProductCategories";
import { cn, formatCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import SearchBar from "../product/filters/SearchBar";
import logo from "@/public/logo.svg";

interface MobileMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Mobile navigation drawer. Loaded on demand (next/dynamic) the first time the
 * hamburger button is pressed, so the Sheet/dialog code is not part of the
 * initial JavaScript of every page.
 */
export default function MobileMenu({ open: isOpen, onOpenChange }: MobileMenuProps) {
    const setIsOpen = onOpenChange;
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();
    const pathname = usePathname();

    const items = useCartStore((s) => s.items);
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

    const { data } = useWishlist(!!user);
    const wishlistCount = user ? data?.wishlist.length ?? 0 : 0;

    const { data: topCategories = [], isLoading: categoriesLoading } =
        useProductCategories(5);

    const isActive = (href: string) => pathname === href;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full max-w-xs p-0 bg-card flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                    {/* Header Logo */}
                    <SheetHeader className="text-left pb-4 border-b border-border/60">
                        <Image
                            src={logo}
                            alt="Furnitureables"
                            className="w-44 h-auto sm:w-52 md:w-52 lg:w-56 xl:w-64"
                        />
                    </SheetHeader>

                    {/* Mobile Search Bar Component */}
                    <SearchBar inputClassName="text-xs h-9 rounded-xl bg-muted/50 pl-10 pr-9" clearButtonClassName="rounded-lg" />

                    {/* Primary Links Stack */}
                    <nav aria-label="Mobile Navigation" className="space-y-1">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-secondary",
                                isActive("/") ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-secondary",
                                isActive("/about") ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            <span>About Us</span>
                        </Link>

                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-secondary",
                                isActive("/contact") ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            <span>Contact</span>
                        </Link>
                    </nav>

                    <div className="border-t border-border/60 my-2" />

                    {/* Dynamic Categories List */}
                    <div className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setIsMobileCategoriesOpen((v) => !v)}
                            aria-expanded={isMobileCategoriesOpen}
                            className={cn(
                                "flex w-full items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer border-0 bg-transparent",
                                pathname.startsWith("/categories") || pathname === "/products"
                                    ? "text-foreground font-semibold"
                                    : "text-muted-foreground"
                            )}
                        >
                            <span>Shop Furniture</span>
                            <ChevronDown
                                className={cn(
                                    "h-3.5 w-3.5 transition-transform duration-200",
                                    isMobileCategoriesOpen && "rotate-180"
                                )}
                                aria-hidden="true"
                            />
                        </button>
                        {isMobileCategoriesOpen && (
                            <div className="pl-2 space-y-1 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                                {categoriesLoading && (
                                    <div className="space-y-2 px-3 py-1" aria-hidden="true">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i} className="block h-4 w-28 rounded bg-muted animate-pulse" />
                                        ))}
                                    </div>
                                )}

                                {!categoriesLoading && topCategories.length === 0 && (
                                    <p className="px-3 py-1 text-xs text-muted-foreground">No categories yet.</p>
                                )}

                                {!categoriesLoading &&
                                    topCategories.map((cat) => (
                                        <Link
                                            key={cat.type}
                                            href={`/products?category=${encodeURIComponent(cat.type)}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                        >
                                            {formatCategoryLabel(cat.type)}
                                        </Link>
                                    ))}

                                <Link
                                    href="/products"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-secondary transition-colors"
                                >
                                    <span>Browse All Collections</span>
                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-border/60 my-2" />

                    {/* Account Links with Shopping Cart */}
                    <div className="space-y-1">
                        <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                            My Account
                        </span>

                        {/* Shopping Cart Link */}
                        <Link
                            href="/cart"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                            <div className="inline-flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                <span>Shopping Cart</span>
                            </div>
                            {totalItems > 0 && (
                                <Badge variant="destructive" className="font-mono text-[10px] h-5 px-1.5">
                                    {totalItems}
                                </Badge>
                            )}
                        </Link>

                        {/* Wishlist Link */}
                        <Link
                            href="/wishlist"
                            onClick={(e) => {
                                if (!user) {
                                    e.preventDefault();
                                    toast.info("Please sign in to view your wishlist.");
                                    openSignIn();
                                } else {
                                    setIsOpen(false);
                                }
                            }}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                            <div className="inline-flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span>Wishlist</span>
                            </div>
                            {wishlistCount > 0 && (
                                <Badge variant="secondary" className="font-mono text-[10px] h-5 px-1.5">
                                    {wishlistCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Bottom Footer Section: Logged in User Profile or Login Action */}
                <div className="p-6 pt-4 border-t border-border/60 shrink-0">
                    {user ? (
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3 min-w-0">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "h-9 w-9 border border-border/80 shadow-2xs shrink-0",
                                        },
                                    }}
                                    aria-label="User account menu"
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Action
                                            label="My Orders"
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push("/orders");
                                            }}
                                            labelIcon={<PackageIcon size={16} />}
                                        />
                                        <UserButton.Link
                                            label="My Addresses"
                                            labelIcon={<MapPinned className="h-4 w-4" />}
                                            href="/addresses"
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-foreground truncate">
                                        {user.fullName || user.primaryEmailAddress?.emailAddress}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground truncate">
                                        Logged in
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                openSignIn();
                            }}
                            className="w-full h-10 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                            Sign In / Register
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
