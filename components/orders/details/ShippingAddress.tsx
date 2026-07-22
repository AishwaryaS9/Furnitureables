import { MapPin, Phone, User } from "lucide-react";
import { Order } from "@/types/order";

interface Props {
    order: Order;
}

export default function ShippingAddress({
    order,
}: Props) {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-5 text-lg font-semibold">
                Shipping Address
            </h2>

            <div className="space-y-5">
                <div className="flex gap-3">
                    <User className="mt-0.5 h-5 w-5 text-muted-foreground" />

                    <div>
                        <p className="font-medium">
                            {order.fullName}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />

                    <div>
                        <p>{order.phone}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />

                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{order.addressLine1}</p>

                        {order.addressLine2 && (
                            <p>{order.addressLine2}</p>
                        )}

                        <p>
                            {order.city}, {order.state}
                        </p>

                        <p>{order.postalCode}</p>

                        <p>{order.country}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}