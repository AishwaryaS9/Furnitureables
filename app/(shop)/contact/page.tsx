"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

        // Simulate contact form submission
        setTimeout(() => {
            setLoading(false);
            toast.success("Thank you for your message! Our team will respond within 24 hours.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1000);
    };

    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Furnitureables",
        "description": "Get in touch with Furnitureables for order inquiries, custom furniture quotes, or support.",
        "mainEntity": {
            "@type": "Organization",
            "name": "Furnitureables",
            "telephone": "+1-800-555-0199",
            "email": "support@furnitureables.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Artisan Way",
                "addressLocality": "Portland",
                "addressRegion": "OR",
                "postalCode": "97201",
                "addressCountry": "US",
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <main className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

                    {/* Header Section */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50">
                            Customer Concierge
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-foreground">
                            Get in Touch
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                            Have questions about an upcoming order, timber options, or custom dimensions? Send us a message and our team will get back to you promptly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Contact Form */}
                        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card shadow-2xs">
                            <CardHeader className="border-b border-border/40 pb-4">
                                <CardTitle className="text-base font-semibold tracking-tight">
                                    Send Us a Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="contact-name" className="text-xs font-medium text-foreground">
                                                Your Name
                                            </label>
                                            <Input
                                                id="contact-name"
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="h-9 text-xs rounded-xl bg-muted/40"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="contact-email" className="text-xs font-medium text-foreground">
                                                Email Address
                                            </label>
                                            <Input
                                                id="contact-email"
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="h-9 text-xs rounded-xl bg-muted/40"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-subject" className="text-xs font-medium text-foreground">
                                            Subject
                                        </label>
                                        <Input
                                            id="contact-subject"
                                            type="text"
                                            required
                                            placeholder="Custom Order Inquiry / Order #12345"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="h-9 text-xs rounded-xl bg-muted/40"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-message" className="text-xs font-medium text-foreground">
                                            Message
                                        </label>
                                        <Textarea
                                            id="contact-message"
                                            required
                                            rows={5}
                                            placeholder="Tell us how we can help you..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="text-xs rounded-xl bg-muted/40 resize-y"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
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
                                </form>
                            </CardContent>
                        </Card>

                        {/* Direct Contact Information Cards */}
                        <div className="space-y-4">
                            <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
                                <CardContent className="p-5 space-y-4 text-xs sm:text-sm">

                                    {/* Email Support */}
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Email Care</p>
                                            <p className="text-muted-foreground">support@furnitureables.com</p>
                                        </div>
                                    </div>

                                    {/* Phone Support */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Phone Support</p>
                                            <p className="text-muted-foreground font-mono">+1 (800) 555-0199</p>
                                        </div>
                                    </div>

                                    {/* Studio Address */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Craft Studio</p>
                                            <p className="text-muted-foreground leading-relaxed">
                                                123 Artisan Way, Suite 400<br />
                                                Portland, OR 97201, USA
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Studio Hours</p>
                                            <p className="text-muted-foreground">Mon – Fri: 9am – 6pm EST</p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}