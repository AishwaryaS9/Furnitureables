import { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import AdminUnauthorized from "@/components/admin/auth/AdminUnauthorized";
import Image from "next/image";
import logo from "@/public/logo.svg";

export const metadata: Metadata = {
    title: "Admin Sign In | Furnitureables",
    description: "Sign in to access the Furnitureables admin dashboard.",
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

export default async function AdminSignInPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;

    const user = await currentUser();
    if (user && user.publicMetadata?.role === "admin") {
        redirect("/admin");
    }

    const isSignedInAsWrongAccount = Boolean(user);

    const isUnauthorized = error === "unauthorized";

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md flex flex-col items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 text-lg font-serif font-bold tracking-tight text-foreground mb-8 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    aria-label="Furnitureables Homepage"
                >
                    <Image
                        src={logo}
                        alt="Furnitureables"
                        priority
                        className="w-44 h-auto sm:w-52 md:w-52 lg:w-56 xl:w-64"
                    />
                </Link>
                <div className="flex items-center gap-2 mb-1 text-sm font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Admin Portal
                </div>
                <h1 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">
                    Sign in to continue
                </h1>

                {isSignedInAsWrongAccount ? (
                    <AdminUnauthorized email={user?.primaryEmailAddress?.emailAddress} />
                ) : (
                    <>
                        {isUnauthorized && (
                            <div
                                role="alert"
                                className="mb-6 w-full flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            >
                                <TriangleAlert className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                                <span>
                                    That account doesn&apos;t have admin access. Sign in with an authorized
                                    admin account to continue.
                                </span>
                            </div>
                        )}

                        <SignIn
                            routing="path"
                            path="/admin/sign-in"
                            fallbackRedirectUrl="/admin/sign-in?error=unauthorized"
                            appearance={{
                                elements: {
                                    rootBox: "w-full flex justify-center",
                                    card: "shadow-lg shadow-black/5 border border-border/60 rounded-2xl w-full",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "rounded-xl",
                                    formButtonPrimary:
                                        "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl",
                                    formFieldInput: "rounded-xl",
                                    footerAction: "hidden",
                                },
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}