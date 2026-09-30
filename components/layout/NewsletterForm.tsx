"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitToWeb3Forms } from "@/lib/web3forms";
import { event as trackEvent } from "@/lib/analytics/gtag";
import { Button } from "@/components/ui/button";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubscribing(true);

        try {
            const result = await submitToWeb3Forms({
                subject: "New newsletter subscription",
                name: "Newsletter Subscriber",
                email,
                message: `New newsletter subscription request from: ${email}`,
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            toast.success("You're subscribed! Watch your inbox for new timber drops.");
            trackEvent("sign_up", { method: "newsletter_footer" });
            setEmail("");
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 3000);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong. Please try again."
            );
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribing}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-muted/50 border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all disabled:opacity-60"
                />
            </div>
            <Button
                type="submit"
                size="sm"
                disabled={subscribing}
                className="w-full h-9 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none"
            >
                {subscribing ? (
                    <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                    </>
                ) : subscribed ? (
                    <>
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                        <span>Subscribed!</span>
                    </>
                ) : (
                    <span>Subscribe Now</span>
                )}
            </Button>
        </form>
    );
}
