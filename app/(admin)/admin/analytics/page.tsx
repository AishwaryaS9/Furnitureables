import { Metadata } from "next";
import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import RevenueTrendChart from "@/components/admin/analytics/RevenueTrendChart";
import CustomerGrowthChart from "@/components/admin/analytics/CustomerGrowthChart";
import PaymentMethodChart from "@/components/admin/analytics/PaymentMethodChart";
import CategoryPerformanceChart from "@/components/admin/analytics/CategoryPerformanceChart";
import RatingDistributionChart from "@/components/admin/analytics/RatingDistributionChart";
import OrderFunnelChart from "@/components/admin/analytics/OrderFunnelChart";
import OrderStatusChart from "@/components/admin/analytics/OrderStatusChart";
import TopProductsChart from "@/components/admin/analytics/TopProductsChart";
import StockVsSalesChart from "@/components/admin/analytics/StockVsSalesChart";
import RevenueByCategoryChart from "@/components/admin/analytics/RevenueByCategoryChart";

export const metadata: Metadata = {
    title: "Analytics | Admin Portal — Furnitureables",
    description:
        "Deep-dive store analytics: revenue trends, customer growth, order status, top products, and category performance.",
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Page Context Header */}
            <header className="space-y-1 sm:space-y-2">
                <div className="space-y-2 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1">
                        Analytics
                    </h1>
                    <p
                        role="status"
                        aria-live="polite"
                        className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                    >
                        A closer look at revenue, customers, products, and order fulfillment across the store.
                    </p>
                </div>
            </header>

            {/* Primary KPI Metrics */}
            <section aria-label="Key Performance Metrics">
                <DashboardCards />
            </section>

            {/* Revenue & Growth */}
            <section
                aria-label="Revenue and Customer Growth"
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
            >
                <div className="lg:col-span-2 min-w-0">
                    <RevenueTrendChart />
                </div>
                <div className="min-w-0">
                    <CustomerGrowthChart />
                </div>
            </section>

            {/* Orders */}
            <section
                aria-label="Order Status and Fulfillment"
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
            >
                <div className="min-w-0">
                    <OrderStatusChart />
                </div>
                <div className="min-w-0">
                    <PaymentMethodChart />
                </div>
                <div className="min-w-0">
                    <OrderFunnelChart />
                </div>
            </section>

            {/* Products & Categories */}
            <section
                aria-label="Product and Category Performance"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start"
            >
                <div className="min-w-0">
                    <TopProductsChart />
                </div>
                <div className="min-w-0">
                    <CategoryPerformanceChart />
                </div>
            </section>

            <section
                aria-label="Inventory and Revenue Mix"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start"
            >
                <div className="min-w-0">
                    <StockVsSalesChart />
                </div>
                <div className="min-w-0">
                    <RevenueByCategoryChart />
                </div>
            </section>

            {/* Reviews */}
            <section aria-label="Review Ratings">
                <RatingDistributionChart />
            </section>
        </div>
    );
}
