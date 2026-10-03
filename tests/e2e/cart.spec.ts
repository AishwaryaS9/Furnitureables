import { expect, test, type Page } from "@playwright/test";
import { MOCK_PRODUCT, mockStoreApi } from "./helpers/mockStoreApi";

const goToCartButton = (page: Page) =>
    page.getByRole("button", { name: `Go to cart, ${MOCK_PRODUCT.title} added` });

async function addMockChairFromHome(page: Page) {
    await page.goto("/");

    const card = page.getByRole("article").filter({ hasText: MOCK_PRODUCT.title }).first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    await card
        .getByRole("button", { name: `Quick add ${MOCK_PRODUCT.title} to cart` })
        .click();
}

async function openCartFromCard(page: Page) {
    await goToCartButton(page).click();
    await expect(page).toHaveURL(/\/cart$/);
}

test.describe("guest cart", () => {
    test.beforeEach(async ({ page }) => {
        await mockStoreApi(page);
    });

    test("quick add puts the product in the cart", async ({ page, isMobile }) => {
        await addMockChairFromHome(page);

        await expect(goToCartButton(page)).toBeVisible();

        if (!isMobile) {
            await expect(
                page.getByRole("link", { name: "Shopping Cart, 1 items" }).first()
            ).toBeVisible();
        }
    });

    test("the cart page lists the added product", async ({ page }) => {
        await addMockChairFromHome(page);
        await openCartFromCard(page);

        await expect(page.getByRole("heading", { level: 1, name: "Your Cart" })).toBeVisible();
        await expect(
            page.getByRole("region", { name: "Shopping cart items" }).getByText(MOCK_PRODUCT.title)
        ).toBeVisible();
    });

    test("quantity can be increased, and removing the last item shows the empty cart", async ({ page }) => {
        await addMockChairFromHome(page);
        await openCartFromCard(page);

        const items = page.getByRole("region", { name: "Shopping cart items" });

        await items.getByRole("button", { name: "Increase quantity" }).click();
        await expect(items.getByLabel(/Line total: \$240 for 2 items/)).toBeVisible();

        await items.getByRole("button", { name: `Remove ${MOCK_PRODUCT.title} from cart` }).click();

        await expect(page.getByRole("region", { name: "Empty cart notification" })).toBeVisible();
    });

    test("an empty cart shows the empty state", async ({ page }) => {
        await page.goto("/cart");

        await expect(page.getByRole("region", { name: "Empty cart notification" })).toBeVisible();
    });

    test.fixme("keeps the guest cart after a full page reload", async ({ page }) => {
        await addMockChairFromHome(page);

        await page.reload();

        await expect(goToCartButton(page)).toBeVisible();
    });
});

test.describe("signed-in cart", () => {
    test.skip(
        !process.env.E2E_CLERK_EMAIL || !process.env.E2E_CLERK_PASSWORD,
        "Set E2E_CLERK_EMAIL and E2E_CLERK_PASSWORD to run signed-in tests"
    );

    test.fixme("merges the guest cart into the saved cart after signing in", async () => {
        // 1. add a product as a guest
        // 2. sign in as the test user (who already has a different product saved)
        // 3. open /cart and expect BOTH products, with quantities added together
        //    for a product that was in both carts (see tests/unit/lib/mergeCart.test.ts)
    });
});
