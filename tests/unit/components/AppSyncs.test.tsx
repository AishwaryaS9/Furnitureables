// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppSyncs from "@/components/common/AppSyncs";
import { useCartStore } from "@/store/cart";

// ---- mocks -----------------------------------------------------------
const clerk = { user: null as { id: string } | null, isLoaded: false };

vi.mock("@clerk/nextjs", () => ({
    useUser: () => clerk,
}));

const useCartSync = vi.fn();
const useCartLiveSync = vi.fn();
const useWishlistSync = vi.fn();

vi.mock("@/hooks/useCartSync", () => ({ useCartSync: (...a: unknown[]) => useCartSync(...a) }));
vi.mock("@/hooks/useCartLiveSync", () => ({ useCartLiveSync: (...a: unknown[]) => useCartLiveSync(...a) }));
vi.mock("@/hooks/useWishlistSync", () => ({ useWishlistSync: (...a: unknown[]) => useWishlistSync(...a) }));

// ---- helpers ---------------------------------------------------------
function setup() {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    const tree = () => (
        <QueryClientProvider client={queryClient}>
            <AppSyncs />
        </QueryClientProvider>
    );

    const view = render(tree());
    const rerender = () => view.rerender(tree());

    return { invalidate, rerender };
}

const promotionCalls = (invalidate: { mock: { calls: unknown[][] } }) =>
    invalidate.mock.calls.filter(
        ([filters]) =>
            JSON.stringify((filters as { queryKey?: unknown } | undefined)?.queryKey) ===
            '["activePromotion"]'
    );

beforeEach(() => {
    clerk.user = null;
    clerk.isLoaded = false;
    useCartSync.mockReset();
    useCartLiveSync.mockReset();
    useWishlistSync.mockReset();
    useCartStore.setState({
        items: [{ id: "a", title: "A", price: 1, quantity: 1 }],
        cartReady: false,
        syncedUserId: null,
    });
});

describe("AppSyncs", () => {
    it("renders nothing", () => {
        const { invalidate } = setup();
        expect(invalidate).not.toHaveBeenCalled();
    });

    it("passes the Clerk user id to the three sync hooks", () => {
        clerk.user = { id: "user_1" };
        clerk.isLoaded = true;

        setup();

        expect(useCartSync).toHaveBeenCalledWith("user_1");
        expect(useCartLiveSync).toHaveBeenCalledWith("user_1");
        expect(useWishlistSync).toHaveBeenCalledWith("user_1", true);
    });

    it("passes null while signed out", () => {
        clerk.isLoaded = true;

        setup();

        expect(useCartSync).toHaveBeenCalledWith(null);
        expect(useWishlistSync).toHaveBeenCalledWith(null, true);
    });

    describe("logout reset", () => {
        it("empties the cart when Clerk has loaded and nobody is signed in", () => {
            clerk.isLoaded = true;

            setup();

            expect(useCartStore.getState().items).toEqual([]);
            expect(useCartStore.getState().cartReady).toBe(true);
        });

        it("does not touch the cart before Clerk has loaded", () => {
            clerk.isLoaded = false;

            setup();

            expect(useCartStore.getState().items).toHaveLength(1);
        });

        it("keeps the cart when a user is signed in", () => {
            clerk.user = { id: "user_1" };
            clerk.isLoaded = true;

            setup();

            expect(useCartStore.getState().items).toHaveLength(1);
        });
    });

    describe("active promotion refresh", () => {
        it("does not refetch on the first load (the navbar already fetched it)", () => {
            clerk.user = { id: "user_1" };
            clerk.isLoaded = true;

            const { invalidate } = setup();

            expect(promotionCalls(invalidate)).toHaveLength(0);
        });

        it("does not refetch while Clerk is still loading", () => {
            const { invalidate, rerender } = setup();
            rerender();

            expect(promotionCalls(invalidate)).toHaveLength(0);
        });

        it("refetches once when the user signs in", () => {
            clerk.isLoaded = true;
            const { invalidate, rerender } = setup();

            clerk.user = { id: "user_1" };
            rerender();

            expect(promotionCalls(invalidate)).toHaveLength(1);
        });

        it("refetches once when the user signs out", () => {
            clerk.user = { id: "user_1" };
            clerk.isLoaded = true;
            const { invalidate, rerender } = setup();

            clerk.user = null;
            rerender();

            expect(promotionCalls(invalidate)).toHaveLength(1);
        });

        it("does not refetch again on re-renders with the same user", () => {
            clerk.user = { id: "user_1" };
            clerk.isLoaded = true;
            const { invalidate, rerender } = setup();

            rerender();
            rerender();

            expect(promotionCalls(invalidate)).toHaveLength(0);
        });
    });
});
