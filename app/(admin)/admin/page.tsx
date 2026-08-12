import { Metadata } from "next";
import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import LowStockProducts from "@/components/admin/dashboard/LowStockProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import SalesChart from "@/components/admin/dashboard/SalesChart";

export const metadata: Metadata = {
    title: "Dashboard Overview | Admin Portal — Furnitureables",
    description:
        "View store performance metrics, revenue charts, low-stock inventory alerts, and recent orders.",
};

export default function AdminDashboard() {
    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Page Context Header */}
            <header className="space-y-1 sm:space-y-2">
                <div className="space-y-2 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-foreground truncate gap-2.5 py-1">
                        Dashboard
                    </h1>
                    <p
                        role="status"
                        aria-live="polite"
                        className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed"
                    >
                        Welcome to the Furnitureables Admin Dashboard.
                    </p>
                </div>
            </header>

            {/* Primary KPI Metrics */}
            <section aria-label="Key Performance Metrics">
                <DashboardCards />
            </section>

            {/* Analytics and Inventory Alerts Grid */}
            <section
                aria-label="Sales Performance and Inventory Alerts"
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
            >
                <div className="lg:col-span-2 min-w-0">
                    <SalesChart />
                </div>

                <div className="min-w-0">
                    <LowStockProducts />
                </div>
            </section>

            {/* Recent Activity Section */}
            <section aria-label="Recent Customer Orders">
                <RecentOrders />
            </section>
        </div>
    );
}