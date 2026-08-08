import { MapPin, Phone, User } from "lucide-react";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    order: Order;
}

export default function ShippingAddress({ order }: Props) {
    return (
        <>
            {/* Schema.org PostalAddress structured JSON-LD data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "PostalAddress",
                        "name": order.fullName,
                        "streetAddress": `${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ""}`,
                        "addressLocality": order.city,
                        "addressRegion": order.state,
                        "postalCode": order.postalCode,
                        "addressCountry": order.country,
                        "telephone": order.phone,
                    }),
                }}
            />

            <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
                <CardHeader className="border-b border-border/40 pb-4">
                    <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                        Shipping Destination
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 space-y-4">
                    {/* Recipient Name */}
                    <div className="flex items-start gap-3">
                        <User
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                                Recipient
                            </span>
                            <p className="text-sm font-semibold text-foreground">
                                {order.fullName}
                            </p>
                        </div>
                    </div>

                    {/* Contact Phone */}
                    <div className="flex items-start gap-3 pt-2 border-t border-border/20">
                        <Phone
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                                Contact
                            </span>
                            <p className="text-sm text-foreground font-mono">
                                {order.phone}
                            </p>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex items-start gap-3 pt-2 border-t border-border/20">
                        <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
                            aria-hidden="true"
                        />
                        <div className="space-y-0.5 leading-relaxed text-xs sm:text-sm text-muted-foreground">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                                Address
                            </span>
                            <p className="font-medium text-foreground">{order.addressLine1}</p>
                            {order.addressLine2 && <p>{order.addressLine2}</p>}
                            <p>
                                {order.city}, {order.state} — <span className="font-mono">{order.postalCode}</span>
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 pt-0.5">
                                {order.country}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}