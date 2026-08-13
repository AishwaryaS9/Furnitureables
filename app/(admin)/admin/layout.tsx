import { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/layout/AdminNavbar";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import { getAdminUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal",
    template: "%s | Admin Portal — Furnitureables",
  },
  description: "Management dashboard for Furnitureables store administration.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already guarantees the visitor is signed in; this confirms
  // they are actually an admin account before rendering the dashboard.
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/sign-in?error=unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden lg:block h-screen sticky top-0 shrink-0" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}