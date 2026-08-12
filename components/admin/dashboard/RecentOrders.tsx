import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    date: string;
    amount: string;
    status: "Completed" | "Pending" | "Processing" | "Cancelled";
}

interface RecentOrdersProps {
    orders?: Order[];
}

export default function RecentOrders({ orders = [] }: RecentOrdersProps) {
    const hasOrders = orders.length > 0;

    const getStatusBadgeVariant = (status: Order["status"]) => {
        switch (status) {
            case "Completed":
                return "outline";
            case "Processing":
            case "Pending":
                return "secondary";
            case "Cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <Card
            className="rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl shadow-xs"
            role="region"
            aria-label="Recent Customer Orders"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 sm:p-6 pb-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                        Recent Orders
                    </CardTitle>
                    {hasOrders && (
                        <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
                            {orders.length}
                        </Badge>
                    )}
                </div>
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground"
                    aria-hidden="true"
                >
                    <ShoppingBag className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0">
                {!hasOrders ? (
                    <div className="flex flex-col items-center justify-center text-center py-8 space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                            No orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="relative w-full overflow-x-auto">
                        <Table aria-label="List of recent customer orders">
                            <TableHeader>
                                <TableRow className="border-border/60 hover:bg-transparent">
                                    <TableHead className="w-30">Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                                    <TableHead className="hidden md:table-cell">Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} className="border-border/40">
                                        <TableCell className="font-medium text-foreground">
                                            {order.orderNumber}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{order.customerName}</div>
                                            <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                                                {order.date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                                            {order.date}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge
                                                variant={getStatusBadgeVariant(order.status)}
                                                className="capitalize font-semibold text-xs"
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-foreground">
                                            {order.amount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}