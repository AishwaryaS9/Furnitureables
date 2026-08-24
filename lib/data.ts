import { CreditCard, Truck, Landmark, LayoutDashboard, Package, Upload, ShoppingCart, Users, Star, BarChart3, Sparkles, Ship, Hammer, TreePine, Award, ShieldCheck, Compass, TicketPercent, Bell } from "lucide-react";
import { PaymentMethod } from "@/generated/prisma";
import { CustomerSort } from "@/types/customer";
import { AboutProcessStep, AboutStat, AboutTestimonial, AboutValue } from "@/types/about";
import { CookieCategoryMeta } from "@/types/legal";

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
        title: "Coupons",
        href: "/admin/coupons",
        icon: TicketPercent,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
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

export const CONTACT_TRUST_STATS = [
    { label: "Avg. response time", value: "< 24 hrs", ariaLabel: "Average response time less than 24 hours" },
    { label: "Support rating", value: "4.9 / 5", ariaLabel: "Support rating 4.9 out of 5" },
    { label: "Orders shipped", value: "100+", ariaLabel: "Over 100 orders shipped" },
    { label: "Craft studio", value: "Udupi, Karnataka", ariaLabel: "Craft studio located in Udupi, Karnataka" },
] as const;

export const CONTACT_QUICK_TOPICS = [
    { label: "Track an order", href: "/orders", ariaLabel: "Navigate to order tracking page" },
    { label: "Shipping & returns", href: "/about", ariaLabel: "Learn more about our shipping and returns policy" },
    { label: "Custom furniture quote", href: "/contact", ariaLabel: "Request a custom solid wood furniture quote" },
    { label: "Browse the catalog", href: "/products", ariaLabel: "Browse the architectural furniture catalog" },
] as const;

export const ABOUT_VALUES: AboutValue[] = [
    {
        icon: TreePine,
        title: "Sustainably Harvested",
        description:
            "We source 100% of our timber from responsibly managed FSC-certified forests, ensuring zero deforestation.",
    },
    {
        icon: Compass,
        title: "Architectural Precision",
        description:
            "Every joint and grain alignment is calculated by master artisans to blur the line between furniture and structural art.",
    },
    {
        icon: ShieldCheck,
        title: "Built for Generations",
        description:
            "We reject throwaway culture. Our solid hardwood pieces are finished with non-toxic oils made to endure decades of daily living.",
    },
    {
        icon: Award,
        title: "Fair Artisanship",
        description:
            "We partner directly with woodworkers and craft communities, guaranteeing living wages and safe working environments.",
    },
];

export const ABOUT_PROCESS: AboutProcessStep[] = [
    {
        icon: TreePine,
        step: "01",
        title: "Sourcing",
        description:
            "Solid oak, walnut, and teak selected from FSC-certified forests for grain character.",
    },
    {
        icon: Hammer,
        step: "02",
        title: "Joinery",
        description:
            "Master artisans hand-cut mortise-and-tenon joints for structural integrity, no shortcuts.",
    },
    {
        icon: Sparkles,
        step: "03",
        title: "Finishing",
        description:
            "Non-toxic, food-safe oils applied in layers to protect the timber for decades of use.",
    },
    {
        icon: Ship,
        step: "04",
        title: "Delivery",
        description:
            "White-glove packaging and shipping so every piece arrives exactly as it left the studio.",
    },
];

export const ABOUT_STATS: AboutStat[] = [
    {
        value: "1K+",
        label: "Homes Furnished",
        ariaLabel: "Over 1,000 homes furnished",
    },
    {
        value: "100%",
        label: "FSC Hardwood",
        ariaLabel: "100 percent FSC certified hardwood",
    },
    {
        value: "10 Yr",
        label: "Structural Warranty",
        ariaLabel: "10 year structural warranty",
    },
    {
        value: "4.8★",
        label: "Average Rating",
        ariaLabel: "4.8 out of 5 stars average customer rating",
    },
];

export const ABOUT_TESTIMONIALS: AboutTestimonial[] = [
    {
        quote:
            "The dining table still looks brand new three years in. You can feel the difference in how it's made.",
        name: "Priya N.",
        role: "Verified Buyer",
    },
    {
        quote:
            "Ordered a custom bookshelf and the joinery work is honestly gallery quality. Worth every rupee.",
        name: "Rohan K.",
        role: "Verified Buyer",
    },
    {
        quote:
            "Customer support walked me through wood options over a call before I committed. Rare these days.",
        name: "Meera S.",
        role: "Verified Buyer",
    },
];

