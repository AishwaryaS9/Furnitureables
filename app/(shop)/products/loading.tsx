export default function ProductsLoading() {
    return (
        <main className="min-h-screen bg-background text-foreground antialiased">
            <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div
                    role="status"
                    aria-label="Loading products"
                    className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                >
                    <span className="sr-only">Loading catalog products...</span>
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="space-y-4 animate-pulse rounded-2xl border border-border/50 p-3 bg-card"
                        >
                            <div className="aspect-square w-full rounded-lg bg-muted" />
                            <div className="space-y-2.5 px-1">
                                <div className="h-4 bg-muted rounded-md w-2/3" />
                                <div className="h-3.5 bg-muted rounded-md w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
