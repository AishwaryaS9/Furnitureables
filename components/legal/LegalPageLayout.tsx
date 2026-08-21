import Link from "next/link";
import { LegalPageLayoutProps } from "@/types/legal";

export default function LegalPageLayout({ eyebrow, title, description, lastUpdated, sections }: LegalPageLayoutProps) {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            aria-labelledby="legal-page-title"
            className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20 focus:outline-none"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header Section */}
                <header className="text-center max-w-2xl mx-auto space-y-3">
                    <span
                        className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50"
                        aria-label={`Category: ${eyebrow}`}
                    >
                        {eyebrow}
                    </span>
                    <h1
                        id="legal-page-title"
                        className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-foreground"
                    >
                        {title}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 font-mono">
                        Last updated: <time dateTime="2026-08-21">{lastUpdated}</time>
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Table of Contents */}
                    <nav
                        aria-label="Table of contents"
                        className="hidden lg:block lg:col-span-1 sticky top-24 rounded-2xl border border-border/60 bg-card p-5 shadow-2xs"
                    >
                        <p
                            id="toc-heading"
                            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3"
                        >
                            On This Page
                        </p>
                        <ul aria-labelledby="toc-heading" className="space-y-2 list-none p-0 m-0">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        aria-label={`Jump to ${section.title}`}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors leading-relaxed block"
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Content Sections */}
                    <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card divide-y divide-border/50 shadow-2xs">
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                aria-labelledby={`section-${section.id}-heading`}
                                className="p-6 sm:p-8 scroll-mt-24 space-y-3"
                            >
                                <h2
                                    id={`section-${section.id}-heading`}
                                    className="text-lg sm:text-xl font-serif font-normal tracking-tight text-foreground"
                                >
                                    {section.title}
                                </h2>
                                <div className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed space-y-3">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Contact Footnote */}
                <footer aria-label="Support navigation" className="max-w-2xl mx-auto text-center space-y-2 pt-4">
                    <p className="text-xs sm:text-sm text-muted-foreground font-light">
                        Questions about this policy? Reach out to our team.
                    </p>
                    <Link
                        href="/contact"
                        aria-label="Navigate to contact us page for questions"
                        className="inline-block text-xs font-medium px-4 py-2 rounded-full border border-border/60 bg-secondary/50 text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer"
                    >
                        Contact Us
                    </Link>
                </footer>
            </div>
        </main>
    );
}