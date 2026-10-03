import { expect, test } from "@playwright/test";
import { mockStoreApi } from "./helpers/mockStoreApi";

test.describe("home page", () => {
    test.beforeEach(async ({ page }) => {
        await mockStoreApi(page);
    });

    test("has a single main landmark", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator("main")).toHaveCount(1);
        await expect(page.locator("#main-content")).toHaveCount(1);
    });

    test("shows the hero heading and calls to action", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByRole("heading", { level: 1 })).toContainText("Elevate Your");
        await expect(page.getByRole("link", { name: /explore the full furniture collection/i })).toBeVisible();
        await expect(page.getByRole("link", { name: /design ethos/i })).toBeVisible();
    });

    test("'Explore Collection' opens the products page", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: /explore the full furniture collection/i }).click();

        await expect(page).toHaveURL(/\/products$/);
    });

    test("lists the categories returned by the API and links to the filtered catalog", async ({ page }) => {
        await page.goto("/");

        const list = page.getByRole("list", { name: /product categories catalog/i });
        await expect(list).toBeVisible();
        await expect(list.getByRole("link")).toHaveCount(2);

        await list.getByRole("link", { name: /coffee table/i }).click();

        await expect(page).toHaveURL(/\/products\?category=coffee-table/);
    });

    test("shows the featured products", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByText("Mock Oak Chair").first()).toBeVisible();
    });

    test("loads without hydration or runtime errors", async ({ page }) => {
        const problems: string[] = [];

        page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
        page.on("console", (message) => {
            if (message.type() === "error") problems.push(`console: ${message.text()}`);
        });

        await page.goto("/");
        await expect(page.getByRole("list", { name: /product categories catalog/i })).toBeVisible();
        await page.waitForLoadState("networkidle");

        const hydration = problems.filter((p) =>
            /hydrat|Minified React error #(418|423|425)/i.test(p)
        );

        expect(hydration, hydration.join("\n")).toEqual([]);
    });

    test("does not download the Razorpay script", async ({ page }) => {
        const razorpayRequests: string[] = [];

        page.on("request", (request) => {
            if (request.url().includes("razorpay.com")) razorpayRequests.push(request.url());
        });

        await page.goto("/");
        await page.waitForLoadState("networkidle");

        expect(razorpayRequests).toEqual([]);
    });
});

test.describe("home page before hydration", () => {
    test("shows the hero heading before any JS bundle has run", async ({ page }) => {
        await page.route("**/*", (route) =>
            route.request().resourceType() === "script" ? route.abort() : route.continue()
        );

        await page.goto("/");

        const heading = page.getByRole("heading", { level: 1 });

        await expect(heading).toBeVisible();
        await expect(heading).toContainText("Elevate Your");
    });
});
