"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, PackageIcon, MapPinned } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

const categories = [
  { name: "Living Room", href: "/categories/living-room" },
  { name: "Bedroom", href: "/categories/bedroom" },
  { name: "Dining & Kitchen", href: "/categories/dining-kitchen" },
  { name: "Office", href: "/categories/office" },
  { name: "Outdoor", href: "/categories/outdoor" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuId = useId();
  const desktopSearchId = useId();
  const mobileSearchId = useId();
  const mobileMenuId = useId();

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const { data } = useWishlist(!!user);

  const wishlistCount = user ? data?.wishlist.length ?? 0 : 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const linkClasses = (href: string) =>
    `text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${isActive(href) ? "text-foreground font-semibold" : ""
    }`;

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50 text-foreground transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to main content
      </a>

      <div
        className="w-full bg-primary text-primary-foreground text-xs py-2 px-4 text-center font-medium tracking-wide"
        role="note"
        aria-label="Promotion"
      >
        Mid-Summer Sale: Up to 40% off premium solid wood furniture! 🪵
      </div>

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              aria-label="Furnitureables — Home"
            >
              Furniture<span className="font-sans text-muted-foreground">ables</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main" className="hidden md:flex space-x-8 items-center font-medium text-sm">
            <Link href="/" aria-current={isActive("/") ? "page" : undefined} className={linkClasses("/")}>
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls={dropdownMenuId}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm py-1"
              >
                Shop Furniture
                <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div
                  id={dropdownMenuId}
                  role="menu"
                  aria-label="Shop furniture categories"
                  className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-popover text-popover-foreground ring-1 ring-border z-50 py-2 border border-border animate-in fade-in-50 slide-in-from-top-1 duration-200"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-border my-1"></div>
                  <Link
                    href="/products"
                    role="menuitem"
                    className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground"
                  >
                    Browse All Collections
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/custom-orders"
              aria-current={isActive("/custom-orders") ? "page" : undefined}
              className={linkClasses("/custom-orders")}
            >
              Custom Craft
            </Link>
            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={linkClasses("/about")}
            >
              Our Story
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form
            role="search"
            action="/search"
            className="hidden lg:flex items-center flex-1 max-w-md relative mx-4"
          >
            <label htmlFor={desktopSearchId} className="sr-only">
              Search furniture
            </label>
            <input
              id={desktopSearchId}
              name="q"
              type="search"
              placeholder="Search sofas, dining tables, rugs..."
              className="w-full bg-muted/40 text-sm border border-input rounded-full py-2 pl-4 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-transparent transition-all"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              <Search size={18} aria-hidden="true" />
            </button>
          </form>

          {/* Icon Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 text-muted-foreground">
            <button
              type="button"
              aria-label="Search"
              className="lg:hidden p-2.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              <Search size={22} aria-hidden="true" />
            </button>
            <div className="hidden sm:flex items-center gap-4">
              {!user ? (
                <button
                  type="button"
                  onClick={() => openSignIn()}
                  className="px-5 py-2 border border-primary text-primary hover:bg-primary hover:border-none hover:text-white transition cursor-pointer rounded-full text-sm font-sans uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Login or create account"
                >
                  Login
                </button>
              ) : (
                <UserButton
                  // afterSignOutUrl="/"
                  appearance={{ elements: { userButtonAvatarBox: "w-6 h-6 border-customBlack/50" } }}
                  aria-label="User account menu"
                >
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Orders" onClick={() => router.push('/orders')} labelIcon={<PackageIcon size={16} />} />
                    <UserButton.Link
                      label="My Addresses"
                      labelIcon={<MapPinned className="h-4 w-4" />}
                      href="/addresses"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              )}
            </div>

            <Link
              href="/wishlist"
              aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : "Wishlist"}
              className="p-2.5 hover:text-foreground transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  toast.info("Please sign in to view your wishlist.");
                  openSignIn();
                }
              }}
            >
              <Heart size={22} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"}
              className="p-2.5 hover:text-foreground transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              <ShoppingCart size={22} aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-in zoom-in duration-300"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1 text-muted-foreground">
            <Link
              href="/cart"
              aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"}
              className="p-2.5 hover:text-foreground relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            >
              <ShoppingCart size={24} aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-in zoom-in duration-300"
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2.5 rounded-md hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              aria-expanded={isOpen}
              aria-controls={mobileMenuId}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Content Drawer */}
      <div
        id={mobileMenuId}
        hidden={!isOpen}
        className="md:hidden bg-background border-t border-border px-4 pt-2 pb-6 space-y-3 shadow-inner"
      >
        <form role="search" action="/search" className="relative my-2">
          <label htmlFor={mobileSearchId} className="sr-only">
            Search furniture
          </label>
          <input
            id={mobileSearchId}
            name="q"
            type="search"
            placeholder="Search furniture..."
            className="w-full bg-muted/40 text-sm border border-input rounded-lg py-2 pl-4 pr-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1 top-1 p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </form>

        <Link
          href="/"
          aria-current={isActive("/") ? "page" : undefined}
          className={`block px-3 py-2.5 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive("/") ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
        >
          Home
        </Link>

        <div className="px-3 py-2 font-medium text-muted-foreground/70 text-xs uppercase tracking-wider" id={`${mobileMenuId}-categories`}>
          Shop by Category
        </div>
        <ul aria-labelledby={`${mobileMenuId}-categories`} className="list-none">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={cat.href}
                className="block px-6 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-border my-2"></div>

        <Link
          href="/custom-orders"
          aria-current={isActive("/custom-orders") ? "page" : undefined}
          className={`block px-3 py-2.5 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive("/custom-orders") ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
        >
          Custom Craft
        </Link>
        <Link
          href="/about"
          aria-current={isActive("/about") ? "page" : undefined}
          className={`block px-3 py-2.5 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive("/about") ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
        >
          Our Story
        </Link>
        <Link
          href="/wishlist"
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              toast.info("Please sign in to view your wishlist.");
              openSignIn();
            }
          }}
          className="block px-3 py-2.5 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Wishlist
        </Link>
        <Link
          href="/account"
          className="block px-3 py-2.5 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          My Account
        </Link>
      </div>
    </header>
  );
}