// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

const push = vi.fn();
const addToCart = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/useAddToCart", () => ({ useAddToCart: () => addToCart }));

vi.mock("next/image", () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

vi.mock("@/components/wishlist/WishlistButton", () => ({
    default: ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }) => (
        <button data-testid="wishlist" data-product-id={productId} data-wishlisted={String(isWishlisted)}>
            wishlist
        </button>
    ),
}));

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    id: "p1",
    title: "Oak Chair",
    description: null,
    price: 1200,
    stock: 5,
    sku: "OAK-1",
    media: [{ id: "m1", url: "/chair.webp", type: "IMAGE", altText: null, sortOrder: 0 }],
    type: "chair",
    material: "Oak",
    color: "Natural",
    room: "Dining",
    dimensions: "40x40x90",
    isWishlisted: false,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
    ...overrides,
});

const inCart = (product: Product) =>
    useCartStore.setState({ items: [{ id: product.id, title: product.title, price: product.price, quantity: 1 }] });

beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({ items: [], cartReady: false, syncedUserId: null });
});

describe("ProductCard", () => {
    describe("details", () => {
        it("shows the title as a link to the product page", () => {
            render(<ProductCard product={makeProduct()} />);

            expect(screen.getByRole("link", { name: "Oak Chair" })).toHaveAttribute("href", "/products/p1");
        });

        it("has a separate 'view details' link for screen readers", () => {
            render(<ProductCard product={makeProduct()} />);

            expect(screen.getByRole("link", { name: "View details for Oak Chair" })).toHaveAttribute(
                "href",
                "/products/p1"
            );
        });

        it("shows the price in rupees", () => {
            render(<ProductCard product={makeProduct({ price: 123456 })} />);

            expect(screen.getByLabelText("Price: ₹1,23,456")).toHaveTextContent("₹1,23,456");
        });

        it("shows the material and the colour", () => {
            render(<ProductCard product={makeProduct()} />);

            expect(screen.getByText("Oak")).toBeInTheDocument();
            expect(screen.getByRole("group", { name: "Available color: Natural" })).toBeInTheDocument();
        });

        it("leaves out the material and colour when the product has none", () => {
            render(<ProductCard product={makeProduct({ material: "", color: "" })} />);

            expect(screen.queryByRole("group", { name: /Available color/ })).not.toBeInTheDocument();
        });

        it("passes the product id and wishlist state to the wishlist button", () => {
            render(<ProductCard product={makeProduct({ isWishlisted: true })} />);

            const button = screen.getByTestId("wishlist");
            expect(button).toHaveAttribute("data-product-id", "p1");
            expect(button).toHaveAttribute("data-wishlisted", "true");
        });
    });

    describe("image", () => {
        it("uses the first image and describes it with title, material and colour", () => {
            render(<ProductCard product={makeProduct()} />);

            const image = screen.getByAltText("Oak Chair, Oak, Natural");
            expect(image).toHaveAttribute("src", "/chair.webp");
        });

        it("skips missing parts in the description", () => {
            render(<ProductCard product={makeProduct({ material: "", color: "" })} />);

            expect(screen.getByAltText("Oak Chair")).toBeInTheDocument();
        });

        it("ignores videos and uses the first image", () => {
            const media = [
                { id: "v", url: "/clip.mp4", type: "VIDEO" as const, altText: null, sortOrder: 0 },
                { id: "i", url: "/photo.webp", type: "IMAGE" as const, altText: null, sortOrder: 1 },
            ];
            render(<ProductCard product={makeProduct({ media })} />);

            expect(screen.getByAltText("Oak Chair, Oak, Natural")).toHaveAttribute("src", "/photo.webp");
        });

        it("falls back to the placeholder when there is no image", () => {
            render(<ProductCard product={makeProduct({ media: [] })} />);

            expect(screen.getByAltText("Oak Chair, Oak, Natural")).toHaveAttribute("src", "/images/placeholder.webp");
        });
    });

    describe("badges", () => {
        it("shows 'New Arrival' for a product added in the last 7 days", () => {
            render(<ProductCard product={makeProduct({ createdAt: daysAgo(2) })} />);

            expect(screen.getByRole("status")).toHaveTextContent("New Arrival");
        });

        it("accepts a Date as well as a string", () => {
            render(<ProductCard product={makeProduct({ createdAt: new Date() })} />);

            expect(screen.getByRole("status")).toHaveTextContent("New Arrival");
        });

        it.each([
            ["older than 7 days", daysAgo(8)],
            ["not a valid date", "not-a-date"],
            ["in the future", new Date(Date.now() + 3 * DAY).toISOString()],
        ])("has no badge when the date is %s", (_label, createdAt) => {
            render(<ProductCard product={makeProduct({ createdAt })} />);

            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });

        it("has no badge when the date is missing", () => {
            render(<ProductCard product={makeProduct({ createdAt: "" })} />);

            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });

        it("shows 'Out of Stock' instead of 'New Arrival' for a new product with no stock", () => {
            render(<ProductCard product={makeProduct({ createdAt: daysAgo(1), stock: 0 })} />);

            expect(screen.getByRole("status")).toHaveTextContent("Out of Stock");
            expect(screen.queryByText("New Arrival")).not.toBeInTheDocument();
        });
    });

    describe("quick add", () => {
        it("adds the product to the cart", async () => {
            const product = makeProduct();
            render(<ProductCard product={product} />);

            await userEvent.click(screen.getByRole("button", { name: "Quick add Oak Chair to cart" }));

            expect(addToCart).toHaveBeenCalledTimes(1);
            expect(addToCart).toHaveBeenCalledWith(product);
            expect(push).not.toHaveBeenCalled();
        });

        it("does not follow the product link when the button is clicked", async () => {
            render(<ProductCard product={makeProduct()} />);

            await userEvent.click(screen.getByRole("button", { name: "Quick add Oak Chair to cart" }));

            expect(push).not.toHaveBeenCalledWith("/products/p1");
        });

        it("becomes 'Go to cart' once the product is in the cart", () => {
            const product = makeProduct();
            inCart(product);
            render(<ProductCard product={product} />);

            expect(screen.getByRole("button", { name: "Go to cart, Oak Chair added" })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /Quick add/ })).not.toBeInTheDocument();
        });

        it("opens the cart instead of adding the product again", async () => {
            const product = makeProduct();
            inCart(product);
            render(<ProductCard product={product} />);

            await userEvent.click(screen.getByRole("button", { name: "Go to cart, Oak Chair added" }));

            expect(push).toHaveBeenCalledWith("/cart");
            expect(addToCart).not.toHaveBeenCalled();
        });

        it("is not offered when the product is out of stock", () => {
            render(<ProductCard product={makeProduct({ stock: 0 })} />);

            expect(screen.queryByRole("button", { name: /Quick add|Go to cart/ })).not.toBeInTheDocument();
        });
    });

    describe("opening the product", () => {
        it("goes to the product page on a normal click", async () => {
            render(<ProductCard product={makeProduct()} />);

            await userEvent.click(screen.getByRole("link", { name: "Oak Chair" }));

            expect(push).toHaveBeenCalledWith("/products/p1");
        });

        it.each([["ctrlKey"], ["metaKey"], ["shiftKey"], ["altKey"]])(
            "leaves the browser to handle %s-click (open in a new tab or window)",
            (modifier) => {
                render(<ProductCard product={makeProduct()} />);

                fireEvent.click(screen.getByRole("link", { name: "Oak Chair" }), { [modifier]: true });

                expect(push).not.toHaveBeenCalled();
            }
        );

        it("leaves a middle-click to the browser", () => {
            render(<ProductCard product={makeProduct()} />);

            fireEvent.click(screen.getByRole("link", { name: "Oak Chair" }), { button: 1 });

            expect(push).not.toHaveBeenCalled();
        });
    });

    describe("structured data (schema.org)", () => {
        const meta = (container: HTMLElement, prop: string) =>
            container.querySelector(`[itemprop="${prop}"]`);

        it("describes the product, its price and its availability", () => {
            const { container } = render(<ProductCard product={makeProduct()} />);

            expect(meta(container, "name")).toHaveAttribute("content", "Oak Chair");
            expect(meta(container, "price")).toHaveAttribute("content", "1200");
            expect(meta(container, "availability")).toHaveAttribute("href", "https://schema.org/InStock");
        });

        it("says OutOfStock when there is no stock", () => {
            const { container } = render(<ProductCard product={makeProduct({ stock: 0 })} />);

            expect(meta(container, "availability")).toHaveAttribute("href", "https://schema.org/OutOfStock");
        });

        it.todo("reports the price currency as INR (currently hard-coded to USD)");
    });
});
