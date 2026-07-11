import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₹0",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "0",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
  },
  {
    title: "Customers",
    value: "0",
    icon: Users,
  },
];

export default function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-zinc-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>
              </div>

              <div className="bg-zinc-100 p-3 rounded-xl">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}