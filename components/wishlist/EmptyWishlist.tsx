"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EmptyWishlist() {
    return (
        <section className="flex min-h-[65vh] items-center justify-center px-4">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Heart className="h-10 w-10 text-muted-foreground" />
                </div>

                <h2 className="text-3xl font-semibold tracking-tight">
                    Your wishlist is empty
                </h2>

                <p className="mt-3 text-muted-foreground">
                    Save your favorite furniture so you can easily find it later.
                    Start exploring our collections and add the pieces you love.
                </p>
                <div className="mt-10 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
                    <div>
                        ❤️
                        <p className="mt-2">Save favorites</p>
                    </div>

                    <div>
                        🛋️
                        <p className="mt-2">Compare products</p>
                    </div>

                    <div>
                        ✨
                        <p className="mt-2">Shop anytime</p>
                    </div>
                </div>
                <Button className="mt-8 p-6">
                    <Link href="/products">
                        Browse Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}