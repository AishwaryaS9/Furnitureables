"use client";

import { useState, useRef, useEffect, useId } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Menu, ChevronDown, PackageIcon, MapPinned, Sparkles, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductCategories } from "@/hooks/useProductCategories";
import { formatCategoryLabel } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useActivePromotion } from "@/hooks/useActivePromotion";
import { event as trackEvent } from "@/lib/analytics/gtag";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "../product/filters/SearchBar";
import Image from "next/image";
import logo from "@/public/logo.svg";

const loadMobileMenu = () => import("./MobileMenu");
const MobileMenu = dynamic(loadMobileMenu, { ssr: false });
const preloadMobileMenu = () => {
  void loadMobileMenu();
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuId = useId();

  const { user, isLoaded: isUserLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const { data } = useWishlist(!!user);
  const wishlistCount = user ? data?.wishlist.length ?? 0 : 0;

  const { data: topCategories = [], isLoading: categoriesLoading } =
    useProductCategories(5);
  const { data: activePromotion } = useActivePromotion();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsDropdownOpen(false);
  }

  const isActive = (href: string) => pathname === href;

  const handleCopyPromoCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Code "${code}" copied!`);
    } catch (error) {
      console.error("Failed to copy promo code:", error);
      toast.error("Couldn't copy the code. Please try again.");
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            "name": [
              "Home",
              "Shop Furniture",
              "About Us",
              "Contact",
              "Wishlist",
              "Cart",
            ],
            "url": [
              "https://furnitureables-store.vercel.app",
              "https://furnitureables-store.vercel.app/products",
              "https://furnitureables-store.vercel.app/about",
              "https://furnitureables-store.vercel.app/contact",
              "https://furnitureables-store.vercel.app/wishlist",
              "https://furnitureables-store.vercel.app/cart",
            ],
          }),
        }}
      />

      <div className="w-full bg-background transition-colors">
        {/* Dynamic Promotional Bar */}
        {activePromotion?.promotionText && (
          <button
            type="button"
            onClick={() => handleCopyPromoCode(activePromotion.code)}
            aria-label={`${activePromotion.promotionText}. Copy code ${activePromotion.code} to clipboard`}
            className="w-full bg-primary text-primary-foreground text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{activePromotion.promotionText}</span>
          </button>
        )}

        {/* Main Header Container */}
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">

            {/* Brand Logo */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg"
                aria-label="Furnitureables Homepage"
              >
                <Image
                  src={logo}
                  alt="Furnitureables"
                  loading="eager"
                  className="w-44 h-auto sm:w-52 md:w-52 lg:w-56 xl:w-64"
                />
              </Link>
            </div>
            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-xs sm:text-sm"
            >
              <Link
                href="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md py-1",
                  isActive("/") ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                Home
              </Link>

              {/* Shop Furniture Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-controls={dropdownMenuId}
                  className={cn(
                    "inline-flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md py-1 cursor-pointer border-0 bg-transparent p-0",
                    pathname.startsWith("/categories") || pathname === "/products"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <span>Shop Furniture</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    id={dropdownMenuId}
                    role="menu"
                    aria-label="Furniture categories directory"
                    className="absolute top-full left-0 mt-3 w-64 rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-lg z-50 p-2 animate-in fade-in-50 slide-in-from-top-2 duration-200"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Browse Categories
                    </div>

                    {categoriesLoading && (
                      <div className="px-1 py-1" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="mx-3 my-2 block h-4 w-32 rounded bg-muted animate-pulse"
                          />
                        ))}
                      </div>
                    )}

                    {!categoriesLoading && topCategories.length === 0 && (
                      <p className="px-3 py-2 text-xs text-muted-foreground">
                        No categories yet.
                      </p>
                    )}

                    {!categoriesLoading &&
                      topCategories.map((cat) => (
                        <Link
                          key={cat.type}
                          href={`/products?category=${encodeURIComponent(cat.type)}`}
                          role="menuitem"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:bg-secondary"
                        >
                          {formatCategoryLabel(cat.type)}
                        </Link>
                      ))}

                    <div className="my-1.5 border-t border-border/60" />
                    <Link
                      href="/products"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:bg-secondary"
                    >
                      <span>Browse All Collections</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Link 1: About Us */}
              <Link
                href="/about"
                aria-current={isActive("/about") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md py-1",
                  isActive("/about")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <span>About Us</span>
              </Link>

              {/* Link 2: Contact */}
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md py-1",
                  isActive("/contact")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <span>Contact</span>
              </Link>
            </nav>

            {/* Desktop Search Bar Component */}
            <SearchBar className="hidden lg:flex items-center flex-1 max-w-sm relative mx-4" inputClassName="h-9 py-2 pl-10 pr-9" />

            {/* Desktop Header Actions */}
            <div className="hidden md:flex items-center gap-4 lg:gap-5 text-muted-foreground">
              {!isUserLoaded ? (
                <span
                  aria-hidden="true"
                  className="inline-block h-9 w-19 rounded-full bg-muted/60"
                />
              ) : !user ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openSignIn()}
                  className="h-9 px-4 text-xs font-semibold uppercase tracking-wider rounded-full cursor-pointer border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Log in to account"
                >
                  Login
                </Button>
              ) : (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8 border border-border/80 shadow-2xs",
                    },
                  }}
                  aria-label="User account menu"
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Orders"
                      onClick={() => router.push("/orders")}
                      labelIcon={<PackageIcon size={16} />}
                    />
                    <UserButton.Link
                      label="My Addresses"
                      labelIcon={<MapPinned className="h-4 w-4" />}
                      href="/addresses"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              )}

              <Link
                href="/wishlist"
                aria-label={
                  wishlistCount > 0
                    ? `Wishlist, ${wishlistCount} saved items`
                    : "Wishlist"
                }
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    toast.info("Please sign in to view your wishlist.");
                    openSignIn();
                    return;
                  }
                  trackEvent("select_content", {
                    content_type: "wishlist_icon",
                    items_in_wishlist: wishlistCount,
                  });
                }}
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <Badge
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-mono"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              <Link
                href="/cart"
                aria-label={
                  totalItems > 0 ? `Shopping Cart, ${totalItems} items` : "Shopping Cart"
                }
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() =>
                  trackEvent("select_content", {
                    content_type: "cart_icon",
                    items_in_cart: totalItems,
                  })
                }
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {totalItems > 0 && (
                  <Badge
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive text-primary-foreground font-mono animate-in zoom-in-50"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </div>

            {/* Mobile Sidebar Navigation Drawer (code-split, loaded on first open) */}
            <div className="flex md:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuMounted(true);
                  setIsOpen(true);
                }}
                onPointerEnter={preloadMobileMenu}
                onFocus={preloadMobileMenu}
                onTouchStart={preloadMobileMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary border-0 bg-transparent cursor-pointer"
                aria-label="Open main menu"
                aria-haspopup="dialog"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              {mobileMenuMounted && (
                <MobileMenu open={isOpen} onOpenChange={setIsOpen} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}