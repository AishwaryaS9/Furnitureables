import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyOrders() {
    return (
        <section className="container mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12">
            <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <PackageSearch className="h-12 w-12 text-muted-foreground" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    No Orders Yet
                </h1>

                <p className="mt-3 max-w-md text-muted-foreground">
                    Looks like you haven't placed any orders yet.
                    Explore our collection and find something
                    you'll love.
                </p>

                <Button
                    // asChild
                    size="lg"
                    className="mt-8"
                >
                    <Link href="/products">
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </section>
    );
}