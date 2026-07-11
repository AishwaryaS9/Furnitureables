import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import LowStockProducts from "@/components/admin/dashboard/LowStockProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import SalesChart from "@/components/admin/dashboard/SalesChart";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-zinc-500 mt-2">
                    Welcome to the Furnitureables Admin Dashboard.
                </p>
            </div>

            <DashboardCards />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart />
                </div>

                <LowStockProducts />
            </div>

            <RecentOrders />
        </div>
    );
}