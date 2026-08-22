import { prisma } from "@/lib/prisma";

async function main() {
    // Coupons are intentionally not seeded.
    // They are created and managed from Admin → Coupons.
    console.log("🌱 Seed completed. Coupons are managed from the admin portal.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
