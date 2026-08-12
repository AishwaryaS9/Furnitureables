import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
}

interface LowStockProductsProps {
    products?: Product[];
}

export default function LowStockProducts({ products = [] }: LowStockProductsProps) {
    const hasLowStock = products.length > 0;

    return (
        <Card
            className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs h-full flex flex-col"
            role="region"
            aria-label="Low Stock Inventory Alerts"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                        Low Stock Products
                    </CardTitle>
                    {hasLowStock && (
                        <Badge variant="destructive" className="rounded-full px-2 py-0.5 text-xs font-semibold">
                            {products.length}
                        </Badge>
                    )}
                </div>
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${hasLowStock
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                    aria-hidden="true"
                >
                    {hasLowStock ? (
                        <AlertTriangle className="h-5 w-5" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5" />
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 flex-1 flex flex-col justify-center">
                {!hasLowStock ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                            All products are sufficiently stocked.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border/40" role="list">
                        {products.map((product) => (
                            <li
                                key={product.id}
                                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                            >
                                <div className="min-w-0 flex-1 pr-3">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="shrink-0 border-destructive/30 bg-destructive/10 text-destructive text-xs font-semibold"
                                >
                                    {product.stock} remaining
                                </Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}