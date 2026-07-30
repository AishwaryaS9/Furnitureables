import { prisma } from "@/lib/prisma";
import { DiscountType } from "@/generated/prisma";

async function main() {
    console.log("🌱 Seeding coupons...");

    await prisma.coupon.upsert({
        where: {
            code: "WELCOME10",
        },
        update: {},
        create: {
            code: "WELCOME10",
            description: "10% off your first order",

            discountType: DiscountType.PERCENTAGE,
            discountValue: 10,

            minimumOrder: 1000,
            maximumDiscount: 1000,

            usageLimit: 100,
            usedCount: 0,

            expiresAt: new Date("2027-12-31"),

            isActive: true,
        },
    });

    await prisma.coupon.upsert({
        where: {
            code: "SAVE500",
        },
        update: {},
        create: {
            code: "SAVE500",
            description: "₹500 off orders above ₹5000",

            discountType: DiscountType.FIXED,
            discountValue: 500,

            minimumOrder: 5000,

            usageLimit: 100,
            usedCount: 0,

            expiresAt: new Date("2027-12-31"),

            isActive: true,
        },
    });

    console.log("✅ Coupons seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });