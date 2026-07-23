"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, PackageIcon, MapPinned } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const { data } = useWishlist(!!user);

  const wishlistCount = user ? data?.wishlist.length ?? 0 : 0;

  const categories = [
    { name: "Living Room", href: "/categories/living-room" },
    { name: "Bedroom", href: "/categories/bedroom" },
    { name: "Dining & Kitchen", href: "/categories/dining-kitchen" },
    { name: "Office", href: "/categories/office" },
    { name: "Outdoor", href: "/categories/outdoor" },
  ];

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50 text-foreground transition-colors">
      <div className="w-full bg-primary text-primary-foreground text-xs py-2 px-4 text-center font-medium tracking-wide">
        Mid-Summer Sale: Up to 40% off premium solid wood furniture! 🪵
      </div>

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-primary">
              Furniture<span className="font-sans text-muted-foreground">ables</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 items-center font-medium text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                Shop Furniture <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-popover text-popover-foreground ring-1 ring-border z-50 py-2 border border-border animate-in fade-in-50 slide-in-from-top-1 duration-200">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-border my-1"></div>
                  <Link href="/products" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-accent hover:text-accent-foreground transition-colors">
                    Browse All Collections
                  </Link>
                </div>
              )}
            </div>

            <Link href="/custom-orders" className="text-muted-foreground hover:text-foreground transition-colors">
              Custom Craft
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              Our Story
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md relative mx-4">
            <input
              type="text"
              placeholder="Search sofas, dining tables, rugs..."
              className="w-full bg-muted/40 text-sm border border-input rounded-full py-2 pl-4 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            <Search className="absolute right-3 text-muted-foreground pointer-events-none" size={18} />
          </div>

          {/* Icon Actions */}
          <div className="hidden md:flex items-center space-x-4 text-muted-foreground">
            <button aria-label="Search" className="lg:hidden p-2 hover:text-foreground transition-colors">
              <Search size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-4">
              {!user ? (
                <button
                  onClick={() => openSignIn()}
                  className="px-5 py-2 border border-primary text-primary hover:bg-primary hover:border-none hover:text-white transition cursor-pointer rounded-full text-sm font-sans uppercase focus:outline-none focus:ring-0 focus:ring-primary"
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
              aria-label="Wishlist"
              className="p-2 hover:text-foreground transition-colors relative"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  toast.info("Please sign in to view your wishlist.");
                  openSignIn();
                }
              }}
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label="Cart" className="p-2 hover:text-foreground transition-colors relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4 text-muted-foreground">
            <Link href="/cart" aria-label="Cart" className="p-2 hover:text-foreground relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-foreground hover:bg-accent focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Content Drawer */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pt-2 pb-6 space-y-3 shadow-inner">
          <div className="relative my-2">
            <input
              type="text"
              placeholder="Search furniture..."
              className="w-full bg-muted/40 text-sm border border-input rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Search className="absolute right-3 top-2.5 text-muted-foreground" size={18} />
          </div>

          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            Home
          </Link>

          <div className="px-3 py-2 font-medium text-muted-foreground/70 text-xs uppercase tracking-wider">
            Shop by Category
          </div>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="block px-6 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}

          <div className="border-t border-border my-2"></div>

          <Link href="/custom-orders" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            Custom Craft
          </Link>
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            Our Story
          </Link>
          <Link href="/wishlist"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                toast.info("Please sign in to view your wishlist.");
                openSignIn();
              }
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            Wishlist
          </Link>
          <Link href="/account" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            My Account
          </Link>
        </div>
      )}
    </header>
  );
}