// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShopByCategory from "@/components/product/ShopByCategory";

const useProductCategories = vi.fn();

vi.mock("@/hooks/useProductCategories", () => ({
    useProductCategories: (...args: unknown[]) => useProductCategories(...args),
}));

vi.mock("next/image", () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

const categories = [
    { type: "coffee-table", count: 4, image: "/images/a.webp" },
    { type: "sofa", count: 1, image: null },
];

beforeEach(() => {
    useProductCategories.mockReset();
});

describe("ShopByCategory", () => {
    it("shows a loading skeleton while categories are loading", () => {
        useProductCategories.mockReturnValue({ data: undefined, isLoading: true });

        render(<ShopByCategory />);

        expect(screen.getByRole("status", { name: /loading product categories/i })).toBeInTheDocument();
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("always shows the section heading", () => {
        useProductCategories.mockReturnValue({ data: undefined, isLoading: true });

        render(<ShopByCategory />);

        expect(screen.getByRole("heading", { name: /shop by categories/i })).toBeInTheDocument();
    });

    it("renders one link per category, pointing at the filtered catalog", () => {
        useProductCategories.mockReturnValue({ data: categories, isLoading: false });

        render(<ShopByCategory />);

        const list = screen.getByRole("list", { name: /product categories catalog/i });
        const links = within(list).getAllByRole("link");

        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/products?category=coffee-table");
        expect(links[1]).toHaveAttribute("href", "/products?category=sofa");
    });

    it("formats labels and pluralizes the item count", () => {
        useProductCategories.mockReturnValue({ data: categories, isLoading: false });

        render(<ShopByCategory />);

        expect(screen.getByRole("heading", { name: "Coffee Table" })).toBeInTheDocument();
        expect(screen.getByText("4 items available")).toBeInTheDocument();
        expect(screen.getByText("1 item available")).toBeInTheDocument();
    });

    it("falls back to the placeholder image when a category has none", () => {
        useProductCategories.mockReturnValue({ data: categories, isLoading: false });

        render(<ShopByCategory />);

        const sofaImage = screen.getByAltText(/sofa interior furniture collection/i);
        expect(sofaImage).toHaveAttribute("src", "/images/placeholder.webp");
    });

    it("renders nothing when loading has finished and there are no categories", () => {
        useProductCategories.mockReturnValue({ data: [], isLoading: false });

        const { container } = render(<ShopByCategory />);

        expect(container).toBeEmptyDOMElement();
    });
});
