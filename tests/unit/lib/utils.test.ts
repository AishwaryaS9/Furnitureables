import { describe, expect, it } from "vitest";
import { formatCategoryLabel } from "@/lib/utils";

describe("formatCategoryLabel", () => {
    it("capitalizes a single word", () => {
        expect(formatCategoryLabel("sofa")).toBe("Sofa");
    });

    it("replaces hyphens and underscores with spaces", () => {
        expect(formatCategoryLabel("coffee-table")).toBe("Coffee Table");
        expect(formatCategoryLabel("dining_table")).toBe("Dining Table");
    });

    it("lowercases the rest of each word", () => {
        expect(formatCategoryLabel("BOOKshelf")).toBe("Bookshelf");
    });

    it("keeps long all-caps words (acronyms) as they are", () => {
        expect(formatCategoryLabel("LED lamp")).toBe("Led Lamp");
        expect(formatCategoryLabel("HDMI-stand")).toBe("HDMI Stand");
    });

    it("collapses repeated separators and trims", () => {
        expect(formatCategoryLabel("  side--table__small ")).toBe("Side Table Small");
    });

    it("returns an empty string for an empty input", () => {
        expect(formatCategoryLabel("")).toBe("");
    });
});
