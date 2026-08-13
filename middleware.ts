import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Matches every /admin route EXCEPT the admin sign-in page itself,
// so the login screen stays reachable while everything else is gated
// behind authentication.
const isProtectedAdminRoute = createRouteMatcher(['/admin((?!/sign-in).*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedAdminRoute(req)) {
        // Require a signed-in Clerk session; unauthenticated visitors are
        // redirected to the dedicated admin login page instead of the
        // default Clerk sign-in.
        await auth.protect({
            unauthenticatedUrl: new URL('/admin/sign-in', req.url).toString(),
        });
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for Clerk's auto-proxy path
        '/__clerk/:path*',
        // Always run for API routes
        '/(api|trpc)(.*)',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
