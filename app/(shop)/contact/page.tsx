"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitToWeb3Forms } from "@/lib/web3forms";
import { CONTACT_TRUST_STATS, CONTACT_QUICK_TOPICS } from "@/lib/data";
import { SUPPORT_EMAIL } from "@/lib/constants/contact";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await submitToWeb3Forms({
                subject: `New contact form message: ${formData.subject}`,
                name: formData.name,
                email: formData.email,
                message: formData.message,
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            toast.success("Thank you for your message! Our team will respond within 24 hours.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Furnitureables",
        "description": "Get in touch with Furnitureables for order inquiries, custom furniture quotes, or support.",
        "mainEntity": {
            "@type": "Organization",
            "name": "Furnitureables",
            "telephone": "+91-820-555-0199",
            "email": SUPPORT_EMAIL,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Artisan Way, Kadiyali",
                "addressLocality": "Udupi",
                "addressRegion": "Karnataka",
                "postalCode": "576101",
                "addressCountry": "IN",
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <main
                id="main-content"
                tabIndex={-1}
                aria-labelledby="contact-page-heading"
                className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20 focus:outline-none"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

                    {/* Header Section */}
                    <header className="text-center max-w-2xl mx-auto space-y-3">
                        <span
                            className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50"
                            aria-label="Department: Customer Concierge"
                        >
                            Customer Concierge
                        </span>
                        <h1
                            id="contact-page-heading"
                            className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-foreground"
                        >
                            Get in Touch
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                            Have questions about an upcoming order, timber options, or custom dimensions? Send us a message and our team will get back to you promptly.
                        </p>
                    </header>

                    {/* Trust Strip */}
                    <section aria-label="Customer service statistics and facts">
                        <ul
                            role="list"
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto list-none p-0 m-0"
                        >
                            {CONTACT_TRUST_STATS.map((stat) => (
                                <li
                                    key={stat.label}
                                    className="rounded-2xl border border-border/50 bg-card px-4 py-3 text-center shadow-2xs"
                                    aria-label={stat.ariaLabel}
                                >
                                    <p className="text-base sm:text-lg font-serif text-foreground" aria-hidden="true">
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mt-0.5" aria-hidden="true">
                                        {stat.label}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Main Grid: Form + Info Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Contact Form */}
                        <section aria-labelledby="contact-form-title" className="lg:col-span-2">
                            <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
                                <CardHeader className="border-b border-border/40 pb-4">
                                    <CardTitle id="contact-form-title" className="text-base font-semibold tracking-tight">
                                        Send Us a Message
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form
                                        onSubmit={handleSubmit}
                                        aria-label="Contact support form"
                                        noValidate={false}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label
                                                    htmlFor="contact-name"
                                                    className="text-xs font-medium text-foreground"
                                                >
                                                    Your Name <span className="text-destructive" aria-hidden="true">*</span>
                                                    <span className="sr-only">(required)</span>
                                                </label>
                                                <Input
                                                    id="contact-name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="h-9 text-xs rounded-xl bg-muted/40"
                                                    aria-required="true"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label
                                                    htmlFor="contact-email"
                                                    className="text-xs font-medium text-foreground"
                                                >
                                                    Email Address <span className="text-destructive" aria-hidden="true">*</span>
                                                    <span className="sr-only">(required)</span>
                                                </label>
                                                <Input
                                                    id="contact-email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="h-9 text-xs rounded-xl bg-muted/40"
                                                    aria-required="true"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="contact-subject"
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Subject <span className="text-destructive" aria-hidden="true">*</span>
                                                <span className="sr-only">(required)</span>
                                            </label>
                                            <Input
                                                id="contact-subject"
                                                name="subject"
                                                type="text"
                                                required
                                                placeholder="Custom Order Inquiry / Order #12345"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="h-9 text-xs rounded-xl bg-muted/40"
                                                aria-required="true"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="contact-message"
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Message <span className="text-destructive" aria-hidden="true">*</span>
                                                <span className="sr-only">(required)</span>
                                            </label>
                                            <Textarea
                                                id="contact-message"
                                                name="message"
                                                required
                                                rows={5}
                                                placeholder="Tell us how we can help you..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="text-xs rounded-xl bg-muted/40 resize-y"
                                                aria-required="true"
                                                aria-describedby="privacy-notice"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            aria-busy={loading}
                                            className="w-full sm:w-auto h-10 px-6 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                                    <span>Sending Message...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </Button>

                                        <p id="privacy-notice" className="text-[11px] text-muted-foreground/80 pt-1">
                                            We only use your details to respond to this message — never shared or sold.
                                        </p>
                                    </form>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Direct Contact Information Cards */}
                        <aside aria-label="Direct contact details and studio location" className="space-y-4">
                            <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
                                <CardContent className="p-5 space-y-4 text-xs sm:text-sm">

                                    {/* Email Support */}
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Email Care</p>
                                            <a
                                                href={`mailto:${SUPPORT_EMAIL}`}
                                                aria-label={`Send email to ${SUPPORT_EMAIL}`}
                                                className="text-muted-foreground hover:text-foreground transition-colors break-all"
                                            >
                                                {SUPPORT_EMAIL}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Phone Support */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Phone Support</p>
                                            <a
                                                href="tel:+918205550199"
                                                aria-label="Call +91 820 555 0199"
                                                className="text-muted-foreground font-mono hover:text-foreground transition-colors"
                                            >
                                                +91 820 555 0199
                                            </a>
                                        </div>
                                    </div>

                                    {/* Studio Address */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Craft Studio</p>
                                            <address className="not-italic text-muted-foreground leading-relaxed">
                                                123 Artisan Way, Kadiyali<br />
                                                Udupi, Karnataka 576101, India
                                            </address>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Studio Hours</p>
                                            <p className="text-muted-foreground">Mon – Fri: 9am – 6pm IST</p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>

                            {/* Studio Map */}
                            <Card className="rounded-2xl border-border/60 bg-card shadow-2xs overflow-hidden py-0">
                                <iframe
                                    title="Interactive Google Map showing Furnitureables Craft Studio in Udupi, Karnataka"
                                    src="https://www.google.com/maps?q=Udupi,Karnataka,India&output=embed"
                                    className="w-full h-44 grayscale-40 contrast-[1.05]"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    aria-label="Map showing Furnitureables Craft Studio in Udupi"
                                />
                            </Card>
                        </aside>

                    </div>

                    {/* Quick Topics */}
                    <section aria-labelledby="quick-topics-heading" className="max-w-3xl mx-auto text-center space-y-4">
                        <h2
                            id="quick-topics-heading"
                            className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
                        >
                            Or jump straight to
                        </h2>
                        <nav aria-label="Quick contact links" className="flex flex-wrap justify-center gap-2">
                            {CONTACT_QUICK_TOPICS.map((topic) => (
                                <Link
                                    key={topic.label}
                                    href={topic.href}
                                    aria-label={topic.ariaLabel}
                                    className="text-xs font-medium px-4 py-2 rounded-full border border-border/60 bg-secondary/50 text-foreground hover:bg-secondary hover:border-border transition-colors"
                                >
                                    {topic.label}
                                </Link>
                            ))}
                        </nav>
                    </section>
                </div>
            </main>
        </>
    );
}