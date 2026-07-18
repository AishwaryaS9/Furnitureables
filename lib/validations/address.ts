import { z } from "zod";

export const addressSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters"),

    phoneCode: z
        .string()
        .min(1, "Select a country code"),

    phone: z
        .string()
        .trim()
        .regex(/^[0-9]{7,15}$/, "Enter a valid phone number"),

    addressLine1: z
        .string()
        .trim()
        .min(5, "Address is required"),

    addressLine2: z.string().optional(),

    landmark: z.string().optional(),

    city: z
        .string()
        .trim()
        .min(2, "City is required"),

    state: z
        .string()
        .trim()
        .min(2, "State is required"),

    postalCode: z
        .string()
        .trim()
        .regex(/^[0-9]{6}$/, "PIN Code must be 6 digits"),

    country: z
        .string()
        .trim()
        .min(2, "Country is required"),

    // isDefault: z.boolean().default(false),
    isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;