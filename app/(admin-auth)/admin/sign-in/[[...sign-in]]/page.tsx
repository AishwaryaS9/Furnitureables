import { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import AdminUnauthorized from "@/components/admin/auth/AdminUnauthorized";

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

    // If someone who's already an authenticated admin lands here, skip
    // straight to the dashboard instead of showing the login form again.
    const user = await currentUser();
    if (user && user.publicMetadata?.role === "admin") {
        redirect("/admin");
    }

    // A session exists but it's not an admin account. Clerk's <SignIn />
    // component auto-redirects to fallbackRedirectUrl whenever it detects an
    // active session — regardless of role — which would bounce this user
    // straight back to /admin, get rejected by the layout, land back here,
    // and repeat forever. So for this case we skip <SignIn /> entirely and
    // ask them to sign out first.
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-sans font-bold shadow-sm shadow-primary/20">
                        F
                    </span>
                    <span className="text-foreground">
                        Furniture<span className="font-sans text-muted-foreground font-normal">ables</span>
                    </span>
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
                            fallbackRedirectUrl="/admin"
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
                                    // Admin accounts are provisioned manually (Clerk Dashboard),
                                    // not via public self sign-up.
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