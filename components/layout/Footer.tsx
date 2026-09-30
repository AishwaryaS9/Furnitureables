import Link from "next/link";
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import FooterCategories from "./FooterCategories";
import NewsletterForm from "./NewsletterForm";
import Image from "next/image";
import logo from "@/public/logo.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground border-t border-border/80 transition-colors">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-block text-2xl font-serif font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
              aria-label="Furnitureables Homepage"
            >
              <Image
                src={logo}
                alt="Furnitureables"
                className="w-44 h-auto sm:w-52 md:w-52 lg:w-56 xl:w-64"
              />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Artisan-crafted furniture designed for modern, conscious living. Made with responsibly harvested solid timber and built for timeless comfort.
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on X"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FaYoutube className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Shop Categories (Dynamic like Navbar) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Shop Categories
            </h3>
            <FooterCategories />
          </div>

          {/* Navigation & Customer Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Stay Connected
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to receive exclusive preview access to new timber drops and seasonal promotions.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Furnitureables Co. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}