import { CreditCard, Truck, Landmark, LayoutDashboard, Package, Upload, ShoppingCart, Users, Star, BarChart3, Sparkles, Settings } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";
import { CustomerSort } from "@/types/customer";

export const SORT_OPTIONS = [
    { value: "all", label: "Default" },
    { value: "latest", label: "Newest Additions" },
    { value: "priceAsc", label: "Price: Low → High" },
    { value: "priceDesc", label: "Price: High → Low" },
    { value: "nameAsc", label: "Name: A → Z" },
    { value: "nameDesc", label: "Name: Z → A" },
] as const;


export const METHODS: {
    id: PaymentMethod;
    title: string;
    description: string;
    icon: typeof Truck;
    badge?: string;
}[] = [
        {
            id: "COD",
            title: "Cash on Delivery",
            description: "Pay with cash or UPI when your architectural piece arrives.",
            icon: Truck,
        },
        {
            id: "RAZORPAY",
            title: "Razorpay Gateway",
            description: "Instant UPI, NetBanking, Debit/Credit Cards & Wallets (India)",
            icon: Landmark,
            badge: "Recommended in IN",
        },
        {
            id: "STRIPE",
            title: "Stripe Secure Cards",
            description: "International Credit / Debit Cards & Express Checkout",
            icon: CreditCard,
            badge: "Global",
        },
    ];

export const menuItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Bulk Upload",
        href: "/admin/upload",
        icon: Upload,
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
];


export const CUSTOMER_SORT_OPTIONS: { value: CustomerSort; label: string }[] = [
    { value: "newest", label: "Newest customers" },
    { value: "oldest", label: "Oldest customers" },
    { value: "most-orders", label: "Most orders" },
    { value: "highest-spend", label: "Highest spend" },
];

export const REVIEW_STATUS_OPTIONS = [
    { value: "ALL", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
];
