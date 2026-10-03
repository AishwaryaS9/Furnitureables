import type { Page } from "@playwright/test";

export const MOCK_CATEGORIES = [
    { type: "coffee-table", count: 4, image: "/images/placeholder.webp" },
    { type: "sofa", count: 1, image: "/images/placeholder.webp" },
];

export const MOCK_PRODUCT = {
    id: "mock-chair-1",
    title: "Mock Oak Chair",
    price: 120,
    type: "chair",
    material: "Oak",
    color: "Natural",
    createdAt: "2020-01-01T00:00:00.000Z",
    isWishlisted: false,
    stock: 10,
    media: [
        {
            id: "m1",
            url: "/images/placeholder.webp",
            type: "IMAGE",
            altText: null,
            sortOrder: 0,
        },
    ],
};

export async function mockStoreApi(page: Page) {
    await page.route("**/api/graphql", async (route) => {
        const request = route.request();

        if (request.method() !== "POST") return route.continue();

        const body = request.postDataJSON() as { query?: string; operationName?: string };
        const operation =
            body.operationName ?? body.query?.match(/(?:query|mutation)\s+(\w+)/)?.[1];

        const respond = (data: unknown) =>
            route.fulfill({ json: { data } });

        switch (operation) {
            case "GetProductCategories":
                return respond({ productCategories: MOCK_CATEGORIES });
            case "GetProducts":
                return respond({ products: { total: 1, items: [MOCK_PRODUCT] } });
            case "ActivePromotion":
                return respond({ activePromotion: null });
            default:
                return route.continue();
        }
    });
}