export const COOKIE_CATEGORIES: CookieCategoryMeta[] = [
    {
        id: "functional",
        title: "Functional Cookies",
        description:
            "Remember preferences like currency, recently viewed products, and wishlist items across visits.",
    },
    {
        id: "analytics",
        title: "Analytics Cookies",
        description:
            "Help us understand which pages and products are popular so we can improve the shopping experience.",
    },
    {
        id: "marketing",
        title: "Marketing Cookies",
        description:
            "Used to show relevant promotions and measure the performance of our campaigns across other sites.",
    },
];


import { FaqCategory } from "@/types/faq";

export const FAQ_CATEGORIES: FaqCategory[] = [
    {
        id: "orders-shipping",
        title: "Orders & Shipping",
        items: [
            {
                question: "How long does an order take to arrive?",
                answer:
                    "In-stock pieces typically ship within 3–5 business days and arrive within 1–2 weeks depending on your location. Custom or made-to-order pieces have longer production timelines, which we'll share with you at the time of purchase.",
            },
            {
                question: "Do you ship internationally?",
                answer:
                    "We currently ship across India with select international shipping available on request. Reach out through our Contact page with your location and we'll confirm availability and costs.",
            },
            {
                question: "Can I track my order?",
                answer:
                    "Yes — once your order ships, you'll receive a tracking link by email. You can also view order status anytime from your Orders page after signing in.",
            },
            {
                question: "Can I change or cancel my order after placing it?",
                answer:
                    "We begin processing orders quickly, so changes or cancellations are only possible within a short window after checkout. Contact us as soon as possible and we'll do our best to accommodate the request.",
            },
        ],
    },
    {
        id: "products-materials",
        title: "Products & Materials",
        items: [
            {
                question: "What wood do you use?",
                answer:
                    "We work primarily with solid oak, walnut, and teak, all sourced from FSC-certified, responsibly managed forests. Each product page lists the specific material and finish used for that piece.",
            },
            {
                question: "Do you offer custom dimensions or finishes?",
                answer:
                    "Yes — many of our pieces can be customized in size, wood tone, or finish. Send us your requirements through the Contact page and our team will follow up with options and a quote.",
            },
            {
                question: "How do I care for solid wood furniture?",
                answer:
                    "Wipe with a soft, dry cloth and avoid direct sunlight or excess moisture. We recommend re-oiling exposed wood surfaces every 12–18 months to maintain the finish — care instructions are included with every delivery.",
            },
            {
                question: "Are your finishes safe for households with children or pets?",
                answer:
                    "Yes, all our finishing oils are non-toxic and food-safe once fully cured, typically within 7 days of application.",
            },
        ],
    },
    {
        id: "returns-warranty",
        title: "Returns & Warranty",
        items: [
            {
                question: "What is your return policy?",
                answer:
                    "Most items can be returned within 30 days of delivery in original, unused condition. Custom-built pieces are generally non-returnable unless there's a manufacturing defect. Full details are on our Terms of Service page.",
            },
            {
                question: "What does the structural warranty cover?",
                answer:
                    "Our furniture carries a 10-year warranty against structural and manufacturing defects under normal household use. It doesn't cover normal wear, accidental damage, or improper care.",
            },
            {
                question: "How do I start a return or warranty claim?",
                answer:
                    "Contact our team with your order number and a short description (plus photos, if relevant). We'll guide you through the next steps and, if approved, arrange pickup or a repair.",
            },
            {
                question: "Who pays for return shipping?",
                answer:
                    "If the return is due to a defect or our error, we cover return shipping. For other eligible returns, standard return shipping costs apply and will be shared before you send anything back.",
            },
        ],
    },
    {
        id: "account-payments",
        title: "Account & Payments",
        items: [
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept major credit/debit cards, UPI, and other methods supported through our payment partners (Stripe and Razorpay) at checkout.",
            },
            {
                question: "Is it safe to save my payment details?",
                answer:
                    "Yes — payments are processed securely by Stripe and Razorpay. We never store your full card details on our own servers.",
            },
            {
                question: "Do I need an account to place an order?",
                answer:
                    "You can browse the catalog without an account, but you'll need to sign in to check out, track orders, and access your wishlist.",
            },
            {
                question: "How do I delete my account or data?",
                answer:
                    "Contact us and we'll process your request in line with our Privacy Policy. We'll confirm once your account and associated data have been removed.",
            },
        ],
    },
];

