// @vitest-environment node
import { describe, expect, it } from "vitest";
import { addressSchema } from "@/lib/validations/address";

const valid = {
    fullName: "Asha Rao",
    phoneCode: "+91",
    phone: "9876543210",
    addressLine1: "12 MG Road",
    city: "Udupi",
    state: "Karnataka",
    postalCode: "576101",
    country: "India",
    isDefault: false,
};

function errorFor(field: keyof typeof valid, value: unknown) {
    const result = addressSchema.safeParse({ ...valid, [field]: value });

    if (result.success) return undefined;

    return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("addressSchema", () => {
    it("accepts a complete address", () => {
        expect(addressSchema.safeParse(valid).success).toBe(true);
    });

    it("accepts the optional fields when they are given or left out", () => {
        expect(addressSchema.safeParse({ ...valid, addressLine2: "Flat 4", landmark: "Near temple" }).success).toBe(true);
        expect(addressSchema.safeParse(valid).success).toBe(true);
    });

    describe("fullName", () => {
        it("needs at least 3 characters", () => {
            expect(errorFor("fullName", "Al")).toBe("Full name must be at least 3 characters");
            expect(errorFor("fullName", "Ali")).toBeUndefined();
        });

        it("does not count surrounding spaces", () => {
            expect(errorFor("fullName", "  Al  ")).toBe("Full name must be at least 3 characters");
        });

        it("is trimmed in the parsed result", () => {
            const parsed = addressSchema.parse({ ...valid, fullName: "  Asha Rao  " });

            expect(parsed.fullName).toBe("Asha Rao");
        });
    });

    describe("phone", () => {
        it.each(["1234567", "123456789012345"])("accepts %s (7 to 15 digits)", (phone) => {
            expect(errorFor("phone", phone)).toBeUndefined();
        });

        it.each([
            ["123456", "too short"],
            ["1234567890123456", "too long"],
            ["98765abc10", "has letters"],
            ["+919876543210", "has a plus sign"],
            ["98765 43210", "has a space inside"],
            ["", "is empty"],
        ])("rejects %s (%s)", (phone) => {
            expect(errorFor("phone", phone)).toBe("Enter a valid phone number");
        });

        it("trims spaces around the number", () => {
            const parsed = addressSchema.parse({ ...valid, phone: " 9876543210 " });

            expect(parsed.phone).toBe("9876543210");
        });
    });

    it("needs a country code", () => {
        expect(errorFor("phoneCode", "")).toBe("Select a country code");
    });

    it("needs a street address of at least 5 characters", () => {
        expect(errorFor("addressLine1", "12 MG")).toBeUndefined();
        expect(errorFor("addressLine1", "12 M")).toBe("Address is required");
    });

    it("needs a city and a state of at least 2 characters", () => {
        expect(errorFor("city", "U")).toBe("City is required");
        expect(errorFor("state", "K")).toBe("State is required");
    });

    it("needs a country of at least 2 characters", () => {
        expect(errorFor("country", "I")).toBe("Country is required");
    });

    describe("postalCode", () => {
        it("accepts exactly 6 digits", () => {
            expect(errorFor("postalCode", "576101")).toBeUndefined();
        });

        it.each(["57610", "5761011", "57610A", "576 101", ""])("rejects %j", (code) => {
            expect(errorFor("postalCode", code)).toBe("PIN Code must be 6 digits");
        });
    });

    describe("isDefault", () => {
        it("is required", () => {
            const withoutDefault: Partial<typeof valid> = { ...valid };
            delete withoutDefault.isDefault;

            expect(addressSchema.safeParse(withoutDefault).success).toBe(false);
        });

        it("must be a boolean", () => {
            expect(addressSchema.safeParse({ ...valid, isDefault: "yes" }).success).toBe(false);
        });
    });

    it("reports every problem at once", () => {
        const result = addressSchema.safeParse({ ...valid, fullName: "", phone: "1", postalCode: "1" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.map((i) => i.path[0])).toEqual(
                expect.arrayContaining(["fullName", "phone", "postalCode"])
            );
        }
    });
});
