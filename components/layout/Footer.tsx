"use client";

import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-16 pb-8 text-foreground transition-colors">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="space-y-4">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-primary">
              Furniture<span className="font-sans text-muted-foreground">ables</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Crafting timeless furniture pieces that bring comfort, elegance, and soul to your living spaces since 2012.
            </p>
            <div className="flex space-x-4 pt-2 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Pinterest"><FaPinterest size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ & Help</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/artisans" className="hover:text-primary transition-colors">Meet the Artisans</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wider">Join the Collective</h3>
            <p className="text-muted-foreground text-sm mb-4">Get 10% off your first order and stay updated on new collections.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-muted/40 border border-input rounded-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button type="submit" className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground/80 text-xs">
          <p>© {new Date().getFullYear()} Furnitureables Co. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}