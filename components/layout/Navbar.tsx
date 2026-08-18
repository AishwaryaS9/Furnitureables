"use client";

import { useState, useRef, useEffect, useId } from "react";
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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "../product/filters/SearchBar";
import Image from "next/image";
import logo from "@/public/logo.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuId = useId();

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
    setIsMobileCategoriesOpen(false);
  }

  const isActive = (href: string) => pathname === href;

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
              "https://www.furnitureables.com/",
              "https://www.furnitureables.com/products",
              "https://www.furnitureables.com/about",
              "https://www.furnitureables.com/contact",
              "https://www.furnitureables.com/wishlist",
              "https://www.furnitureables.com/cart",
            ],
          }),
        }}
      />

      <div className="w-full bg-background transition-colors">
        {/* Skip to Main Content Link (WCAG 2.2 AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          Skip to main content
        </a>

        {/* Top Promotional Bar */}
        <aside
          role="note"
          aria-label="Current promotions"
          className="w-full bg-primary text-primary-foreground text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Mid-Summer Sale: Up to 40% off premium solid wood furniture! 🪵
          </span>
        </aside>

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
                  priority
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
                          className="block rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:bg-secondary"
                        >
                          {formatCategoryLabel(cat.type)}
                        </Link>
                      ))}

                    <div className="my-1.5 border-t border-border/60" />
                    <Link
                      href="/products"
                      role="menuitem"
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
              {!user ? (
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
                  }
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

            {/* Mobile Sidebar Navigation Drawer */}
            <div className="flex md:hidden items-center gap-1">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary border-0 bg-transparent cursor-pointer"
                  aria-label={isOpen ? "Close main menu" : "Open main menu"}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </SheetTrigger>

                <SheetContent side="right" className="w-full max-w-xs p-0 bg-card flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                    {/* Header Logo */}
                    <SheetHeader className="text-left pb-4 border-b border-border/60">
                      <Image
                        src={logo}
                        alt="Furnitureables"
                        priority
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}